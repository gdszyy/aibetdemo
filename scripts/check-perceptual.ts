/**
 * 感知用色治理校验（OKLCH / OKLab 感知亮度）
 * =====================================================================
 * 与 check-contrast.ts 互补、不重叠：
 *   - check-contrast.ts（WCAG 相对亮度）= 「底-文字看不看得清」的**可读性硬门槛**（法规线）。
 *   - 本脚本（OKLCH 感知亮度）       = 「整套色板自身排得齐不齐」的**感知治理层**（质量线）。
 *
 * 理论基础（用户原话的严谨化）：
 *   · CIELAB 的 L* / OKLab 的 L 才是「人眼真实明暗」，HSL 的 L 和 WCAG 的线性亮度 Y 都不是
 *     感知均匀的——Y 是线性光强（给对比度比值用对），把它当「肉眼明暗刻度」会在暗端被压扁。
 *   · OKLCH 的关键保证：**固定 L、只改 H，人眼看到的明暗/灰度绝对一致**。于是「同一语义角色
 *     跨品牌色相是否一样亮」「色阶是不是等距台阶」这类问题，用 OKLCH L 一根轴就能判，
 *     而 WCAG 对比度比值天然表达不了。
 *
 * 为什么不拿 OKLCH ΔL 去替 WCAG 算对比：ΔL 不是被验证过的可读性指标（忽略了 chroma 对
 *   可读性的影响、也不含 WCAG 的法规语义）。两套各管一段，别混用。
 *
 * 四项检查（均在 OKLCH 空间）：
 *   1. 色阶亮度均匀度  ramp     —— surface / filltext 台阶应单调且步长大致等距，不许两阶撞在一起。
 *   2. 文字层级单调    tier     —— primary→secondary→muted 相对 page-bg 的明暗距离须单调递减，步长可辨。
 *   3. 跨方案同语义亮度 parity  —— 同 mode 下同一角色（content-*、surface-*、func-*）的 L 应落在窄带内
 *                                （= 固定 L、变 H 的保证）。
 *   4. 品牌色相保持+色域 brand  —— brand-primary-0..5 的有效色相应一致；并报告饱和度占用 C/Cmax
 *                                与 sRGB 色域越界（越界=硬错）。
 *
 * 判级：GAMUT 越界 / 文字层级倒挂 = FAIL（退出码 1）；其余感知质量问题 = WARN（默认不致命）。
 *      --strict 时 WARN 也触发退出码 1。本层定位为「治理/质量」，默认不阻断 CI，可按需接入。
 *
 * 规范文档：.agent/references/perceptual-color.md（本脚本是其唯一可执行真源）。
 * 运行：pnpm theme:perceptual                仅打印 WARN/FAIL + 汇总
 *      pnpm theme:perceptual --all           连 PASS 一起打印
 *      pnpm theme:perceptual --scheme=match  只看一套
 *      pnpm theme:perceptual --strict        WARN 也算失败（退出码 1）
 *      pnpm theme:perceptual --json          机器可读 JSON
 *      pnpm theme:perceptual --selftest      仅跑色彩换算自检（CI 守换算正确性）
 */
import fs from 'node:fs';
import path from 'node:path';

// 默认以仓库根（pnpm 运行目录）为基准；PERCEPTUAL_ROOT 仅为 CI/沙箱等非常规工作目录预留的escape hatch。
const ROOT = process.env.PERCEPTUAL_ROOT ?? process.cwd();
const THEME_CSS = path.join(ROOT, 'src/assets/css/theme.css');
const SCHEME_META = path.join(ROOT, 'src/components/theme-provider/scheme-meta.ts');

// =====================================================================
// 1. 颜色模型：sRGB hex/rgba ↔ 线性 sRGB ↔ OKLab ↔ OKLCH（Björn Ottosson）
// =====================================================================
interface RGBA {
    r: number; // 0-255
    g: number; // 0-255
    b: number; // 0-255
    a: number; // 0-1
}
interface OKLCH {
    L: number; // 0..1 感知亮度
    C: number; // 0..~0.4 感知彩度
    h: number; // 0..360 色相（度）；低彩度时无意义
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
    return {
        r: parseInt(h.slice(0, 2), 16),
        g: parseInt(h.slice(2, 4), 16),
        b: parseInt(h.slice(4, 6), 16),
        a: h.length === 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1,
    };
};

