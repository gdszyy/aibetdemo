'use client';

import { useTranslations } from 'next-intl';
import type { CSSProperties, FC } from 'react';
import { CupOutlined } from '@/components/icons2/CupOutlined';
import { DoubleArrowUpOutlined } from '@/components/icons2/DoubleArrowUpOutlined';
import { StarFilled } from '@/components/icons2/StarFilled';
import type { ThemeComponentProfile } from '@/components/theme-provider/component-profile';
import { useIntlFormatter } from '@/hooks/use-intl-formatter';
import { cn } from '@/utils/common';
import type { SmartActivityCardSkin } from './card-skin';
import { InitialAvatar } from './initial-avatar';
import type { LeaderboardRow, LeaderboardTrend } from './types';

interface TurnoverLeaderboardCardProps {
    rows: LeaderboardRow[];
    skin: SmartActivityCardSkin;
    componentProfile: ThemeComponentProfile;
}

type PodiumRank = 1 | 2 | 3;

interface MedalStyle {
    /** 金/银/铜——通用奖牌色，刻意与主题无关，全主题一致。 */
    metal: string;
    tint: string;
    base: string;
    avatar: string;
    avatarText: string;
    amountText: string;
}

const MEDAL: Record<PodiumRank, MedalStyle> = {
    1: { metal: '#f4c640', tint: 'rgba(244,198,64,0.20)', base: 'h-12', avatar: 'size-14', avatarText: 'text-title-lg', amountText: 'text-title-sm' },
    2: { metal: '#c4ccd8', tint: 'rgba(196,204,216,0.18)', base: 'h-9', avatar: 'size-12', avatarText: 'text-title-md', amountText: 'text-body-md' },
    3: { metal: '#cf9061', tint: 'rgba(207,144,97,0.20)', base: 'h-7', avatar: 'size-12', avatarText: 'text-title-md', amountText: 'text-body-md' },
};

const TREND_LABEL_CLASS: Record<LeaderboardTrend, string> = {
    up: 'text-[var(--status-success-text)]',
    stable: 'text-[var(--accent-warm)]',
    new: 'text-[var(--brand-primary-0)]',
};

/** 冠军皇冠（装饰性内联图标，奖牌金）。 */
const Crown: FC<{ color: string }> = ({ color }) => (
    <svg viewBox="0 0 24 24" className="mb-0.5 size-4" fill={color} xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M5 16.5 L3 6 L8.5 10 L12 4 L15.5 10 L21 6 L19 16.5 Z" />
    </svg>
);

/** 用户流水排行榜卡片。 */
export const TurnoverLeaderboardCard: FC<TurnoverLeaderboardCardProps> = ({ componentProfile, rows, skin }) => {
    const t = useTranslations('home.smartCards');
    const activityProfile = componentProfile.activityCards;
    const { formatCompactAmount } = useIntlFormatter();
    const topRows = rows.slice(0, 3);
    const currentUser = rows.find((row) => row.isCurrentUser);

    // 视觉顺序：银(左) · 金(中) · 铜(右)
    const podium: Array<{ row: LeaderboardRow; rank: PodiumRank }> = [];
    if (topRows[1]) podium.push({ row: topRows[1], rank: 2 });
    if (topRows[0]) podium.push({ row: topRows[0], rank: 1 });
    if (topRows[2]) podium.push({ row: topRows[2], rank: 3 });

    return (
        <article
            className={cn(
                skin.cardClassName,
                'relative flex min-h-[248px] flex-col gap-3 overflow-hidden p-2.5 transition-[background-color,border-color,transform]',
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
                <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand-odds-bg,var(--surface-2))]"
                    style={{ boxShadow: `0 0 0 1.5px ${MEDAL[1].metal}` }}
                >
                    <CupOutlined className="size-5" style={{ color: MEDAL[1].metal } as CSSProperties} />
                </div>
            </div>

            <div className="flex items-end justify-center gap-2">
                {podium.map(({ row, rank }) => {
                    const medal = MEDAL[rank];

                    return (
                        <div key={rank} className="flex min-w-0 flex-1 flex-col items-center">
                            {rank === 1 ? <Crown color={medal.metal} /> : null}
                            <InitialAvatar
                                name={row.name}
                                className={medal.avatar}
                                textClassName={medal.avatarText}
                                style={{ boxShadow: `0 0 0 2px ${medal.metal}, 0 6px 18px ${medal.tint}` }}
                            />
                            <div className="mt-2 max-w-full truncate text-body-sm font-bold text-content-primary">
                                {row.name}
                            </div>
                            <div className={cn('mt-0.5 font-black text-content-primary', medal.amountText)}>
                                {formatCompactAmount(row.amount)}
                            </div>
                            <div
                                className="mt-1 flex max-w-full items-center gap-1 text-auxiliary-xxs font-bold"
                                style={{ color: medal.metal }}
                            >
                                <StarFilled className="size-2.5 shrink-0" />
                                <span className="truncate">{row.prize}</span>
                            </div>
                            <div
                                className={cn(
                                    'mt-2 flex w-full items-center justify-center rounded-t-[var(--component-odds-radius,var(--brand-odds-radius,4px))]',
                                    medal.base,
                                )}
                                style={{
                                    background: `linear-gradient(180deg, ${medal.tint} 0%, var(--surface-2) 100%)`,
                                    borderTop: `2px solid ${medal.metal}`,
                                }}
                            >
                                <span className="text-headline-sm font-black text-content-primary opacity-90">
                                    {rank}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {currentUser && (
                <div
                    className="mt-auto flex items-center justify-between gap-2 rounded-[var(--component-odds-radius,var(--brand-odds-radius,4px))] border border-[color:var(--brand-odds-border,var(--border-strong))] bg-[var(--brand-odds-bg,var(--surface-2))] py-2 pl-2 pr-2.5"
                    style={{ borderLeft: '3px solid var(--brand-primary-0)' }}
                >
                    <div className="flex min-w-0 items-center gap-2">
                        <InitialAvatar name={currentUser.name} variant="muted" className="size-9" textClassName="text-body-md" />
                        <div className="min-w-0">
                            <div className="text-auxiliary-xxs font-bold uppercase text-[var(--brand-primary-0)]">
                                {t('leaderboard.myRank')}
                            </div>
                            <div className="truncate text-body-sm font-bold text-content-primary">
                                #{currentUser.rank} {currentUser.name}
                            </div>
                        </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-1.5">
                        <DoubleArrowUpOutlined className={cn('size-4', TREND_LABEL_CLASS[currentUser.trend])} />
                        <span className="text-body-md font-black text-content-primary">
                            {formatCompactAmount(currentUser.amount)}
                        </span>
                    </div>
                </div>
            )}
        </article>
    );
};
