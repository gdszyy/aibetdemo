import type { BrowserOptions } from '@sentry/nextjs';

// ---------------------------------------------
// 基础常量 / Base constants
// ---------------------------------------------

// Keep the same sensitive-key strategy as the previous Sentry flow so the
// privacy boundary stays stable while the implementation is refactored.
// 沿用上一版 Sentry 的敏感字段识别策略，这样在重构实现时不会顺手改变
// 既有的隐私边界和脱敏语义。
const SENSITIVE_KEY_FRAGMENTS = [
    'authorization',
    'cookie',
    'token',
    'password',
    'secret',
    'phone',
    'mobile',
    'email',
    'bank',
    'card',
    'cvv',
    'cvc',
    'document',
    'idcard',
    'identity',
    'kyc',
];

// English: Message-level noise filters for browser/runtime errors that are
// usually unactionable and would otherwise create noisy Sentry issues.
// 中文：按 message 过滤的浏览器/运行时噪声规则。这些错误通常不可操作，
// 如果直接上报，往往只会在 Sentry 里制造大量低价值 issue。
const NOISE_MESSAGE_PATTERNS = [
    /extension context invalidated/i,
    /ResizeObserver loop limit exceeded/i,
    /ResizeObserver loop completed with undelivered notifications/i,
    /AbortError/i,
];

// English: Wallet-extension noise is handled separately from generic browser
// noise because we only want to drop it when both the message and the frame
// origin point to injected third-party code.
// 中文：钱包扩展噪声和普通浏览器噪声分开处理，因为这里不是只看 message，
// 而是要求 “报错文案 + 堆栈来源” 同时命中第三方注入脚本，才真正丢弃。
const INJECTED_WALLET_MESSAGE_PATTERNS = [/metamask extension not found/i, /failed to connect to metamask/i];

// English: React hydration mismatch errors become noisy in development when a
// browser extension mutates the DOM before React hydrates. Those are not app
// bugs, so we filter them when the mismatch clearly points to injected script
// or wallet-provider markup.
// 中文：开发环境下如果浏览器扩展在 React hydrate 前改了 DOM，就会触发
// hydration mismatch。这类通常不是应用自身 bug，因此当 mismatch 明确指向
// 注入脚本或钱包 provider 标记时，直接把它当噪声过滤掉。
const HYDRATION_MISMATCH_MESSAGE_PATTERNS = [
    /hydration-mismatch/i,
    /a tree hydrated but some attributes of the server rendered html didn't match/i,
];

const HYDRATION_EXTENSION_MARKERS = [
    /chrome-extension:\/\//i,
    /moz-extension:\/\//i,
    /safari-web-extension:\/\//i,
    /xverse-wallet-provider/i,
];

// English: Known third-party or injected script locations. These are used to
// prove an error originated outside our own application bundle.
// 中文：已知第三方/注入脚本的来源位置，用来判断异常是否来自应用自身 bundle 之外。
const THIRD_PARTY_SCRIPT_PATTERNS = [
    /^app:\/\/\/scripts\/inpage\.js/i,
    /^chrome-extension:\/\//i,
    /^moz-extension:\/\//i,
    /^safari-web-extension:\/\//i,
];

const MAX_SANITIZE_DEPTH = 4;
const MAX_ARRAY_ITEMS = 10;
const MAX_STRING_LENGTH = 300;
const REDACTED_VALUE = '[REDACTED]';
const TRUNCATED_SUFFIX = '...[truncated]';

type BeforeSend = NonNullable<BrowserOptions['beforeSend']>;
type BeforeBreadcrumb = NonNullable<BrowserOptions['beforeBreadcrumb']>;
export type SentryBeforeSendEvent = Parameters<BeforeSend>[0];
export type SentryBeforeSendHint = Parameters<BeforeSend>[1];
export type SentryBeforeBreadcrumb = Parameters<BeforeBreadcrumb>[0];
type Breadcrumb = NonNullable<SentryBeforeSendEvent['breadcrumbs']>[number];
type SentryStackFrame = {
    filename?: string;
    abs_path?: string;
    module?: string;
};

// ---------------------------------------------
// 基础脱敏工具 / Core redaction helpers
// ---------------------------------------------