const HEX_RE = /#[0-9a-fA-F]{3,8}\b/;
const RGBA_RE = /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/;

/** 取一个已展开（无 var()）CSS 值中的「第一个」色标（渐变只取首停靠，用于探测；本脚本不检查渐变令牌）。 */
const firstColor = (value: string): RGBA | null => {
    const hex = value.match(HEX_RE);
    if (hex) return parseHex(hex[0]);
    const rgba = value.match(RGBA_RE);
    if (rgba) {
        return {
            r: clamp255(Number(rgba[1])),
            g: clamp255(Number(rgba[2])),
            b: clamp255(Number(rgba[3])),
            a: rgba[4] !== undefined ? Number(rgba[4]) : 1,
        };
    }
    return null;
};

const srgbChannelToLinear = (c8: number) => {
    const c = c8 / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};
const linearChannelToSrgb = (c: number) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
const cbrt = (x: number) => Math.cbrt(x);

interface LinRGB {
    r: number;
    g: number;
    b: number;
}

const srgbToLinear = (c: RGBA): LinRGB => ({
    r: srgbChannelToLinear(c.r),
    g: srgbChannelToLinear(c.g),
    b: srgbChannelToLinear(c.b),
});

/** 线性 sRGB → OKLab。 */
const linearToOklab = ({ r, g, b }: LinRGB) => {
    const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
    const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
    const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
    const l_ = cbrt(l);
    const m_ = cbrt(m);
    const s_ = cbrt(s);
    return {
        L: 0.2104542553 * l_ + 0.789_617_785 * m_ - 0.0040720468 * s_,
        a: 1.9779984951 * l_ - 2.428_592_205 * m_ + 0.4505937099 * s_,
        b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808_675_766 * s_,
    };
};

/** OKLab → 线性 sRGB（可能越界，用于色域判定与 Cmax 搜索）。 */
const oklabToLinear = (L: number, a: number, b: number): LinRGB => {
    const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
    const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
    const s_ = L - 0.0894841775 * a - 1.291_485_548 * b;
    const l = l_ ** 3;
    const m = m_ ** 3;
    const s = s_ ** 3;
    return {
        r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
        g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
        b: -0.0041960863 * l - 0.7034186147 * m + 1.707_614_701 * s,
    };
};

const GAMUT_EPS = 1e-4;
const inGamut = ({ r, g, b }: LinRGB) =>
    r >= -GAMUT_EPS && r <= 1 + GAMUT_EPS && g >= -GAMUT_EPS && g <= 1 + GAMUT_EPS && b >= -GAMUT_EPS && b <= 1 + GAMUT_EPS;

const toOklch = (c: RGBA): OKLCH => {
    const { L, a, b } = linearToOklab(srgbToLinear(c));
    const C = Math.hypot(a, b);
    let h = (Math.atan2(b, a) * 180) / Math.PI;
    if (h < 0) h += 360;
    return { L, C, h };
};

/** 在给定 (L,h) 下 sRGB 内可达的最大彩度（gamut 边界二分），用于饱和度占用率。 */
const maxChroma = (L: number, hDeg: number): number => {
    if (L <= 0 || L >= 1) return 0;
    const hr = (hDeg * Math.PI) / 180;
    const cosH = Math.cos(hr);
    const sinH = Math.sin(hr);
    let lo = 0;
    let hi = 0.5;
    for (let i = 0; i < 32; i++) {
        const mid = (lo + hi) / 2;
        if (inGamut(oklabToLinear(L, mid * cosH, mid * sinH))) lo = mid;
        else hi = mid;
    }
    return lo;
};

