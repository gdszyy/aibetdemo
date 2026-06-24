'use client';

import { type FC, useEffect, useState } from 'react';
import { getSchemeMeta } from '@/components/theme-provider/scheme-meta';
import { SCHEMES, type Scheme, useTheme } from '@/components/theme-provider/theme-provider';
import { cn } from '@/utils/common';

const SCHEME_LABELS: Partial<Record<Scheme, string>> = {
    gtb: 'GTB',
    betbus: 'Betbus',
    match: 'MATCH',
    'match-light': 'MATCH Light',
    'superbet-light': 'Superbet Light',
    'superbet-dark': 'Superbet Dark',
    'betano-light': 'Betano Light',
    'betano-dark': 'Betano Dark',
    'glass-light': 'Glass Light',
    'glass-dark': 'Glass Dark',
    'glass-brasil-light': 'Glass Brasil Light',
    'glass-brasil-dark': 'Glass Brasil Dark',
    'glass-mexico-light': 'Glass México Light',
    'glass-mexico-dark': 'Glass México Dark',
    'glass-azul-light': 'Glass Azul Light',
    'glass-azul-dark': 'Glass Azul Dark',
    'glass-roxo-light': 'Glass Banco Light',
    'glass-roxo-dark': 'Glass Banco Dark',
    'cis-light': 'CIS Light',
};

const getSchemeLabel = (scheme: Scheme) => {
    return SCHEME_LABELS[scheme] ?? scheme;
};

/** MATCH 深色配色变体（左下角独立色板行）。bg=外壳底色预览，accent=主色预览。 */
interface MatchColorVariant {
    scheme: Scheme;
    label: string;
    bg: string;
    accent: string;
}

const MATCH_COLOR_VARIANTS: MatchColorVariant[] = [
    { scheme: 'match', label: 'Green', bg: '#0f0f0f', accent: '#26c07a' },
    { scheme: 'match-mint', label: 'Mint', bg: '#0b0e13', accent: '#1fe0a0' },
    { scheme: 'match-bright', label: 'Bright', bg: '#0f0f0f', accent: '#3bd63b' },
    { scheme: 'match-red', label: 'Red', bg: '#0f0f0f', accent: '#e6202b' },
    { scheme: 'match-navy-red', label: 'Navy Red', bg: '#0b0f18', accent: '#e6202b' },
    { scheme: 'match-navy-yellow', label: 'Navy Yellow', bg: '#0b0f18', accent: '#ffd21a' },
];

/** 主列表隐藏的 5 个 MATCH 深色变体（'match' 仍保留在主列表）。 */
const MATCH_VARIANT_SCHEMES = new Set<Scheme>(
    MATCH_COLOR_VARIANTS.filter((variant) => variant.scheme !== 'match').map((variant) => variant.scheme),
);

/** Glass 配色变体（左下角独立色板行）：仅切色相，沿用当前明暗。bg=暗壳预览，accent=主色预览。 */
type GlassColor = 'neon' | 'brasil' | 'mexico' | 'azul' | 'banco';

interface GlassColorVariant {
    color: GlassColor;
    label: string;
    light: Scheme;
    dark: Scheme;
    bg: string;
    accent: string;
}

const GLASS_COLOR_VARIANTS: GlassColorVariant[] = [
    { color: 'neon', label: 'Néon', light: 'glass-light', dark: 'glass-dark', bg: '#1a1230', accent: '#8b5cf6' },
    { color: 'brasil', label: 'Brasil', light: 'glass-brasil-light', dark: 'glass-brasil-dark', bg: '#0a1e15', accent: '#16c172' },
    { color: 'mexico', label: 'México', light: 'glass-mexico-light', dark: 'glass-mexico-dark', bg: '#0a1e1b', accent: '#10c2a3' },
    { color: 'azul', label: 'Azul', light: 'glass-azul-light', dark: 'glass-azul-dark', bg: '#0a1024', accent: '#3b82f6' },
    { color: 'banco', label: 'Banco', light: 'glass-roxo-light', dark: 'glass-roxo-dark', bg: '#1a0c2e', accent: '#9416e0' },
];

/** 主列表隐藏的 8 个 Glass 配色变体（glass-light / glass-dark 作为入口仍保留）。 */
const GLASS_VARIANT_SCHEMES = new Set<Scheme>(
    GLASS_COLOR_VARIANTS.flatMap((variant) => (variant.color === 'neon' ? [] : [variant.light, variant.dark])),
);

/** 由当前 scheme 反查所属 Glass 色相（落到色板高亮）。 */
const getGlassColor = (scheme: Scheme): GlassColor =>
    GLASS_COLOR_VARIANTS.find((variant) => variant.light === scheme || variant.dark === scheme)?.color ?? 'neon';

/** 主列表 = 全部 scheme 去掉 MATCH 深色变体与 Glass 配色变体，二者改由独立色板行切换（不平铺）。 */
const PRIMARY_SCHEMES = SCHEMES.filter(
    (scheme) => !MATCH_VARIANT_SCHEMES.has(scheme) && !GLASS_VARIANT_SCHEMES.has(scheme),
);

