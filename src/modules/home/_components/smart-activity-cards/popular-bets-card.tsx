'use client';

import { useTranslations } from 'next-intl';
import type { FC } from 'react';
import { ArrowUpOutlined } from '@/components/icons2/ArrowUpOutlined';
import { LiveOutlined } from '@/components/icons2/LiveOutlined';
import { UserOutlined } from '@/components/icons2/UserOutlined';
import type { ThemeComponentProfile } from '@/components/theme-provider/component-profile';
import { Link } from '@/i18n';
import { cn } from '@/utils/common';
import type { SmartActivityCardSkin } from './card-skin';
import type { PopularBetProfile } from './types';

interface PopularBetCardProps {
    profile: PopularBetProfile;
    skin: SmartActivityCardSkin;
    componentProfile: ThemeComponentProfile;
}

const TeamScoreRow: FC<{ name: string; score: number }> = ({ name, score }) => (
    <div className="flex min-w-0 items-center justify-between gap-2">
        <span className="truncate text-body-sm font-semibold text-content-primary">{name}</span>
        <span className="shrink-0 text-title-sm font-bold text-content-primary tabular-nums">{score}</span>
    </div>
);

/** APOSTAS POPULARES 社交证明卡：展示热门投注，整卡点击跳转对应赛事详情（社交证明，非跟单）。 */
export const PopularBetCard: FC<PopularBetCardProps> = ({ componentProfile, profile, skin }) => {
    const t = useTranslations('home.smartCards');
    const activityProfile = componentProfile.activityCards;

    return (
        <Link
            href={profile.href}
            scroll={true}
            className={cn(
                skin.raisedClassName,
                'flex min-h-[248px] flex-col gap-3 p-2.5 transition-[background-color,border-color,transform]',
                activityProfile.cardDensity === 'featured' && 'md:min-h-[276px]',
                activityProfile.interaction === 'promo-lift' && 'hover:-translate-y-0.5',
                activityProfile.interaction !== 'promo-lift' && 'hover:border-[color:var(--brand-primary-0)]',
            )}
            data-smart-activity-card-profile={activityProfile.profile}
            data-smart-activity-card-density={activityProfile.cardDensity}
            data-odds-profile={componentProfile.oddsButton.profile}
            style={{ ...componentProfile.style, ...skin.heroStyle }}
        >
            <div className="flex min-w-0 items-center gap-1.5 text-[var(--brand-primary-0)]">
                <LiveOutlined className="size-4 shrink-0" />
                <span className="truncate text-auxiliary-xs font-bold uppercase">{profile.league}</span>
            </div>

            <div className="flex min-w-0 items-center gap-2">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[var(--brand-odds-bg,var(--surface-2))] text-[var(--brand-primary-0)]">
                    <UserOutlined className="size-5" />
                </div>
                <div className="min-w-0">
                    <div className="truncate text-body-sm font-bold text-content-primary tracking-wider">
                        {profile.bettorName}
                    </div>
                    <div className={cn('truncate text-auxiliary-xs', skin.mutedTextClassName)}>{profile.stake}</div>
                </div>
            </div>

            <div className="flex min-w-0 items-center gap-2">
                <div className="flex shrink-0 -space-x-1.5">
                    {[0, 1, 2].map((index) => (
                        <span
                            key={index}
                            className="flex size-5 items-center justify-center rounded-full border border-[color:var(--surface-1)] bg-[var(--brand-odds-bg,var(--surface-2))] text-[var(--brand-primary-0)]"
                        >
                            <UserOutlined className="size-3" />
                        </span>
                    ))}
                </div>
                <span className={cn('truncate text-auxiliary-xs font-semibold', skin.mutedTextClassName)}>
                    {profile.popularity}
                </span>
            </div>

            <div
                className="rounded-[var(--component-smart-card-radius,var(--brand-match-card-radius,4px))] border border-[color:var(--brand-match-card-border,var(--border-subtle))] bg-[var(--surface-1)] p-2.5"
                style={skin.marketStyle}
            >
                <div className="mb-2 flex items-center gap-1.5">
                    <span className="rounded-xs bg-func-win-solid px-1.5 py-0.5 text-auxiliary-2xs font-bold uppercase text-neutral-white-h">
                        {profile.period}
                    </span>
                    <span className="text-auxiliary-xs font-semibold text-func-win tabular-nums">{profile.minute}</span>
                </div>
                <div className="flex flex-col gap-1">
                    <TeamScoreRow name={profile.home.name} score={profile.home.score} />
                    <TeamScoreRow name={profile.away.name} score={profile.away.score} />
                </div>
            </div>

            <div>
                <div className={cn('text-auxiliary-xs', skin.mutedTextClassName)}>{t('popularBets.pick')}</div>
                <div className="line-clamp-1 text-title-sm font-bold text-content-primary">{profile.selection}</div>
            </div>

            <div
                className="relative mt-auto flex h-10 items-center justify-center overflow-hidden rounded-[var(--component-odds-radius,var(--brand-odds-radius,4px))] border border-[color:var(--brand-odds-border,var(--border-subtle))] bg-[var(--brand-odds-bg,var(--surface-2))] text-title-sm font-bold text-[var(--brand-odds-value,var(--content-primary))] tabular-nums"
                data-odds-profile={componentProfile.oddsButton.profile}
            >
                <span>{profile.odds}</span>
                <span className="absolute right-1.5 top-1.5 text-func-win">
                    <ArrowUpOutlined className="size-3" />
                </span>
            </div>
        </Link>
    );
};