// English: Lightweight object guard used throughout the recursive sanitizer.
// 中文：递归脱敏过程中使用的轻量对象守卫。
const isRecord = (value: unknown): value is Record<string, unknown> => {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
};

// English: Match keys by fragment instead of exact equality so variations such
// as `accessToken`, `user_email`, or `kycDocument` still get redacted.
// 中文：这里按“片段包含”而不是“完全相等”匹配字段名，这样像
// `accessToken`、`user_email`、`kycDocument` 这类变体也能被脱敏。
const isSensitiveKey = (key: string) => {
    const normalizedKey = key.toLowerCase();
    return SENSITIVE_KEY_FRAGMENTS.some((fragment) => normalizedKey.includes(fragment));
};

// English: Cap long strings so oversized payloads do not crowd out more useful
// context or hit payload-size limits.
// 中文：限制超长字符串长度，避免单个字段把 payload 撑得过大，挤掉更有价值的上下文。
const truncateString = (value: string) => {
    if (value.length <= MAX_STRING_LENGTH) {
        return value;
    }

    return `${value.slice(0, MAX_STRING_LENGTH)}${TRUNCATED_SUFFIX}`;
};

// English: Reuse one query-value sanitizer across URL strings and
// URLSearchParams so ordinary query fields stay readable while sensitive keys
// follow the same redaction policy everywhere.
// 中文：URL 字符串和 URLSearchParams 统一复用这套 query value 清洗逻辑，
// 这样普通字段能保留可读性，而敏感字段在所有入口上都遵循同一套脱敏规则。
const sanitizeQueryEntries = (entries: Array<[string, string]>) => {
    return entries.map(([key, value]) => [key, isSensitiveKey(key) ? REDACTED_VALUE : truncateString(value)] as const);
};

// English: URL sanitization is intentionally query-aware because request URLs
// are one of the highest-value debugging fields in Sentry payloads.
// 中文：URL 清洗单独做成 query-aware 逻辑，因为 request.url 往往是 Sentry
// payload 里排查价值最高的字段之一。
export const sanitizeUrl = (value: string) => {
    // English: Keep the path and preserve ordinary query values. Only redact
    // keys that match the sensitive-key allowlist so URLs stay useful for
    // debugging while known secrets remain hidden.
    // 中文：保留 path，并尽量保留普通 query 参数值；只有命中敏感字段规则的
    // key 才会被打码，这样 URL 既保留排查价值，也能隐藏明确的隐私字段。
    try {
        const parsedUrl = new URL(value, 'http://localhost');
        const redactedQueryEntries = sanitizeQueryEntries([...parsedUrl.searchParams.entries()]).map(
            ([key, entryValue]) => `${encodeURIComponent(key)}=${encodeURIComponent(entryValue)}`,
        );
        const redactedQuery = redactedQueryEntries.length ? `?${redactedQueryEntries.join('&')}` : '';
        const pathWithQuery = `${parsedUrl.pathname}${redactedQuery}`;

        return parsedUrl.origin === 'http://localhost' ? pathWithQuery : `${parsedUrl.origin}${pathWithQuery}`;
    } catch {
        return value.split('?')[0];
    }
};