export const SchemeSwitcher: FC = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    const active = (theme as Scheme) ?? SCHEMES[0];
    const activeMeta = getSchemeMeta(active);
    const isMatchBrand = activeMeta.brand === 'match';
    const isGlassBrand = activeMeta.brand === 'glass';
    const activeGlassColor = getGlassColor(active);

    return (
        <div className="fixed bottom-20 left-3 z-[9999] flex flex-col items-start gap-2 md:bottom-4">
            {open && (
                <section
                    aria-label="Theme switcher"
                    className={cn(
                        'w-[min(calc(100vw-24px),280px)] rounded-md border border-border-subtle bg-surface-raised p-3',
                        'shadow-floating backdrop-blur-sm',
                    )}
                    data-scheme-switcher-panel=""
                >
                    <div className="mb-3 flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-body-sm font-bold text-content-primary">Theme</p>
                            <p className="truncate text-auxiliary-md text-content-muted">{getSchemeLabel(active)}</p>
                        </div>
                        <span
                            className="size-3 shrink-0 rounded-full bg-brand-primary-0 ring-4 ring-brand-primary-1"
                            aria-hidden
                        />
                    </div>

                    <div className="grid gap-2">
                        {PRIMARY_SCHEMES.map((scheme) => {
                            const isActive = scheme === active;

                            return (
                                <button
                                    type="button"
                                    key={scheme}
                                    onClick={() => setTheme(scheme)}
                                    className={cn(
                                        'flex h-10 items-center justify-between rounded-sm border px-3 text-left transition-colors',
                                        isActive
                                            ? 'border-brand-primary-0 bg-brand-primary-1 text-content-primary'
                                            : 'border-border-subtle bg-surface-1 text-content-secondary hover:border-border-strong hover:bg-surface-2',
                                    )}
                                    aria-pressed={isActive}
                                >
                                    <span className="text-body-sm font-bold">{getSchemeLabel(scheme)}</span>
                                    <span
                                        className={cn(
                                            'size-2 rounded-full',
                                            isActive ? 'bg-brand-primary-0' : 'bg-content-muted',
                                        )}
                                        aria-hidden
                                    />
                                </button>
                            );
                        })}
                    </div>

                    {isMatchBrand && (
                        <div className="mt-3 border-t border-border-subtle pt-3" data-match-color-swatches="">
                            <p className="mb-2 text-auxiliary-md font-bold text-content-muted">MATCH Color</p>
                            <div className="flex flex-wrap gap-2">
                                {MATCH_COLOR_VARIANTS.map((variant) => {
                                    const isActive = variant.scheme === active;

                                    return (
                                        <button
                                            type="button"
                                            key={variant.scheme}
                                            onClick={() => setTheme(variant.scheme)}
                                            title={variant.label}
                                            aria-label={variant.label}
                                            aria-pressed={isActive}
                                            className={cn(
                                                'relative grid size-8 place-items-center rounded-full border transition-transform',
                                                isActive
                                                    ? 'scale-110 border-brand-primary-0'
                                                    : 'border-border-subtle hover:border-border-strong',
                                            )}
                                            style={{ background: variant.bg }}
                                        >
                                            <span
                                                className="size-3.5 rounded-full"
                                                style={{ background: variant.accent }}
                                                aria-hidden
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {isGlassBrand && (
                        <div className="mt-3 border-t border-border-subtle pt-3" data-glass-color-swatches="">
                            <p className="mb-2 text-auxiliary-md font-bold text-content-muted">Glass Color</p>
                            <div className="flex flex-wrap gap-2">
                                {GLASS_COLOR_VARIANTS.map((variant) => {
                                    const isActive = variant.color === activeGlassColor;

                                    return (
                                        <button
                                            type="button"
                                            key={variant.color}
                                            onClick={() => setTheme(activeMeta.mode === 'light' ? variant.light : variant.dark)}
                                            title={variant.label}
                                            aria-label={variant.label}
                                            aria-pressed={isActive}
                                            className={cn(
                                                'relative grid size-8 place-items-center rounded-full border transition-transform',
                                                isActive
                                                    ? 'scale-110 border-brand-primary-0'
                                                    : 'border-border-subtle hover:border-border-strong',
                                            )}
                                            style={{ background: variant.bg }}
                                        >
                                            <span
                                                className="size-3.5 rounded-full"
                                                style={{ background: variant.accent }}
                                                aria-hidden
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </section>
            )}

            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={cn(
                    'flex h-10 items-center gap-2 rounded-full border border-border-subtle bg-surface-raised px-3',
                    'text-auxiliary-md font-bold text-content-primary shadow-floating transition-colors hover:bg-surface-2',
                )}
                aria-expanded={open}
                aria-label="Toggle theme switcher"
                title="Theme switcher"
                data-scheme-switcher-trigger=""
            >
                <span className="grid size-5 place-items-center rounded-full bg-brand-primary-1" aria-hidden>
                    <span className="size-2.5 rounded-full bg-brand-primary-0" />
                </span>
                <span>{getSchemeLabel(active)}</span>
            </button>
        </div>
    );
};
