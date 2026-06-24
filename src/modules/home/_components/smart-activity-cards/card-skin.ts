import type { CSSProperties } from 'react';
import type { SchemeMeta } from '@/components/theme-provider/scheme-meta';

export interface SmartActivityCardSkin {
    sectionClassName: string;
    cardClassName: string;
    raisedClassName: string;
    subtleClassName: string;
    chipClassName: string;
    ctaClassName: string;
    ghostButtonClassName: string;
    mutedTextClassName: string;
    accentStyle: CSSProperties;
    heroStyle: CSSProperties;
    ticketStyle: CSSProperties;
    marketStyle: CSSProperties;
    leaderboardStyle: CSSProperties;
}

/** 根据当前品牌与明暗色生成首页活动卡片的局部皮肤。 */
export const getSmartActivityCardSkin = (schemeMeta: SchemeMeta): SmartActivityCardSkin => {
    const isLight = schemeMeta.mode === 'light';

    if (schemeMeta.brand === 'betano') {
        return {
            sectionClassName:
                'rounded-[var(--component-smart-card-radius,var(--brand-match-card-radius,8px))] border border-[color:var(--brand-match-card-border,var(--border-subtle))] bg-[var(--surface-1)] p-2.5 shadow-none',
            cardClassName:
                'rounded-[var(--component-smart-card-radius,var(--brand-match-card-radius,8px))] border border-[color:var(--brand-match-card-border,var(--border-subtle))] bg-[var(--brand-match-card-bg,var(--surface-1))] text-content-primary shadow-none',
            raisedClassName:
                'rounded-[var(--component-smart-card-radius,var(--brand-match-card-radius,8px))] border border-[color:var(--brand-match-card-border,var(--border-subtle))] bg-[var(--surface-raised)] text-content-primary shadow-none',
            subtleClassName:
                'rounded-[var(--component-odds-radius,var(--brand-odds-radius,8px))] border border-[color:var(--brand-odds-border,var(--border-subtle))] bg-[var(--brand-odds-bg,var(--surface-2))]',
            chipClassName:
                'rounded-[var(--component-odds-radius,var(--brand-odds-radius,8px))] border border-[color:var(--brand-odds-border,var(--border-subtle))] bg-[var(--brand-odds-bg,var(--surface-2))] px-2 py-0.5 text-auxiliary-xs font-bold text-content-secondary',
            ctaClassName:
                'inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-[var(--component-slip-cta-radius,var(--brand-odds-radius,8px))] px-3 text-body-sm font-bold text-[var(--slip-cta-text,#ffffff)] transition-colors [background:var(--slip-cta-bg,#007a43)] hover:[background:var(--slip-cta-hover-bg,#006b3b)]',
            ghostButtonClassName:
                'inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-[var(--component-slip-cta-radius,var(--brand-odds-radius,8px))] border border-[color:var(--brand-odds-border,var(--border-strong))] bg-[var(--brand-odds-bg,var(--surface-2))] px-3 text-body-sm font-bold text-content-primary transition-colors hover:border-[color:var(--brand-odds-hover-border,var(--brand-primary-0))] hover:bg-[var(--brand-odds-hover-bg,var(--surface-2))]',
            mutedTextClassName: 'text-[var(--brand-match-muted,var(--content-muted))]',
            accentStyle: {
                background: 'var(--brand-primary-0)',
            },
            heroStyle: {
                background: isLight ? '#ffffff' : 'var(--brand-match-card-bg,var(--surface-1))',
            },
            ticketStyle: {
                background: isLight ? '#ffffff' : 'var(--brand-match-card-bg,var(--surface-1))',
            },
            marketStyle: {
                background: isLight ? '#ffffff' : 'var(--brand-match-card-bg,var(--surface-1))',
            },
            leaderboardStyle: {
                background: isLight ? '#ffffff' : 'var(--brand-match-card-bg,var(--surface-1))',
            },
        };
    }

    const glassOverlay = isLight ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.05)';
    const brandWash = isLight ? 'var(--brand-primary-1)' : 'rgba(255,255,255,0.04)';

    return {
        sectionClassName:
            'rounded-[var(--component-smart-card-radius,4px)] border border-[color:var(--border-subtle)] bg-[var(--surface-1)] p-3 shadow-card',
        cardClassName:
            'rounded-[var(--component-smart-card-radius,4px)] border border-[color:var(--border-subtle)] bg-[var(--surface-1)] text-content-primary shadow-card',
        raisedClassName:
            'rounded-[var(--component-smart-card-radius,4px)] border border-[color:var(--border-subtle)] bg-[var(--surface-raised)] text-content-primary shadow-card',
        subtleClassName:
            'rounded-[var(--component-odds-radius,4px)] border border-[color:var(--border-subtle)] bg-[var(--surface-muted)]',
        chipClassName:
            'rounded-[var(--component-odds-radius,4px)] border border-[color:var(--border-subtle)] bg-[var(--surface-2)] px-2 py-1 text-auxiliary-xs font-bold text-content-secondary',
        ctaClassName:
            'inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-[var(--component-slip-cta-radius,4px)] px-3 text-body-sm font-bold text-[var(--brand-odds-selected-text,var(--odds-selected-text))] transition-colors [background:var(--brand-odds-selected-bg,var(--odds-selected-bg))] hover:[background:var(--brand-odds-selected-hover-bg,var(--odds-selected-hover-bg))]',
        ghostButtonClassName:
            'inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-[var(--component-slip-cta-radius,4px)] border border-[color:var(--border-strong)] bg-[var(--surface-2)] px-3 text-body-sm font-bold text-content-primary transition-colors hover:border-[color:var(--brand-primary-0)] hover:text-[var(--brand-primary-0)]',
        mutedTextClassName: 'text-content-muted',
        accentStyle: {
            background: 'linear-gradient(180deg, var(--brand-primary-0), var(--brand-primary-4))',
        },
        heroStyle: {
            background: `linear-gradient(135deg, var(--surface-1) 0%, ${brandWash} 48%, var(--surface-2) 100%)`,
        },
        ticketStyle: {
            background: `linear-gradient(90deg, var(--surface-1) 0%, ${glassOverlay} 48%, var(--surface-2) 100%)`,
        },
        marketStyle: {
            background:
                'linear-gradient(135deg, var(--brand-match-card-bg,var(--surface-1)) 0%, var(--surface-muted) 100%)',
        },
        leaderboardStyle: {
            background: `linear-gradient(180deg, ${brandWash} 0%, var(--surface-1) 68%)`,
        },
    };
};
