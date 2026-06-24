/**
 * 底-文字对比度校验（WCAG 相对亮度 / 灰度对比）
 * =====================================================================
 * 理论基础：把每个颜色折算成「人眼感知灰度」（相对亮度 relative luminance），
 * 用两块灰度的比值衡量「底-文字」可读性。这正是「同一色调在 0 饱和度下灰度不同」
 * 直觉的严谨形式——HSL 的 L 不是感知灰度（纯黄 L=50% 远亮于纯蓝 L=50%），
 * 真正的灰度要按 sRGB 通道做 gamma 线性化后用 0.2126R+0.7152G+0.0722B 加权。
 *
 * 流程：解析 theme.css 的 8 套 scheme → 按 :root 级联补全 → 解析 var()/rgba/gradient
 *      → 半透明底合成到不透明基底 → 计算 WCAG 对比度 → 双档（AA 门槛 / AAA 推荐）判级。
 *
 * 判级：ratio ≥ AAA → PASS；AA ≤ ratio < AAA → WARN；ratio < AA → FAIL。
 *      存在 FAIL → 退出码 1（可接入 CI）。WARN 默认不致命（--strict 可改）。
 *
 * 规范文档：.agent/references/contrast-checking.md（本脚本是其唯一可执行真源）。
 * 运行：pnpm theme:contrast            仅打印 FAIL/WARN + 汇总
 *      pnpm theme:contrast --all       连 PASS 一起打印
 *      pnpm theme:contrast --scheme=betbus
 *      pnpm theme:contrast --strict    把 WARN 也算失败（退出码 1）
 *      pnpm theme:contrast --json      输出机器可读 JSON
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const THEME_CSS = path.join(ROOT, 'src/assets/css/theme.css');

// =====================================================================
// 颜色模型
// =====================================================================
interface RGBA {
    r: number; // 0-255
    g: number; // 0-255
    b: number; // 0-255
    a: number; // 0-1
}

const clamp255 = (n: number) => Math.max(0, Math.min(255, n));

const parseHex = (hex: string): RGBA => {
    let h = hex.replace('#', '');
    if (h.length === 3 || h.length === 4) {
        h = h
            .split('')
            .map((c) => c + c)
            .join('');
    }
    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    const a = h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1;
    return { r, g, b, a };
};

const HEX_RE = /#[0-9a-fA-F]{3,8}\b/g;
const RGBA_RE = /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/g;

/** 从一个已展开（无 var()）的 CSS 值中提取所有色标；渐变会返回多个停靠色。 */
const extractColors = (value: string): RGBA[] => {
    const colors: RGBA[] = [];
    for (const m of value.matchAll(HEX_RE)) colors.push(parseHex(m[0]));
    for (const m of value.matchAll(RGBA_RE)) {
        colors.push({
            r: clamp255(Number(m[1])),
            g: clamp255(Number(m[2])),
            b: clamp255(Number(m[3])),
            a: m[4] !== undefined ? Number(m[4]) : 1,
        });
    }
    if (colors.length === 0 && /\btransparent\b/.test(value)) colors.push({ r: 0, g: 0, b: 0, a: 0 });
    return colors;
};

/** 把前景（可能半透明）合成到不透明底上，得到实际可见颜色。 */
const composite = (fg: RGBA, bg: RGBA): RGBA => {
    const a = fg.a + bg.a * (1 - fg.a);
    const mix = (f: number, b: number) => (a === 0 ? 0 : (f * fg.a + b * bg.a * (1 - fg.a)) / a);
    return { r: mix(fg.r, bg.r), g: mix(fg.g, bg.g), b: mix(fg.b, bg.b), a };
};

// WCAG 2.x 相对亮度 + 对比度
const channelToLinear = (c: number) => {
    const cs = c / 255;
    return cs <= 0.03928 ? cs / 12.92 : ((cs + 0.055) / 1.055) ** 2.4;
};
const relativeLuminance = (c: RGBA) =>
    0.2126 * channelToLinear(c.r) + 0.7152 * channelToLinear(c.g) + 0.0722 * channelToLinear(c.b);
