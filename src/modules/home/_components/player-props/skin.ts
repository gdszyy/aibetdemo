import type { CSSProperties } from 'react';
import type { SchemeMeta } from '@/components/theme-provider/scheme-meta';

export interface PlayerPropsSkin {
    sectionClassName: string;
    headerChipClassName: string;
    cardClassName: string;
    categoryChipClassName: string;
    categoryChipActiveClassName: string;
    avatarClassName: string;
    thresholdClassName: string;
    thresholdSelectedClassName: string;
    nudgeClassName: string;
    popularityClassName: string;
    boostBadgeClassName: string;
    goldenClassName: string;
    ctaClassName: string;
    mutedTextClassName: string;
    matrixHeadCellClassName: string;
    accentStyle: CSSProperties;
}

const PLAYER_CARD_RADIUS = 'rounded-[var(--component-player-card-radius,10px)]';
const THRESHOLD_RADIUS = 'rounded-[var(--component-player-threshold-radius,8px)]';

/** 根据当前品牌与明暗色生成球员盘口的局部皮肤（颜色自动随 scheme 换肤，结构由 profile 决定）。 */
export const getPlayerPropsSkin = (schemeMeta: SchemeMeta): PlayerPropsSkin => {
    const isLight = schemeMeta.mode === 'light';

    const thresholdBase = `inline-flex min-w-0 flex-col items-center justify-center gap-0.5 ${THRESHOLD_RADIUS} border px-2 py-1.5 text-center transition-colors cursor-pointer`;
    const thresholdSelected =
        'border-[color:var(--brand-odds-selected-bg,var(--odds-selected-bg))] [background:var(--brand-odds-selected-bg,var(--odds-selected-bg))] text-[var(--brand-odds-selected-text,var(--odds-selected-text))]';

    if (schemeMeta.brand === 'betano') {
        return {
            sectionClassName: `${PLAYER_CARD_RADIUS} border border-[color:var(--brand-match-card-border,var(--border-subtle))] bg-[var(--surface-1)] p-3 shadow-none`,
            headerChipClassName:
                'rounded-full border border-[color:var(--brand-odds-border,var(--border-subtle))] bg-[var(--brand-odds-bg,var(--surface-2))] px-2.5 py-1 text-auxiliary-xs font-bold text-content-secondary',
            cardClassName: `${PLAYER_CARD_RADIUS} border border-[color:var(--brand-match-card-border,var(--border-subtle))] bg-[var(--brand-match-card-bg,var(--surface-1))] text-content-primary shadow-none`,
            categoryChipClassName:
                'inline-flex h-8 cursor-pointer items-center gap-1 rounded-full border border-[color:var(--brand-odds-border,var(--border-subtle))] bg-[var(--brand-odds-bg,var(--surface-2))] px-3 text-body-sm font-bold text-content-secondary transition-colors hover:text-content-primary',
            categoryChipActiveClassName:
                'border-transparent [background:var(--brand-primary-0)] text-[var(--text-on-brand,#ffffff)]',
            avatarClassName: 'flex size-9 shrink-0 items-center justify-center rounded-full text-auxiliary-xs font-black text-white',
            thresholdClassName: `${thresholdBase} border-[color:var(--brand-odds-border,var(--border-subtle))] bg-[var(--brand-odds-bg,var(--surface-2))] text-content-primary hover:border-[color:var(--brand-odds-hover-border,var(--brand-primary-0))]`,
            thresholdSelectedClassName: thresholdSelected,
            nudgeClassName: 'text-auxiliary-xs font-medium text-[var(--brand-primary-0)]',
            popularityClassName: 'text-auxiliary-xs font-bold text-content-secondary',
            boostBadgeClassName:
                'inline-flex items-center gap-1 rounded-full bg-[var(--brand-primary-0)] px-2 py-0.5 text-auxiliary-xs font-black uppercase text-[var(--text-on-brand,#ffffff)]',
            goldenClassName: `${PLAYER_CARD_RADIUS} border border-[color:rgba(245,180,40,0.5)] bg-[linear-gradient(135deg,rgba(245,180,40,0.16),transparent)] p-3`,
            ctaClassName:
                'inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-[var(--component-slip-cta-radius,8px)] px-3 text-body-sm font-bold text-[var(--slip-cta-text,#ffffff)] transition-colors [background:var(--slip-cta-bg,var(--brand-primary-0))] hover:[background:var(--slip-cta-hover-bg,var(--brand-primary-1))]',
            mutedTextClassName: 'text-[var(--brand-match-muted,var(--content-muted))]',
            matrixHeadCellClassName: 'text-center text-auxiliary-xs font-bold uppercase text-content-muted',
            accentStyle: { background: 'var(--brand-primary-0)' },
        };
    }

    const isSuperbet = schemeMeta.brand === 'superbet';
    const brandWash = isLight ? 'var(--brand-primary-1)' : 'rgba(255,255,255,0.04)';

    return {
        sectionClassName: `${PLAYER_CARD_RADIUS} border border-[color:var(--border-subtle)] bg-[var(--surface-1)] p-3 shadow-card`,
        headerChipClassName:
            'rounded-[var(--component-player-threshold-radius,4px)] border border-[color:var(--border-subtle)] bg-[var(--surface-2)] px-2.5 py-1 text-auxiliary-xs font-bold text-content-secondary',
        cardClassName: `${PLAYER_CARD_RADIUS} border border-[color:var(--border-subtle)] bg-[var(--surface-1)] text-content-primary shadow-card`,
        categoryChipClassName:
            'inline-flex h-8 cursor-pointer items-center gap-1 rounded-[var(--component-player-threshold-radius,4px)] border border-[color:var(--border-strong)] bg-[var(--surface-2)] px-3 text-body-sm font-bold text-content-secondary transition-colors hover:border-[color:var(--brand-primary-0)] hover:text-[var(--brand-primary-0)]',
        categoryChipActiveClassName:
            'border-transparent [background:linear-gradient(180deg,var(--brand-primary-0),var(--brand-primary-4))] text-[var(--text-on-brand,#ffffff)]',
        avatarClassName: 'flex size-9 shrink-0 items-center justify-center rounded-full text-auxiliary-xs font-black text-white',
        thresholdClassName: `${thresholdBase} border-[color:var(--border-subtle)] bg-[var(--surface-2)] text-content-primary hover:border-[color:var(--brand-primary-0)]`,
        thresholdSelectedClassName: thresholdSelected,
        nudgeClassName: 'text-auxiliary-xs font-medium text-content-secondary',
        popularityClassName: 'text-auxiliary-xs font-bold text-content-secondary',
        boostBadgeClassName: isSuperbet
            ? 'inline-flex items-center gap-1 rounded-[var(--component-player-threshold-radius,5px)] bg-[var(--brand-primary-0)] px-2 py-0.5 text-auxiliary-xs font-black uppercase italic text-[var(--text-on-brand,#ffffff)]'
            : 'inline-flex items-center gap-1 rounded-[var(--component-player-threshold-radius,4px)] bg-[var(--brand-primary-0)] px-2 py-0.5 text-auxiliary-xs font-black uppercase text-[var(--text-on-brand,#ffffff)]',
        goldenClassName: `${PLAYER_CARD_RADIUS} border border-[color:var(--border-strong)] p-3`,
        ctaClassName:
            'inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-[var(--component-slip-cta-radius,4px)] px-3 text-body-sm font-bold text-[var(--brand-odds-selected-text,var(--odds-selected-text))] transition-colors [background:var(--brand-odds-selected-bg,var(--odds-selected-bg))] hover:[background:var(--brand-odds-selected-hover-bg,var(--odds-selected-hover-bg))]',
        mutedTextClassName: 'text-content-muted',
        matrixHeadCellClassName: 'text-center text-auxiliary-xs font-bold uppercase text-content-muted',
        accentStyle: {
            background: isSuperbet
                ? 'linear-gradient(180deg, var(--brand-primary-0), var(--brand-primary-4))'
                : `linear-gradient(180deg, ${brandWash} 0%, var(--brand-primary-0) 100%)`,
        },
    };
};