export const sanitizeForSentry = (
    value: unknown,
    currentKey?: string,
    depth = 0,
    seen = new WeakSet<object>(),
): unknown => {
    // Redact by key name first so nested objects such as headers, payloads,
    // and custom extra data do not leak sensitive values into Sentry.
    // 先按字段名做拦截，这样 headers、payload、extra 里的深层嵌套数据
    // 也能在进入 Sentry 前被统一打码。
    if (currentKey && isSensitiveKey(currentKey)) {
        return REDACTED_VALUE;
    }

    if (value == null || typeof value === 'number' || typeof value === 'boolean') {
        return value;
    }

    if (typeof value === 'string') {
        if (currentKey?.toLowerCase() === 'url') {
            return sanitizeUrl(value);
        }

        return truncateString(value);
    }

    if (value instanceof Date) {
        return value.toISOString();
    }

    if (value instanceof URLSearchParams) {
        return Object.fromEntries(sanitizeQueryEntries([...value.entries()]));
    }

    // English: Collapse nested Error objects to a minimal safe shape. Their
    // original stack/message will still be present on the main Sentry event.
    // 中文：嵌套 Error 对象在 extra/context 里只保留最小安全结构，
    // 主事件本身的 stack/message 仍然会由 Sentry 正常保留。
    if (value instanceof Error) {
        return {
            name: value.name,
            message: truncateString(value.message),
        };
    }

    // English: Depth limiting prevents pathological payloads from exploding in
    // size or walking arbitrarily deep recursive objects.
    // 中文：限制递归深度，避免遇到超深对象时 payload 膨胀或无限递归。
    if (depth >= MAX_SANITIZE_DEPTH) {
        return '[MaxDepthReached]';
    }

    if (Array.isArray(value)) {
        return value.slice(0, MAX_ARRAY_ITEMS).map((item) => sanitizeForSentry(item, currentKey, depth + 1, seen));
    }

    if (!isRecord(value)) {
        return String(value);
    }

    if (seen.has(value)) {
        return '[Circular]';
    }

    seen.add(value);

    return Object.fromEntries(
        Object.entries(value).map(([key, entryValue]) => [key, sanitizeForSentry(entryValue, key, depth + 1, seen)]),
    );
};

// English: Tags are primarily used for filtering and aggregation inside
// Sentry, so we keep them short and aggressively sanitized.
// 中文：tag 主要用于 Sentry 内部筛选和聚合，因此这里会保持它简短且更激进地脱敏。
export const sanitizeTags = (tags?: Record<string, string>) => {
    if (!tags) {
        return tags;
    }

    return Object.fromEntries(
        Object.entries(tags).map(([key, value]) => {
            if (isSensitiveKey(key)) {
                return [key, REDACTED_VALUE];
            }

            if (key.toLowerCase().includes('url')) {
                return [key, sanitizeUrl(value)];
            }

            return [key, truncateString(value)];
        }),
    );
};

// ---------------------------------------------
// 事件级噪声过滤 / Event-level noise filters
// ---------------------------------------------

// English: Collect all candidate message strings from both the top-level event
// and nested exception values so one shared filter can work across browsers and
// capture paths.
// 中文：把顶层 event message 和 exception.value/type 都收集起来，
// 这样一套 message 过滤规则就能覆盖不同浏览器和不同捕捉路径。
const getEventMessages = (event: {
    message?: string;
    exception?: { values?: Array<{ type?: string; value?: string }> };
}) => {
    const exceptionMessages =
        event.exception?.values?.flatMap((entry) =>
            [entry.type, entry.value].filter((value): value is string => Boolean(value)),
        ) || [];

    return [event.message, ...exceptionMessages].filter((value): value is string => Boolean(value));
};

const shouldDropEventByMessage = (messages: string[]) => {
    return NOISE_MESSAGE_PATTERNS.some((pattern) => messages.some((message) => pattern.test(message)));
};

// English: Third-party source checks are intentionally conservative: an event
// only counts as injected noise when its frame locations clearly point to known
// extension/inpage origins.
// 中文：第三方来源判断故意做得比较保守，只有当堆栈位置明确指向已知扩展/
// 注入脚本来源时，才把它视为外部噪声。
const isThirdPartyScriptLocation = (value?: string) => {
    if (!value) {
        return false;
    }

    return THIRD_PARTY_SCRIPT_PATTERNS.some((pattern) => pattern.test(value));
};

const getEventFrames = (event: {
    exception?: { values?: Array<{ stacktrace?: { frames?: SentryStackFrame[] } }> };
}) => {
    return event.exception?.values?.flatMap((entry) => entry.stacktrace?.frames || []) || [];
};

// English: Wallet noise is dropped only when the message suggests injected
// wallet behavior and at least one frame comes from an injected script source.
// 中文：钱包噪声只有在“报错像钱包注入问题”且“至少一个堆栈帧来自注入脚本”
// 这两个条件同时成立时才会被丢弃。
const shouldDropInjectedWalletNoise = (event: SentryBeforeSendEvent) => {
    const messages = getEventMessages(event);
    const hasWalletNoiseMessage = INJECTED_WALLET_MESSAGE_PATTERNS.some((pattern) =>
        messages.some((message) => pattern.test(message)),
    );

    if (!hasWalletNoiseMessage) {
        return false;
    }

    return getEventFrames(event).some((frame) =>
        [frame.filename, frame.abs_path, frame.module].some((value) => isThirdPartyScriptLocation(value)),
    );
};