const isInSrgbGamut = (c: RGBA) => inGamut(srgbToLinear(c)); // 源是 sRGB hex，恒真；越界=解析/换算异常
const fmtHex = (c: RGBA) => {
    const h = (n: number) => clamp255(Math.round(n)).toString(16).padStart(2, '0');
    return `#${h(c.r)}${h(c.g)}${h(c.b)}${c.a < 1 ? ` /${c.a.toFixed(2)}` : ''}`;
};

// =====================================================================
// 2. 换算自检：守住 OKLCH 换算正确性（known anchors）
// =====================================================================
const SELFTEST: Array<{ hex: string; L: number; C: number; h: number }> = [
    { hex: '#ffffff', L: 1.0, C: 0.0, h: NaN },
    { hex: '#000000', L: 0.0, C: 0.0, h: NaN },
    { hex: '#ff0000', L: 0.6279, C: 0.2577, h: 29.23 },
    { hex: '#00ff00', L: 0.8664, C: 0.2948, h: 142.5 },
    { hex: '#0000ff', L: 0.452, C: 0.3132, h: 264.05 },
    { hex: '#808080', L: 0.5999, C: 0.0, h: NaN },
];
const runSelftest = (verbose: boolean): boolean => {
    let ok = true;
    for (const t of SELFTEST) {
        const got = toOklch(parseHex(t.hex));
        const dL = Math.abs(got.L - t.L);
        const dC = Math.abs(got.C - t.C);
        const dH = Number.isNaN(t.h) ? 0 : Math.min(Math.abs(got.h - t.h), 360 - Math.abs(got.h - t.h));
        const pass = dL < 0.002 && dC < 0.002 && dH < 0.5;
        if (!pass) ok = false;
        if (verbose || !pass) {
            console.log(
                `  ${pass ? 'OK ' : 'BAD'} ${t.hex} → L ${got.L.toFixed(4)} C ${got.C.toFixed(4)} h ${got.h.toFixed(2)}  ` +
                    `(期望 L ${t.L} C ${t.C} h ${Number.isNaN(t.h) ? '—' : t.h})`,
            );
        }
    }
    return ok;
};

// =====================================================================
// 3. theme.css 解析 + scheme 级联（与 check-contrast.ts 同源逻辑）
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

const buildEffective = (blocks: SchemeBlock[]): Record<string, VarMap> => {
    const base = blocks.find((b) => b.scheme === 'gtb')?.vars ?? {};
    const out: Record<string, VarMap> = {};
    for (const b of blocks) out[b.scheme] = b.scheme === 'gtb' ? { ...base } : { ...base, ...b.vars };
    return out;
};

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

/** 取某 token 的有效单色（解析 var + 取首色标）；解析不到返回 null。 */
const resolve = (vars: VarMap, token: string): RGBA | null => firstColor(expandValue(vars, `var(--${token})`));

/** 从 scheme-meta.ts 解析 scheme→mode（保持与运行时单一真源同步）。 */
const parseSchemeModes = (content: string): Record<string, 'light' | 'dark'> => {
    const out: Record<string, 'light' | 'dark'> = {};
    const re = /scheme:\s*'([^']+)',\s*brand:\s*'[^']+',\s*mode:\s*'(light|dark)'/g;
    for (const m of content.matchAll(re)) out[m[1]] = m[2] as 'light' | 'dark';
    return out;
};

// =====================================================================
// 4. 检查契约（语义层；新增一组只在此加一行）
// =====================================================================
type Level = 'PASS' | 'WARN' | 'FAIL';

/** 阈值（OKLCH L ∈ 0..1；色相单位为度）。集中可调，勿散落。 */
const T = {
    RAMP_COLLISION: 0.012, // 相邻两阶 ΔL 小于此 → 视觉撞色（WARN）
    RAMP_MIN_STEP: 0.025, // 相邻步长低于此 → 区分度不足（WARN）
    RAMP_UNEVEN_RATIO: 3.0, // 最大步长 / 最小步长 超过此 → 台阶不等距（WARN）
    TIER_MIN_STEP: 0.05, // 文字层级相邻 ΔL 低于此 → 层级易混（WARN）
    PARITY_WARN: 0.06, // 同语义跨方案 L 极差超过此 → 不齐（WARN）
    PARITY_FAIL: 0.14, // 超过此 → 严重不齐（仍记 WARN，除非 --strict；保持基线不红）
    HUE_WARN: 10, // 品牌环有效色相极差超过此 → 漂移（WARN）
    HUE_FAIL: 24, // 超过此 → 标注「严重漂移」（仍 WARN，不阻断）
    HUE_MIN_C: 0.04, // 彩度低于此则色相无意义，参与色相一致性时剔除
    SAT_UTIL_WARN: 0.98, // C/Cmax 超过此 → 几乎贴 sRGB 色域边、零余量（WARN·信息性；功能色常按设计贴边，故阈值取高）
} as const;

