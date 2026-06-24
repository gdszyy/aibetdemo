'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { CupOutlined } from '@/components/icons2/CupOutlined';
import { DoubleArrowUpOutlined } from '@/components/icons2/DoubleArrowUpOutlined';
import { StarFilled } from '@/components/icons2/StarFilled';
import type { ThemeComponentProfile } from '@/components/theme-provider/component-profile';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { cn } from '@/utils/common';
import type { SmartActivityCardSkin } from './card-skin';
import type { LeaderboardRow, LeaderboardTrend } from './types';

interface TurnoverLeaderboardCardProps {
    rows: LeaderboardRow[];
    skin: SmartActivityCardSkin;
    componentProfile: ThemeComponentProfile;
}

const TREND_LABEL_CLASS: Record<LeaderboardTrend, string> = {
    up: 'text-[var(--status-success-text)]',
    stable: 'text-[var(--accent-warm)]',
    new: 'text-[var(--brand-primary-0)]',
};

/** 用户流水排行榜卡片。 */
export const TurnoverLeaderboardCard: FC<TurnoverLeaderboardCardProps> = ({ componentProfile, rows, skin }) => {
    const t = useTranslations('home.smartCards');
    const activityProfile = componentProfile.activityCards;
    const { formatCompactAmount } = useIntlFormatter();
    const topRows = rows.slice(0, 3);
    const currentUser = rows.find((row) => row.isCurrentUser);

    return (
        <article
            className={cn(
                skin.cardClassName,
                'flex min-h-[248px] flex-col p-2.5 transition-[background-color,border-color,transform]',
                activityProfile.cardDensity === 'featured' && 'md:min-h-[276px]',
                activityProfile.interaction === 'promo-lift' && 'hover:-translate-y-0.5',
                activityProfile.interaction !== 'promo-lift' && 'hover:border-[color:var(--brand-primary-0)]',
            )}
            data-smart-activity-card-profile={activityProfile.profile}
            data-smart-activity-card-density={activityProfile.cardDensity}
            style={{ ...componentProfile.style, ...skin.leaderboardStyle }}
        >
            <div className="flex items-center justify-between gap-2">
                <div>
                    <div className="text-auxiliary-xs font-bold uppercase text-[var(--brand-primary-0)]">
                        {t('leaderboard.eyebrow')}
                    </div>
                    <h3 className="text-title-md font-bold text-content-primary">{t('leaderboard.title')}</h3>
                </div>
                <div className="flex size-10 items-center justify-center rounded-[var(--component-odds-radius,var(--brand-odds-radius,4px))] bg-[var(--brand-odds-bg,var(--surface-2))] text-[var(--accent-warm)]">
                    <CupOutlined className="size-5" />
                </div>
            </div>

            <div className="mt-3 flex items-end justify-center gap-1.5">
                {topRows.map((row) => (
                    <div
                        key={row.rank}
                        className={cn(
                            'flex min-w-0 flex-1 flex-col items-center rounded-[var(--component-odds-radius,var(--brand-odds-radius,4px))] border border-[color:var(--brand-odds-border,var(--border-subtle))] bg-[var(--surface-1)] px-2 py-2.5',
                            row.rank === 1 && 'pb-5',
                        )}
                    >
                        <div
                            className={cn(
                                'mb-2 flex size-7 items-center justify-center rounded-full text-auxiliary-xs font-black',
                                row.rank === 1
                                    ? 'bg-[var(--accent-warm)] text-neutral-black-h'
                                    : 'bg-[var(--surface-2)] text-content-primary',
                            )}
                        >
                            {row.rank}
                        </div>
                        <div className="max-w-full truncate text-body-sm font-bold text-content-primary">
                            {row.name}
                        </div>
                        <div className={cn('mt-1 text-auxiliary-xs', skin.mutedTextClassName)}>
                            {formatCompactAmount(row.amount)}
                        </div>
                        <div className="mt-1 flex items-center gap-1 text-auxiliary-xs font-bold text-[var(--accent-warm)]">
                            <StarFilled className="size-3" />
                            <span className="truncate">{row.prize}</span>
                        </div>
                    </div>
                ))}
            </div>

            {currentUser && (
                <div className="mt-2.5 flex items-center justify-between gap-2 rounded-[var(--component-odds-radius,var(--brand-odds-radius,4px))] border border-[color:var(--brand-odds-border,var(--border-strong))] bg-[var(--brand-odds-bg,var(--surface-2))] px-2.5 py-2">
                    <div className="min-w-0">
                        <div className="text-auxiliary-xs font-bold uppercase text-[var(--brand-primary-0)]">
                            {t('leaderboard.myRank')}
                        </div>
                        <div className="truncate text-body-sm font-bold text-content-primary">
                            #{currentUser.rank} {currentUser.name}
                        </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                        <DoubleArrowUpOutlined className={cn('size-4', TREND_LABEL_CLASS[currentUser.trend])} />
                        <span className="text-body-md font-bold text-content-primary">
                            {formatCompactAmount(currentUser.amount)}
                        </span>
                    </div>
                </div>
            )}
        </article>
    );
};