const shouldDropExtensionHydrationMismatch = (event: SentryBeforeSendEvent) => {
    const messages = getEventMessages(event);
    const hasHydrationMismatchMessage = HYDRATION_MISMATCH_MESSAGE_PATTERNS.some((pattern) =>
        messages.some((message) => pattern.test(message)),
    );

    if (!hasHydrationMismatchMessage) {
        return false;
    }

    return messages.some((message) => HYDRATION_EXTENSION_MARKERS.some((marker) => marker.test(message)));
};

// ---------------------------------------------
// Breadcrumb 噪声过滤 / Breadcrumb noise filters
// ---------------------------------------------

// English: The individual breadcrumb predicates stay intentionally small so the
// combined drop table below remains easy to read and adjust during review.
// 中文：每个 breadcrumb 判定函数都刻意保持很小，这样下面统一的规则表在
// 审查和调整时会更直观。
const isWsConsoleBreadcrumb = (breadcrumb: SentryBeforeBreadcrumb) => {
    if (breadcrumb.category !== 'console') {
        return false;
    }

    const message = breadcrumb.message || '';
    return message.startsWith('[ws]');
};

const isLowSignalConsoleBreadcrumb = (breadcrumb: SentryBeforeBreadcrumb) => {
    if (breadcrumb.category !== 'console') {
        return false;
    }

    return breadcrumb.level === 'log' || breadcrumb.level === 'info' || breadcrumb.level === 'debug';
};

const isTanStackWarningBreadcrumb = (breadcrumb: SentryBeforeBreadcrumb) => {
    if (breadcrumb.category !== 'console' || breadcrumb.level !== 'warning') {
        return false;
    }

    const message = breadcrumb.message || '';
    return message.includes('[TanStack Query]');
};

const isNextMetadataWarningBreadcrumb = (breadcrumb: SentryBeforeBreadcrumb) => {
    if (breadcrumb.category !== 'console' || breadcrumb.level !== 'warning') {
        return false;
    }

    const message = breadcrumb.message || '';
    return message.includes('metadataBase property in metadata export is not set');
};

const isHydrationMismatchBreadcrumb = (breadcrumb: SentryBeforeBreadcrumb) => {
    if (breadcrumb.category !== 'console' || breadcrumb.level !== 'error') {
        return false;
    }

    const message = breadcrumb.message || '';
    return (
        message.includes('react.dev/link/hydration-mismatch') ||
        message.includes("A tree hydrated but some attributes of the server rendered HTML didn't match")
    );
};

const isSuccessfulFetchBreadcrumb = (breadcrumb: SentryBeforeBreadcrumb) => {
    if (breadcrumb.category !== 'fetch' && breadcrumb.type !== 'http') {
        return false;
    }

    const statusCode = breadcrumb.data?.status_code;
    return typeof statusCode === 'number' && statusCode < 400;
};

type BreadcrumbDropRule = {
    label: string;
    shouldDrop: (breadcrumb: SentryBeforeBreadcrumb) => boolean;
};

// English: Keep breadcrumb dropping rules together so we have one place to
// reason about which background signals are considered low-value noise.
// 中文：把 breadcrumb 丢弃规则集中在一起，后面排查“哪些背景信号属于低价值噪声”
// 时，只需要看这一个地方。
const BREADCRUMB_DROP_RULES: BreadcrumbDropRule[] = [
    {
        label: 'ws-console-noise',
        shouldDrop: isWsConsoleBreadcrumb,
    },
    {
        label: 'low-signal-console',
        shouldDrop: isLowSignalConsoleBreadcrumb,
    },
    {
        label: 'tanstack-warning',
        shouldDrop: isTanStackWarningBreadcrumb,
    },
    {
        label: 'next-metadata-warning',
        shouldDrop: isNextMetadataWarningBreadcrumb,
    },
    {
        label: 'hydration-mismatch-console',
        shouldDrop: isHydrationMismatchBreadcrumb,
    },
    {
        label: 'successful-fetch',
        shouldDrop: isSuccessfulFetchBreadcrumb,
    },
];