const contrastRatio = (c1: RGBA, c2: RGBA) => {
    const l1 = relativeLuminance(c1);
    const l2 = relativeLuminance(c2);
    const hi = Math.max(l1, l2);
    const lo = Math.min(l1, l2);
    return (hi + 0.05) / (lo + 0.05);
};
const toHex = (c: RGBA) => {
    const h = (n: number) => clamp255(Math.round(n)).toString(16).padStart(2, '0');
    return `#${h(c.r)}${h(c.g)}${h(c.b)}${c.a < 1 ? h(c.a * 255) : ''}`;
};

// =====================================================================
// theme.css 解析 + scheme 级联
// =====================================================================
type VarMap = Record<string, string>;

const stripComments = (s: string) => s.replace(/\/\*[\s\S]*?\*\//g, '');

interface SchemeBlock {
    scheme: string;
    vars: VarMap;
}

const parseSchemeBlocks = (cssRaw: string): SchemeBlock[] => {
    const css = stripComments(cssRaw);
    const blocks: SchemeBlock[] = [];
    const selectorRe = /(:root(?:\.[a-z0-9-]+)?)\s*\{/g;
    let m: RegExpExecArray | null;
    // biome-ignore lint/suspicious/noAssignInExpressions: regex 迭代惯用法
    while ((m = selectorRe.exec(css))) {
        const selector = m[1];
        let depth = 1;
        let i = selectorRe.lastIndex;
        const start = i;
        while (i < css.length && depth > 0) {
            if (css[i] === '{') depth++;
            else if (css[i] === '}') depth--;
            i++;
        }
        const body = css.slice(start, i - 1);
        const scheme = selector === ':root' ? 'gtb' : selector.slice(':root.'.length);
        const vars: VarMap = {};
        for (const d of body.matchAll(/--([\w-]+)\s*:\s*([^;]+);/g)) vars[d[1]] = d[2].trim();
        blocks.push({ scheme, vars });
        selectorRe.lastIndex = i;
    }
    return blocks;
};

/** 每套 scheme 的有效变量 = :root 基底 ∪ 该 scheme 覆盖（模拟 CSS 级联）。 */
const buildEffective = (blocks: SchemeBlock[]): Record<string, VarMap> => {
    const base = blocks.find((b) => b.scheme === 'gtb')?.vars ?? {};
    const out: Record<string, VarMap> = {};
    for (const b of blocks) out[b.scheme] = b.scheme === 'gtb' ? { ...base } : { ...base, ...b.vars };
    return out;
};

/** 递归展开 var(--x[, fallback])，直至无 var()。 */
const expandValue = (vars: VarMap, value: string, seen: Set<string> = new Set()): string => {
    const varRe = /var\(\s*--([\w-]+)\s*(?:,\s*([^)]+))?\)/;
    let v = value;
    let guard = 0;
    while (varRe.test(v) && guard++ < 100) {
        v = v.replace(varRe, (_full, name: string, fallback?: string) => {
            if (seen.has(name)) return fallback ?? 'transparent';
            const ref = vars[name];
            if (ref === undefined) return fallback ?? 'transparent';
            return expandValue(vars, ref, new Set(seen).add(name));
        });
    }
    return v.trim();
};

const resolveColors = (vars: VarMap, token: string): RGBA[] =>
    extractColors(expandValue(vars, `var(--${token})`));

// =====================================================================
// 「底-文字」配对契约（语义令牌层）
// 这是规范的可执行部分：列出 UI 中真实成对出现的 前景/底 组合。
//   textClass: normal = 普通正文 (AA 4.5 / AAA 7)
//              large  = 大字 ≥18.66px粗 或 ≥24px (AA 3 / AAA 4.5)
//              graphic= 非文字/图标/边界 (AA 3，无 AAA 档)
//   over: 当底为半透明时，合成到该不透明基底上（默认 page-bg）
// =====================================================================
type TextClass = 'normal' | 'large' | 'graphic';
interface Pair {
    group: string;
    fg: string;
    bg: string;
    textClass: TextClass;
    /** 当底（或其上层）为半透明时，自上而下合成到的不透明基底链，默认 ['page-bg']。 */
    over?: string | string[];
    note: string;
}

/** 文字档（normal/large）会影响退出码；图形档（graphic）仅作参考，不阻断 CI。 */
const isBlocking = (pair: Pair) => pair.textClass !== 'graphic';

const PAIRS: Pair[] = [
    // —— 正文 / 三级表面 ——
    { group: '正文·表面', fg: 'content-primary', bg: 'page-bg', textClass: 'normal', note: '主文字 / 页面底' },
    { group: '正文·表面', fg: 'content-primary', bg: 'surface-1', textClass: 'normal', note: '主文字 / 卡片' },
    { group: '正文·表面', fg: 'content-primary', bg: 'surface-2', textClass: 'normal', note: '主文字 / 输入·悬浮' },
    { group: '正文·表面', fg: 'content-primary', bg: 'surface-3', textClass: 'normal', note: '主文字 / 嵌套·分隔' },
    { group: '正文·表面', fg: 'content-secondary', bg: 'page-bg', textClass: 'normal', note: '次级文字 / 页面底' },
    { group: '正文·表面', fg: 'content-secondary', bg: 'surface-1', textClass: 'normal', note: '次级文字 / 卡片' },
    { group: '正文·表面', fg: 'content-secondary', bg: 'surface-2', textClass: 'normal', note: '次级文字 / 输入·悬浮' },
    { group: '正文·表面', fg: 'content-muted', bg: 'page-bg', textClass: 'normal', note: '弱文字 / 页面底（易踩线）' },
    { group: '正文·表面', fg: 'content-muted', bg: 'surface-1', textClass: 'normal', note: '弱文字 / 卡片（易踩线）' },

    // —— 传统 filltext 文字填充（仍被大量直接使用）——
    { group: 'filltext文字', fg: 'filltext-ft-h', bg: 'surface-1', textClass: 'normal', note: '最深文字 / 卡片' },
    { group: 'filltext文字', fg: 'filltext-ft-g', bg: 'surface-1', textClass: 'normal', note: '近主文字 / 卡片' },
    { group: 'filltext文字', fg: 'filltext-ft-f', bg: 'surface-1', textClass: 'normal', note: '次文字·导航 / 卡片' },
    { group: 'filltext文字', fg: 'filltext-ft-e', bg: 'surface-1', textClass: 'normal', note: '弱文字 / 卡片（高风险）' },
    { group: 'filltext文字', fg: 'filltext-ft-f', bg: 'page-bg', textClass: 'normal', note: '次文字 / 页面底' },
    { group: 'filltext文字', fg: 'filltext-ft-e', bg: 'page-bg', textClass: 'normal', note: '弱文字 / 页面底（高风险）' },

    // —— 品牌 / 赔率色块上的文字 ——
    { group: '品牌·赔率块', fg: 'on-brand', bg: 'brand-primary-0', textClass: 'normal', note: '品牌主色按钮文字' },
    { group: '品牌·赔率块', fg: 'on-brand', bg: 'brand-primary-4', textClass: 'normal', note: '品牌按下态文字' },
    { group: '品牌·赔率块', fg: 'content-inverse', bg: 'content-primary', textClass: 'normal', note: '反色文字 / tooltip 底（content-primary 反相，真实用例）' },
    { group: '品牌·赔率块', fg: 'content-inverse', bg: 'filltext-ft-g', textClass: 'normal', note: '反色文字 / 计数徽章底（checkbox-filter）' },
    { group: '品牌·赔率块', fg: 'odds-selected-text', bg: 'odds-selected-bg', textClass: 'normal', note: '选中赔率文字（底可能是渐变，取最差停靠色）' },

    // —— 功能色块上的文字（真实组件用 text-neutral-white-h 白字；bonus 实际用深色字/底纹，保留白字项以警示金底白字风险）——
    { group: '功能色块', fg: 'neutral-white-h', bg: 'func-win-solid', textClass: 'normal', note: '赢·绿块白字（bg-func-win-solid text-neutral-white-h）' },
    { group: '功能色块', fg: 'neutral-white-h', bg: 'func-lost-solid', textClass: 'normal', note: '输·红块白字（bg-func-lost-solid text-neutral-white-h）' },
    { group: '功能色块', fg: 'neutral-white-h', bg: 'func-favorite-solid', textClass: 'normal', note: '收藏·橙块白字（bg-func-favorite-solid）' },
    { group: '功能色块', fg: 'func-bonus-on', bg: 'func-bonus', textClass: 'normal', note: '奖金·金块深色字（bg-func-bonus text-func-bonus-on）' },

    // —— 功能色作为文字直接放在中性表面 ——
    { group: '功能色作文字', fg: 'func-win', bg: 'surface-1', textClass: 'normal', note: '赢·绿字 / 卡片' },
    { group: '功能色作文字', fg: 'func-lost', bg: 'surface-1', textClass: 'normal', note: '输·红字 / 卡片' },
    { group: '功能色作文字', fg: 'func-favorite', bg: 'surface-1', textClass: 'normal', note: '橙字 / 卡片（高风险）' },
    { group: '功能色作文字', fg: 'func-pending', bg: 'surface-1', textClass: 'normal', note: '待定·琥珀字 / 卡片（高风险）' },

    // —— 状态条（底为半透明，合成到卡片上）——
    { group: '状态条', fg: 'status-success-text', bg: 'status-success-surface', over: 'surface-1', textClass: 'normal', note: '成功文字 / 成功底' },
    { group: '状态条', fg: 'status-danger-text', bg: 'status-danger-surface', over: 'surface-1', textClass: 'normal', note: '危险文字 / 危险底' },

    // —— 移动端导航（底为半透明，合成到页面底）——
    { group: '移动导航', fg: 'mobile-nav-text', bg: 'mobile-nav-bg', over: 'page-bg', textClass: 'normal', note: '导航文字' },
    { group: '移动导航', fg: 'mobile-nav-active-text', bg: 'mobile-nav-bg', over: 'page-bg', textClass: 'normal', note: '导航激活文字' },

    // —— 侧栏交互行 ——
    { group: '侧栏行', fg: 'interactive-row-text', bg: 'surface-shell', textClass: 'normal', note: '菜单项文字 / 外壳' },
    { group: '侧栏行', fg: 'interactive-row-active-text', bg: 'surface-shell', textClass: 'normal', note: '菜单激活文字 / 外壳' },

    // —— 非文字 / 图形（3:1 档，仅参考不阻断；装饰性分隔线本不受 WCAG 1.4.11 约束）——
    { group: '图形3:1', fg: 'border-strong', bg: 'surface-1', textClass: 'graphic', note: '强描边 / 卡片边界（功能性边界才需达标）' },
    { group: '图形3:1', fg: 'border-strong', bg: 'page-bg', textClass: 'graphic', note: '强描边 / 页面底（功能性边界才需达标）' },
    { group: '图形3:1', fg: 'brand-primary-0', bg: 'surface-shell', textClass: 'graphic', note: '激活轨·图标 / 外壳' },
    {
        group: '图形3:1',
        fg: 'mobile-nav-active-icon',
        bg: 'mobile-nav-active-icon-bg',
        over: ['mobile-nav-bg', 'page-bg'],
        textClass: 'graphic',
        note: '导航激活图标（其底色 pill 透明时落到 nav 底）',
    },
];

const THRESHOLDS: Record<TextClass, { aa: number; aaa: number }> = {
    normal: { aa: 4.5, aaa: 7 },
    large: { aa: 3, aaa: 4.5 },
    graphic: { aa: 3, aaa: 3 },
};

type Level = 'PASS' | 'WARN' | 'FAIL';

interface Result {
    scheme: string;
    pair: Pair;
    ratio: number;
    level: Level;
    blocking: boolean;
    fgHex: string;
    bgHex: string;
}

const pickColor = (colors: RGBA[]): RGBA => colors.find((c) => c.a >= 1) ?? colors[0] ?? { r: 255, g: 255, b: 255, a: 1 };

/** 把 over 链自底向上合成成一个不透明基底（链尾应为不透明的 page-bg/surface-1）。 */
const resolveBaseChain = (vars: VarMap, tokens: string[]): RGBA => {
    let acc = pickColor(resolveColors(vars, tokens[tokens.length - 1]));
    for (let k = tokens.length - 2; k >= 0; k--) {
        const layer = pickColor(resolveColors(vars, tokens[k]));
        acc = layer.a < 1 ? composite(layer, acc) : layer;
    }
    return acc;
};

const evaluatePair = (vars: VarMap, scheme: string, pair: Pair): Result | null => {
    const overChain = Array.isArray(pair.over) ? pair.over : [pair.over ?? 'page-bg'];
    const base = resolveBaseChain(vars, overChain);

    const fgColors = resolveColors(vars, pair.fg);
    const bgColors = resolveColors(vars, pair.bg);
    if (fgColors.length === 0 || bgColors.length === 0) return null; // 无法解析，跳过

    let worst = Number.POSITIVE_INFINITY;
    let worstFg = fgColors[0];
    let worstBg = bgColors[0];
    for (const bgC of bgColors) {
        const bgSolid = bgC.a < 1 ? composite(bgC, base) : bgC;
        for (const fgC of fgColors) {
            const fgSolid = fgC.a < 1 ? composite(fgC, bgSolid) : fgC;
            const ratio = contrastRatio(fgSolid, bgSolid);
            if (ratio < worst) {
                worst = ratio;
                worstFg = fgSolid;
                worstBg = bgSolid;
            }
        }
    }

    const t = THRESHOLDS[pair.textClass];
    const level: Level = worst >= t.aaa ? 'PASS' : worst >= t.aa ? 'WARN' : 'FAIL';
    return { scheme, pair, ratio: worst, level, blocking: isBlocking(pair), fgHex: toHex(worstFg), bgHex: toHex(worstBg) };
};

// =====================================================================
// 主流程 + 输出
// =====================================================================
const COLORS = {
    reset: '\x1b[0m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    bold: '\x1b[1m',
};
const badge = (level: Level) =>
    level === 'FAIL'
        ? `${COLORS.red}FAIL${COLORS.reset}`
        : level === 'WARN'
          ? `${COLORS.yellow}WARN${COLORS.reset}`
          : `${COLORS.green}PASS${COLORS.reset}`;

const main = () => {
    const args = process.argv.slice(2);
    const showAll = args.includes('--all');
    const strict = args.includes('--strict');
    const asJson = args.includes('--json');
    const schemeFilter = args.find((a) => a.startsWith('--scheme='))?.split('=')[1];

    const blocks = parseSchemeBlocks(fs.readFileSync(THEME_CSS, 'utf-8'));
    const effective = buildEffective(blocks);
    const schemes = Object.keys(effective).filter((s) => !schemeFilter || s === schemeFilter);

    const results: Result[] = [];
    for (const scheme of schemes) {
        for (const pair of PAIRS) {
            const r = evaluatePair(effective[scheme], scheme, pair);
            if (r) results.push(r);
        }
    }

    if (asJson) {
        console.log(
            JSON.stringify(
                results.map((r) => ({
                    scheme: r.scheme,
                    group: r.pair.group,
                    fg: r.pair.fg,
                    bg: r.pair.bg,
                    textClass: r.pair.textClass,
                    ratio: Number(r.ratio.toFixed(2)),
                    level: r.level,
                    fgHex: r.fgHex,
                    bgHex: r.bgHex,
                })),
                null,
                2,
            ),
        );
    } else {
        console.log(`${COLORS.bold}底-文字对比度校验（WCAG 相对亮度 · AA门槛/AAA推荐）${COLORS.reset}`);
        console.log(`配对契约 ${PAIRS.length} 项 × scheme ${schemes.length} 套 = ${results.length} 次检查\n`);

        const printRow = (r: Result) => {
            const t = THRESHOLDS[r.pair.textClass];
            const target = r.pair.textClass === 'graphic' ? '≥3 图形' : `AA≥${t.aa} AAA≥${t.aaa}`;
            console.log(
                `  ${badge(r.level)} ${r.ratio.toFixed(2).padStart(5)}:1  ${COLORS.dim}[${target}]${COLORS.reset}  ` +
                    `${r.pair.fg} on ${r.pair.bg}  ${COLORS.dim}${r.fgHex}/${r.bgHex} — ${r.pair.note}${COLORS.reset}`,
            );
        };

        for (const scheme of schemes) {
            const rows = results.filter((r) => r.scheme === scheme);
            const textRows = rows.filter((r) => r.blocking);
            const graphicRows = rows.filter((r) => !r.blocking);
            const fails = textRows.filter((r) => r.level === 'FAIL');
            const warns = textRows.filter((r) => r.level === 'WARN');
            const passes = textRows.length - fails.length - warns.length;
            console.log(
                `${COLORS.bold}■ ${scheme}${COLORS.reset}  ${COLORS.dim}文字 FAIL ${fails.length} / WARN ${warns.length} / PASS ${passes}${COLORS.reset}`,
            );

            const shownText = showAll ? textRows : [...fails, ...warns];
            if (shownText.length === 0) console.log(`  ${COLORS.green}文字全部达标（≥AAA 推荐线）${COLORS.reset}`);
            for (const r of shownText.sort((a, b) => a.ratio - b.ratio)) printRow(r);

            const shownGraphic = showAll ? graphicRows : graphicRows.filter((r) => r.level === 'FAIL');
            if (shownGraphic.length > 0) {
                console.log(`  ${COLORS.dim}— 图形/非文字（参考，不阻断 CI）—${COLORS.reset}`);
                for (const r of shownGraphic.sort((a, b) => a.ratio - b.ratio)) printRow(r);
            }
            console.log('');
        }
    }

    const textResults = results.filter((r) => r.blocking);
    const failCount = textResults.filter((r) => r.level === 'FAIL').length;
    const warnCount = textResults.filter((r) => r.level === 'WARN').length;
    const passCount = textResults.length - failCount - warnCount;
    const graphicLow = results.filter((r) => !r.blocking && r.level === 'FAIL').length;
    if (!asJson) {
        console.log(
            `${COLORS.bold}汇总（文字档）${COLORS.reset}: ${COLORS.red}FAIL ${failCount}${COLORS.reset} · ${COLORS.yellow}WARN ${warnCount}${COLORS.reset} · ${COLORS.green}PASS ${passCount}${COLORS.reset}` +
                `   ${COLORS.dim}图形档低于3:1（参考）: ${graphicLow}${COLORS.reset}`,
        );
        console.log(
            `${COLORS.dim}判级: ratio≥AAA→PASS · AA≤ratio<AAA→WARN · ratio<AA→FAIL。仅文字档 FAIL 触发退出码 1（--strict 时 WARN 也触发）。${COLORS.reset}`,
        );
    }

    if (failCount > 0 || (strict && warnCount > 0)) process.exitCode = 1;
};

main();
