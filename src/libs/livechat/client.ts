/** LiveChat Widget 单例：stub / prepare / pushContext / maximize / hide。 */
import { installLiveChatSnippet } from './install-snippet';
import type { LiveChatContext } from './types';

type PrepareState = 'idle' | 'loading' | 'ready';

const PREPARE_TIMEOUT_MS = 15_000;

let prepareState: PrepareState = 'idle';
let preparePromise: Promise<boolean> | null = null;
let latestContext: LiveChatContext | null = null;
let pendingMaximize = false;
let suppressLauncherCleanup: (() => void) | null = null;

function reportLiveChatError(message: string, error?: unknown): void {
    if (process.env.NODE_ENV !== 'development') return;
    console.error(`[LiveChat] ${message}`, error);
}

function parseLicense(license: string): number | null {
    const licenseNumber = Number(license);
    if (!Number.isFinite(licenseNumber) || licenseNumber <= 0) return null;
    return licenseNumber;
}

function applyContext(ctx: LiveChatContext): void {
    const widget = window.LiveChatWidget;
    if (!widget) return;
    const name = ctx.name?.trim();
    if (name) widget.call('set_customer_name', name);
    const email = ctx.email?.trim();
    if (email) widget.call('set_customer_email', email);
    widget.call('set_session_variables', ctx.vars);
}

function onWidgetReady(): void {
    prepareState = 'ready';
    window.LiveChatWidget?.call('hide');
    if (latestContext) applyContext(latestContext);
    if (pendingMaximize) {
        pendingMaximize = false;
        maximize();
    }
}

function resetLocalContext(): void {
    latestContext = null;
    pendingMaximize = false;
    suppressLauncherCleanup?.();
    suppressLauncherCleanup = null;
}

/** 同步安装官方 snippet 桩（asyncInit，不自动拉脚本）。 */
export function ensureLiveChatStub(license: string, groupId: number): boolean {
    if (typeof window === 'undefined' || !license) return false;

    const licenseNumber = parseLicense(license);
    if (!licenseNumber) return false;

    if (!window.LiveChatWidget) {
        installLiveChatSnippet(licenseNumber, groupId);
    } else if (prepareState !== 'ready' && window.__lc) {
        window.__lc.group = groupId;
    }

    return Boolean(window.LiveChatWidget);
}

/** 登录后空闲预热：init tracking.js 并等待 ready。 */
export function prepareLiveChat(license: string, groupId: number): Promise<boolean> {
    if (typeof window === 'undefined' || !license) return Promise.resolve(false);
    if (prepareState === 'ready') return Promise.resolve(true);
    if (preparePromise) return preparePromise;
    if (!ensureLiveChatStub(license, groupId)) return Promise.resolve(false);

    prepareState = 'loading';
    preparePromise = new Promise<boolean>((resolve) => {
        const widget = window.LiveChatWidget;
        if (!widget) {
            prepareState = 'idle';
            preparePromise = null;
            resolve(false);
            return;
        }

        let settled = false;
        const finish = (isReady: boolean): void => {
            if (settled) return;
            settled = true;
            window.clearTimeout(timeoutId);
            preparePromise = null;
            if (!isReady) prepareState = 'idle';
            resolve(isReady);
        };

        const timeoutId = window.setTimeout(() => {
            reportLiveChatError('prepare timeout');
            finish(false);
        }, PREPARE_TIMEOUT_MS);

        widget.once('ready', () => {
            onWidgetReady();
            finish(true);
        });
        widget.init?.();
    });

    return preparePromise.catch((error: unknown) => {
        reportLiveChatError('prepare failed', error);
        prepareState = 'idle';
        preparePromise = null;
        return false;
    });
}

export function pushContext(ctx: LiveChatContext): void {
    latestContext = ctx;
    if (prepareState === 'ready') applyContext(ctx);
}

export async function openLiveChatWidget(license: string, groupId: number, ctx: LiveChatContext): Promise<boolean> {
    if (!ensureLiveChatStub(license, groupId)) return false;
    pushContext(ctx);
    if (prepareState === 'ready') {
        maximize();
        return true;
    }

    pendingMaximize = true;
    const isReady = await prepareLiveChat(license, groupId);
    if (!isReady) {
        pendingMaximize = false;
        return false;
    }

    return true;
}

export function maximize(): void {
    window.LiveChatWidget?.call('maximize');
}

/** 用户退出或会话失效时隐藏 widget；官方 destroy 后需要刷新页面才可再次使用。 */
export function clearLiveChatContext(): void {
    if (prepareState === 'idle' && !window.LiveChatWidget && !latestContext) return;
    resetLocalContext();
    const widget = window.LiveChatWidget;
    if (!widget) return;
    widget.call('hide');
    widget.call('set_session_variables', {});
}

/** 移动端：minimize 后 hide，避免与站内悬浮球重复。 */
export function suppressLauncher(): () => void {
    const widget = window.LiveChatWidget;
    if (!widget) return () => {};

    let isDisposed = false;
    let visibilityHandler: ((payload: unknown) => void) | null = null;
    const attachVisibilityHandler = (): void => {
        if (isDisposed) return;
        const handler = (payload: unknown): void => {
            if ((payload as { visibility?: string } | undefined)?.visibility === 'minimized') widget.call('hide');
        };
        visibilityHandler = handler;
        widget.on('visibility_changed', handler);
    };

    if (prepareState === 'ready') {
        attachVisibilityHandler();
    } else {
        widget.once('ready', attachVisibilityHandler);
    }

    return () => {
        isDisposed = true;
        if (visibilityHandler) widget.off('visibility_changed', visibilityHandler);
    };
}

export function ensureLauncherSuppressed(): void {
    if (suppressLauncherCleanup) return;
    suppressLauncherCleanup = suppressLauncher();
}

export function hide(): void {
    window.LiveChatWidget?.call('hide');
}