const shouldDropBreadcrumb = (breadcrumb: SentryBeforeBreadcrumb) => {
    return BREADCRUMB_DROP_RULES.some((rule) => rule.shouldDrop(breadcrumb));
};

// English: Breadcrumbs are filtered first, then sanitized. This ordering keeps
// noisy low-value records out of the final payload before we spend effort
// normalizing them.
// 中文：breadcrumb 会先过滤、再清洗。这样可以先把低价值噪声挡在外面，
// 避免对本来就不需要保留的记录继续做无意义的标准化处理。
export const sanitizeBreadcrumb = (breadcrumb: SentryBeforeBreadcrumb): SentryBeforeBreadcrumb | null => {
    // English: Breadcrumb filtering is centralized in one rule list so the
    // policy stays easy to audit and extend.
    // 中文：breadcrumb 过滤策略统一走这一份规则表，后面无论审查还是扩展都更容易。
    if (shouldDropBreadcrumb(breadcrumb)) {
        return null;
    }

    return {
        ...breadcrumb,
        data: sanitizeForSentry(breadcrumb.data) as typeof breadcrumb.data,
        message: breadcrumb.message ? truncateString(breadcrumb.message) : breadcrumb.message,
    };
};

// ---------------------------------------------
// 最终事件出口 / Final event scrubber
// ---------------------------------------------

// English: This is the final shared scrubber for every event that survives
// runtime filtering. Manual captures, browser global handlers, and React UI
// fallbacks all converge here before transport.
// 中文：这是所有事件在真正发送前共享的最后一道清洗出口。手动上报、
// 浏览器全局异常、React UI fallback 最终都会收敛到这里。
export const sanitizeErrorEvent = (event: SentryBeforeSendEvent): SentryBeforeSendEvent | null => {
    // Drop known low-signal browser noise before we spend time normalizing the
    // event. This keeps the final flow focused on actionable app errors.
    // 先过滤低信号浏览器噪声，再做后续清洗，避免把无价值事件也送进标准化流程。
    if (shouldDropEventByMessage(getEventMessages(event))) {
        return null;
    }

    if (shouldDropInjectedWalletNoise(event)) {
        return null;
    }

    if (shouldDropExtensionHydrationMismatch(event)) {
        return null;
    }

    return {
        ...event,
        // Normalize the event shape here so all reporting paths
        // (manual capture, global handlers, React boundaries) share one scrubber.
        // 在这里统一整理事件结构，让手动 capture、全局异常、React 错误边界
        // 最终都走同一个脱敏器和过滤策略。
        request: event.request
            ? {
                  ...event.request,
                  url: event.request.url ? sanitizeUrl(event.request.url) : event.request.url,
                  // English: Drop request headers entirely to keep browser
                  // payloads compact. URL and request data are the higher-value fields.
                  // 中文：这里直接去掉 request headers，优先保留更有价值的 url 和 data，
                  // 这样浏览器端 payload 会明显更短。
                  headers: undefined,
                  data: sanitizeForSentry(event.request.data),
                  cookies: undefined,
                  query_string: undefined,
              }
            : event.request,
        extra: sanitizeForSentry(event.extra) as typeof event.extra,
        contexts: sanitizeForSentry(event.contexts) as typeof event.contexts,
        // Preserve only the user id. This gives us per-user correlation
        // without broadening the amount of user PII we send.
        // 这里只保留 user.id，这样既能按用户聚合问题，又不会顺手扩大用户隐私字段的采集范围。
        user: event.user?.id ? { id: String(event.user.id) } : undefined,
        // English: Breadcrumbs are both sanitized and selectively filtered so
        // they stay useful without dominating the final payload.
        // 中文：breadcrumb 在这里同时做脱敏和选择性过滤，目标是保留诊断价值，
        // 但不要让它们在最终 payload 里喧宾夺主。
        breadcrumbs: event.breadcrumbs
            ?.map((breadcrumb: Breadcrumb) => sanitizeBreadcrumb(breadcrumb))
            .filter((breadcrumb): breadcrumb is Breadcrumb => breadcrumb !== null),
    };
};