/** 单调色阶组：组件层「同一物理梯度」的台阶；方向（升/降）不限，只看单调+等距+不撞。 */
interface RampSpec {
    group: string;
    tokens: string[];
    note: string;
}
const RAMPS: RampSpec[] = [
    { group: '表面台阶', tokens: ['surface-1', 'surface-2', 'surface-3'], note: '卡片→悬浮→分隔 三级表面' },
    {
        group: '灰阶·底',
        tokens: ['filltext-ft-a', 'filltext-ft-b', 'filltext-ft-c', 'filltext-ft-d'],
        note: 'filltext 背景段（页面/卡片/分隔/描边）',
    },
    {
        group: '灰阶·墨',
        tokens: ['filltext-ft-e', 'filltext-ft-f', 'filltext-ft-g', 'filltext-ft-h'],
        note: 'filltext 文字段（弱→次→近主→主）',
    },
];

/** 文字层级：相对 page-bg 的明暗距离应单调递减、步长可辨。 */
const TIER = {
    group: '文字层级',
    anchor: 'page-bg',
    tokens: ['content-primary', 'content-secondary', 'content-muted'] as const,
    note: 'primary 对比最高 → muted 最低',
};

/** 跨方案同语义亮度一致：同 mode 下，这些角色的 L 应落在窄带内。 */
const PARITY_ROLES: Array<{ token: string; note: string }> = [
    { token: 'content-primary', note: '主文字' },
    { token: 'content-secondary', note: '次文字' },
    { token: 'content-muted', note: '弱文字' },
    { token: 'surface-1', note: '卡片底' },
    { token: 'surface-2', note: '悬浮/输入底' },
    { token: 'page-bg', note: '页面底' },
    { token: 'func-win', note: '赢·绿（固定 L 变 H 的典型）' },
    { token: 'func-lost', note: '输·红' },
    { token: 'func-favorite', note: '收藏·橙' },
    { token: 'func-bonus', note: '奖金·金' },
    { token: 'func-pending', note: '待定·琥珀' },
];

/** 品牌环 + 饱和度顶格抽查对象。 */
const BRAND_RAMP = ['brand-primary-0', 'brand-primary-1', 'brand-primary-2', 'brand-primary-3', 'brand-primary-4', 'brand-primary-5'];
const SAT_TOKENS = ['brand-primary-0', 'func-win', 'func-lost', 'func-favorite', 'func-bonus'];

// =====================================================================
// 5. 结果模型 + 评估器
// =====================================================================
interface Finding {
    scheme: string;
    check: 'ramp' | 'tier' | 'parity' | 'brand';
    group: string;
    level: Level;
    metric: string; // 人读的关键数值
    note: string;
}

const circDiff = (a: number, b: number) => {
    const d = Math.abs(a - b) % 360;
    return Math.min(d, 360 - d);
};
const worstLevel = (...ls: Level[]): Level =>
    ls.includes('FAIL') ? 'FAIL' : ls.includes('WARN') ? 'WARN' : 'PASS';

/** 检查 1：色阶单调 + 等距 + 不撞。 */
const checkRamp = (vars: VarMap, scheme: string, spec: RampSpec): Finding => {
    const cols = spec.tokens.map((t) => resolve(vars, t));
    const Ls = cols.map((c) => (c ? toOklch(c).L : Number.NaN));
    const steps: number[] = [];
    for (let i = 1; i < Ls.length; i++) steps.push(Ls[i] - Ls[i - 1]);
    const signs = steps.map((s) => Math.sign(s));
    const dominant = signs.reduce((acc, s) => acc + s, 0) >= 0 ? 1 : -1;
    const flips = signs.filter((s) => s !== 0 && s !== dominant).length;
    const abs = steps.map((s) => Math.abs(s));
    const minStep = Math.min(...abs);
    const maxStep = Math.max(...abs);
    const ratio = minStep > 0 ? maxStep / minStep : Number.POSITIVE_INFINITY;

    let level: Level = 'PASS';
    const issues: string[] = [];
    if (flips > 0) {
        level = 'WARN';
        issues.push(`非单调(${flips}处反向)`);
    }
    if (minStep < T.RAMP_COLLISION) {
        level = 'WARN';
        issues.push(`撞色(最小ΔL ${minStep.toFixed(3)})`);
    } else if (minStep < T.RAMP_MIN_STEP) {
        level = worstLevel(level, 'WARN');
        issues.push(`步距偏小(${minStep.toFixed(3)})`);
    }
    if (ratio > T.RAMP_UNEVEN_RATIO && Number.isFinite(ratio)) {
        level = worstLevel(level, 'WARN');
        issues.push(`不等距(max/min ${ratio.toFixed(1)}×)`);
    }
    const lseq = Ls.map((l) => (Number.isNaN(l) ? '—' : l.toFixed(3))).join(' → ');
    return {
        scheme,
        check: 'ramp',
        group: spec.group,
        level,
        metric: `L: ${lseq}${issues.length ? `  ⟂ ${issues.join(' · ')}` : ''}`,
        note: spec.note,
    };
};

/** 检查 2：文字层级单调（相对 page-bg 的 |ΔL| 递减）。 */
const checkTier = (vars: VarMap, scheme: string): Finding => {
    const anchor = resolve(vars, TIER.anchor);
    const cols = TIER.tokens.map((t) => resolve(vars, t));
    const La = anchor ? toOklch(anchor).L : Number.NaN;
    const dist = cols.map((c) => (c ? Math.abs(toOklch(c).L - La) : Number.NaN));
    let level: Level = 'PASS';
    const issues: string[] = [];
    // 期望 dist[0] > dist[1] > dist[2]（primary 离底最远 → muted 最近）
    for (let i = 1; i < dist.length; i++) {
        if (!(dist[i] < dist[i - 1])) {
            level = 'FAIL'; // 层级倒挂 = 真错
            issues.push(`倒挂(${TIER.tokens[i - 1]}≤${TIER.tokens[i]})`);
        } else if (dist[i - 1] - dist[i] < T.TIER_MIN_STEP) {
            level = worstLevel(level, 'WARN');
            issues.push(`层级太近(${TIER.tokens[i - 1]}-${TIER.tokens[i]} Δ${(dist[i - 1] - dist[i]).toFixed(3)})`);
        }
    }
    const seq = dist.map((d) => (Number.isNaN(d) ? '—' : d.toFixed(3))).join(' > ');
    return {
        scheme,
        check: 'tier',
        group: TIER.group,
        level,
        metric: `离底|ΔL|: ${seq}${issues.length ? `  ⟂ ${issues.join(' · ')}` : ''}`,
        note: TIER.note,
    };
};

/** 检查 4：品牌色相一致 + 饱和度顶格 + 色域。 */
const checkBrand = (vars: VarMap, scheme: string): Finding[] => {
    const out: Finding[] = [];
    // 4a 色相一致（剔除低彩度步）
    const ramp = BRAND_RAMP.map((t) => resolve(vars, t)).filter((c): c is RGBA => c !== null);
    const hues = ramp.map(toOklch).filter((o) => o.C >= T.HUE_MIN_C).map((o) => o.h);
    let hueLevel: Level = 'PASS';
    let hueSpread = 0;
    if (hues.length >= 2) {
        for (let i = 0; i < hues.length; i++) for (let j = i + 1; j < hues.length; j++) hueSpread = Math.max(hueSpread, circDiff(hues[i], hues[j]));
        hueLevel = hueSpread >= T.HUE_WARN ? 'WARN' : 'PASS';
    }
    const hueSevere = hueSpread >= T.HUE_FAIL;
    out.push({
        scheme,
        check: 'brand',
        group: '品牌色相',
        level: hueLevel,
        metric: `有效色相极差 ${hueSpread.toFixed(1)}°${hueSevere ? '（严重漂移）' : ''}（参与 ${hues.length}/${ramp.length} 步，剔除低彩度）`,
        note: 'brand-primary-0..5 变明暗时应守住同一 H',
    });
    // 4b 饱和度顶格 + 色域越界
    for (const tk of SAT_TOKENS) {
        const c = resolve(vars, tk);
        if (!c) continue;
        const o = toOklch(c);
        const cmax = maxChroma(o.L, o.h);
        const util = cmax > 0 ? o.C / cmax : 0;
        const outGamut = !isInSrgbGamut(c);
        let level: Level = 'PASS';
        const issues: string[] = [];
        if (outGamut) {
            level = 'FAIL';
            issues.push('sRGB 越界');
        }
        if (util > T.SAT_UTIL_WARN) {
            level = worstLevel(level, 'WARN');
            issues.push(`饱和度顶格 ${(util * 100).toFixed(0)}%`);
        }
        if (issues.length === 0) continue; // 只报有问题的
        out.push({
            scheme,
            check: 'brand',
            group: '饱和度/色域',
            level,
            metric: `${tk} ${fmtHex(c)} · L ${o.L.toFixed(3)} C ${o.C.toFixed(3)}/Cmax ${cmax.toFixed(3)}  ⟂ ${issues.join(' · ')}`,
            note: '顶格色易并色、alpha 合成时偏移；越界=换算异常',
        });
    }
    return out;
};

/** 检查 3：跨方案同语义亮度一致（按 mode 分组聚合）。 */
const checkParity = (
    effective: Record<string, VarMap>,
    schemes: string[],
    modes: Record<string, 'light' | 'dark'>,
): Finding[] => {
    const out: Finding[] = [];
    for (const mode of ['light', 'dark'] as const) {
        const group = schemes.filter((s) => modes[s] === mode);
        if (group.length < 2) continue;
        for (const role of PARITY_ROLES) {
            const entries = group
                .map((s) => {
                    const c = resolve(effective[s], role.token);
                    return c && c.a >= 1 ? { s, L: toOklch(c).L } : null;
                })
                .filter((e): e is { s: string; L: number } => e !== null);
            if (entries.length < 2) continue;
            const Ls = entries.map((e) => e.L);
            const lo = Math.min(...Ls);
            const hi = Math.max(...Ls);
            const spread = hi - lo;
            const level: Level = spread >= T.PARITY_WARN ? 'WARN' : 'PASS';
            const severe = spread >= T.PARITY_FAIL;
            const loS = entries.find((e) => e.L === lo)!.s;
            const hiS = entries.find((e) => e.L === hi)!.s;
            out.push({
                scheme: `${mode}（${group.length} 套）`,
                check: 'parity',
                group: '跨方案一致',
                level,
                metric: `${role.token} L 极差 ${spread.toFixed(3)}${severe ? '（严重）' : ''}  [${lo.toFixed(3)} ${loS} … ${hi.toFixed(3)} ${hiS}]`,
                note: role.note,
            });
        }
    }
    return out;
};

// =====================================================================
// 6. 主流程 + 输出
// =====================================================================
const C = {
    reset: '\x1b[0m',
    dim: '\x1b[2m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    green: '\x1b[32m',
    bold: '\x1b[1m',
};
const badge = (l: Level) =>
    l === 'FAIL' ? `${C.red}FAIL${C.reset}` : l === 'WARN' ? `${C.yellow}WARN${C.reset}` : `${C.green}PASS${C.reset}`;

const main = () => {
    const args = process.argv.slice(2);
    if (args.includes('--selftest')) {
        console.log(`${C.bold}OKLCH 换算自检${C.reset}`);
        const ok = runSelftest(true);
        console.log(ok ? `${C.green}换算正确${C.reset}` : `${C.red}换算异常${C.reset}`);
        process.exitCode = ok ? 0 : 1;
        return;
    }
    // 每次运行先静默自检，换算坏了直接拦
    if (!runSelftest(false)) {
        console.error(`${C.red}OKLCH 换算自检失败——拒绝在错误的色彩空间上判级。运行 --selftest 看详情。${C.reset}`);
        process.exitCode = 1;
        return;
    }

    const showAll = args.includes('--all');
    const strict = args.includes('--strict');
    const asJson = args.includes('--json');
    const schemeFilter = args.find((a) => a.startsWith('--scheme='))?.split('=')[1];

    const blocks = parseSchemeBlocks(fs.readFileSync(THEME_CSS, 'utf-8'));
    const effective = buildEffective(blocks);
    const modes = parseSchemeModes(fs.readFileSync(SCHEME_META, 'utf-8'));
    const allSchemes = Object.keys(effective);
    const schemes = allSchemes.filter((s) => !schemeFilter || s === schemeFilter);

    const perScheme: Finding[] = [];
    for (const scheme of schemes) {
        const vars = effective[scheme];
        for (const spec of RAMPS) perScheme.push(checkRamp(vars, scheme, spec));
        perScheme.push(checkTier(vars, scheme));
        perScheme.push(...checkBrand(vars, scheme));
    }
    // parity 是跨方案聚合，只在不过滤单一 scheme 时有意义
    const parity = schemeFilter ? [] : checkParity(effective, allSchemes, modes);
    const all = [...perScheme, ...parity];

    if (asJson) {
        console.log(JSON.stringify(all, null, 2));
    } else {
        console.log(`${C.bold}感知用色治理校验（OKLCH 感知亮度 · 与 WCAG 对比度互补）${C.reset}`);
        console.log(
            `${C.dim}单 scheme 检查（色阶/层级/品牌）${perScheme.length} 项 · 跨方案一致 ${parity.length} 项${C.reset}\n`,
        );
        const printRow = (f: Finding) =>
            console.log(`  ${badge(f.level)} ${C.dim}[${f.group}]${C.reset} ${f.metric}  ${C.dim}— ${f.note}${C.reset}`);

        for (const scheme of schemes) {
            const rows = perScheme.filter((f) => f.scheme === scheme);
            const bad = rows.filter((f) => f.level !== 'PASS');
            console.log(
                `${C.bold}■ ${scheme}${C.reset}  ${C.dim}WARN ${rows.filter((r) => r.level === 'WARN').length} / FAIL ${rows.filter((r) => r.level === 'FAIL').length}${C.reset}`,
            );
            const shown = showAll ? rows : bad;
            if (shown.length === 0) console.log(`  ${C.green}该方案色阶/层级/品牌均匀${C.reset}`);
            for (const f of shown) printRow(f);
            console.log('');
        }

        if (parity.length > 0) {
            console.log(`${C.bold}■ 跨方案同语义亮度一致（固定 L、变 H）${C.reset}`);
            const shown = showAll ? parity : parity.filter((f) => f.level !== 'PASS');
            if (shown.length === 0) console.log(`  ${C.green}同语义角色跨方案亮度齐整${C.reset}`);
            for (const f of shown.sort((a, b) => a.scheme.localeCompare(b.scheme))) printRow(f);
            console.log('');
        }
    }

    const fails = all.filter((f) => f.level === 'FAIL').length;
    const warns = all.filter((f) => f.level === 'WARN').length;
    const passes = all.length - fails - warns;
    if (!asJson) {
        console.log(
            `${C.bold}汇总${C.reset}: ${C.red}FAIL ${fails}${C.reset} · ${C.yellow}WARN ${warns}${C.reset} · ${C.green}PASS ${passes}${C.reset}`,
        );
        console.log(
            `${C.dim}判级: 色域越界 / 文字层级倒挂 = FAIL(退出码1)；其余感知质量问题 = WARN(默认不致命，--strict 时致命)。${C.reset}`,
        );
    }
    if (fails > 0 || (strict && warns > 0)) process.exitCode = 1;
};

main();
