'use client';

import type { FC } from 'react';
import { useMemo, useState } from 'react';
import { match } from 'ts-pattern';
import { useThemeComponentProfile } from '@/components/theme-provider/component-profile';
import { useSchemeMeta } from '@/components/theme-provider/scheme-meta';
import { cn } from '@/utils/common';
import { createReferenceOddsEntity, ReferenceOddsButton } from '../reference-sports-home/reference-odds';
import { PLAYER_PROP_CATEGORIES, PLAYER_PROP_ENTRIES, PLAYER_PROP_GOLDEN_SUBSTITUTION } from './mock-data';
import { getPlayerPropsSkin, type PlayerPropsSkin } from './skin';
import type { PlayerPropCategory, PlayerPropEntry, PlayerPropMarket, PlayerPropThreshold } from './types';

interface PlayerPropsProps {
    className?: string;
}

const getInitials = (name: string): string =>
    name
        .split(' ')
        .map((part) => part[0])
        .filter(Boolean)
        .slice(0, 2)
        .join('')
        .toUpperCase();

const visibleMarkets = (entry: PlayerPropEntry, category: PlayerPropCategory | 'all'): PlayerPropMarket[] =>
    category === 'all' ? entry.markets : entry.markets.filter((market) => market.category === category);

const PlayerAvatar: FC<{ entry: PlayerPropEntry; skin: PlayerPropsSkin }> = ({ entry, skin }) => (
    <span className={skin.avatarClassName} style={{ background: entry.teamColor }}>
        {getInitials(entry.name)}
    </span>
);

/** 单个阈值赔率 → 接入本地投注单的按钮。整张球员盘口的可点交互都走这里。 */
const ThresholdOdd: FC<{
    entry: PlayerPropEntry;
    market: PlayerPropMarket;
    threshold: PlayerPropThreshold;
    skin: PlayerPropsSkin;
    className?: string;
}> = ({ entry, market, threshold, skin, className }) => {
    const oddsEntity = createReferenceOddsEntity(
        {
            id: `${entry.id}-${market.id}-${threshold.id}`,
            label: `${entry.name} · ${threshold.label} ${market.shortLabel}`,
            value: threshold.value,
        },
        { eventId: entry.eventId, title: entry.matchTitle, marketName: `${entry.name} · ${market.label}` },
    );

    return (
        <ReferenceOddsButton
            className={cn(skin.thresholdClassName, className)}
            selectedClassName={skin.thresholdSelectedClassName}
            oddsEntity={oddsEntity}
        >
            <span className="text-auxiliary-xs font-semibold leading-none opacity-80">{threshold.label}</span>
            <span className="text-body-sm font-bold leading-none">{threshold.value}</span>
        </ReferenceOddsButton>
    );
};

const MarketNudges: FC<{ market: PlayerPropMarket; skin: PlayerPropsSkin; showPopularity: boolean }> = ({
    market,
    skin,
    showPopularity,
}) => {
    if (!market.nudge && !(showPopularity && market.popularity)) return null;

    return (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {market.nudge ? <span className={skin.nudgeClassName}>{market.nudge}</span> : null}
            {showPopularity && market.popularity ? (
                <span className={skin.popularityClassName}>{market.popularity}</span>
            ) : null}
        </div>
    );
};

const GoldenSubstitution: FC<{ skin: PlayerPropsSkin }> = ({ skin }) => (
    <div className={skin.goldenClassName}>
        <div className="flex items-center gap-2">
            <span aria-hidden className="text-base">
                🪙
            </span>
            <span className="text-body-md font-black uppercase text-content-primary">
                {PLAYER_PROP_GOLDEN_SUBSTITUTION.title}
            </span>
        </div>
        <p className={cn('mt-1 text-body-sm', skin.mutedTextClassName)}>{PLAYER_PROP_GOLDEN_SUBSTITUTION.description}</p>
        <button type="button" className={cn('mt-2 text-body-sm font-bold underline-offset-2 hover:underline', skin.nudgeClassName)}>
            {PLAYER_PROP_GOLDEN_SUBSTITUTION.cta}
        </button>
    </div>
);

/** 紧凑列表（match / betbus / gtb）：一行一个球员，右侧主盘口阈值横排。 */
const ListLayout: FC<{
    entries: PlayerPropEntry[];
    category: PlayerPropCategory | 'all';
    skin: PlayerPropsSkin;
}> = ({ entries, category, skin }) => (
    <div className="flex flex-col gap-[var(--component-player-gap,8px)]">
        {entries.map((entry) => {
            const markets = visibleMarkets(entry, category);
            const primary = markets[0];
            if (!primary) return null;

            return (
                <div
                    key={entry.id}
                    className={cn('flex flex-wrap items-center gap-3 p-2.5 sm:flex-nowrap', skin.cardClassName)}
                >
                    <PlayerAvatar entry={entry} skin={skin} />
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <span className="truncate text-body-md font-bold text-content-primary">{entry.name}</span>
                            <span className={cn('text-auxiliary-xs', skin.mutedTextClassName)}>{entry.position}</span>
                        </div>
                        <div className={cn('truncate text-auxiliary-xs', skin.mutedTextClassName)}>
                            {primary.label} · {entry.matchTitle}
                        </div>
                    </div>
                    <div className="flex shrink-0 items-stretch gap-1.5">
                        {primary.thresholds.slice(0, 3).map((threshold) => (
                            <ThresholdOdd
                                key={threshold.id}
                                entry={entry}
                                market={primary}
                                threshold={threshold}
                                skin={skin}
                                className="min-w-[58px]"
                            />
                        ))}
                    </div>
                </div>
            );
        })}
    </div>
);

/** 编辑精选横滑（superbet）：大卡片突出精选球员 + 加成 + 状态助推 + CTA。 */
const RailLayout: FC<{
    entries: PlayerPropEntry[];
    category: PlayerPropCategory | 'all';
    skin: PlayerPropsSkin;
}> = ({ entries, category, skin }) => (
    <div className="flex snap-x gap-[var(--component-player-gap,12px)] overflow-x-auto pb-1">
        {entries.map((entry) => {
            const markets = visibleMarkets(entry, category);
            const primary = markets[0];
            if (!primary) return null;

            return (
                <div
                    key={entry.id}
                    className={cn('flex w-[min(86vw,300px)] shrink-0 snap-start flex-col gap-3 p-3.5', skin.cardClassName)}
                >
                    <div className="flex items-center gap-3">
                        <PlayerAvatar entry={entry} skin={skin} />
                        <div className="min-w-0 flex-1">
                            <div className="truncate text-body-md font-black text-content-primary">{entry.name}</div>
                            <div className={cn('truncate text-auxiliary-xs', skin.mutedTextClassName)}>
                                {entry.team} · {entry.matchTitle}
                            </div>
                        </div>
                        {entry.boostLabel ? <span className={skin.boostBadgeClassName}>{entry.boostLabel}</span> : null}
                    </div>

                    <MarketNudges market={primary} skin={skin} showPopularity={false} />

                    <div className="mt-auto">
                        <div className={cn('mb-1.5 text-auxiliary-xs font-bold uppercase', skin.mutedTextClassName)}>
                            {primary.label}
                        </div>
                        <div className="grid grid-cols-3 gap-1.5">
                            {primary.thresholds.slice(0, 3).map((threshold) => (
                                <ThresholdOdd
                                    key={threshold.id}
                                    entry={entry}
                                    market={primary}
                                    threshold={threshold}
                                    skin={skin}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            );
        })}
    </div>
);

/** 博彩化阈值矩阵（betano）：球员行 × 阈值列，状态助推 + 社交证明 + 黄金替换。 */
const MatrixLayout: FC<{
    entries: PlayerPropEntry[];
    category: PlayerPropCategory | 'all';
    skin: PlayerPropsSkin;
    showGolden: boolean;
}> = ({ entries, category, skin, showGolden }) => (
    <div className="flex flex-col gap-[var(--component-player-gap,10px)]">
        {entries.map((entry) => {
            const markets = visibleMarkets(entry, category);
            if (!markets.length) return null;

            return (
                <div key={entry.id} className={cn('flex flex-col gap-2.5 p-3', skin.cardClassName)}>
                    <div className="flex items-center gap-3">
                        <PlayerAvatar entry={entry} skin={skin} />
                        <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <span className="truncate text-body-md font-bold text-content-primary">{entry.name}</span>
                                <span className={cn('text-auxiliary-xs', skin.mutedTextClassName)}>{entry.position}</span>
                            </div>
                            <div className={cn('truncate text-auxiliary-xs', skin.mutedTextClassName)}>
                                {entry.matchTitle}
                            </div>
                        </div>
                        {entry.boostLabel ? <span className={skin.boostBadgeClassName}>{entry.boostLabel}</span> : null}
                    </div>

                    {markets.map((market) => (
                        <div key={market.id} className="flex flex-col gap-1.5">
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-body-sm font-bold text-content-primary">{market.label}</span>
                            </div>
                            <MarketNudges market={market} skin={skin} showPopularity />
                            <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
                                {market.thresholds.map((threshold) => (
                                    <ThresholdOdd
                                        key={threshold.id}
                                        entry={entry}
                                        market={market}
                                        threshold={threshold}
                                        skin={skin}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            );
        })}

        {showGolden ? <GoldenSubstitution skin={skin} /> : null}
    </div>
);

/** 球员盘口板块：mock 数据 + 接选注交互，按品牌（情况 B）切列表 / 横滑 / 矩阵三种结构。 */
export const PlayerProps: FC<PlayerPropsProps> = ({ className }) => {
    const schemeMeta = useSchemeMeta();
    const componentProfile = useThemeComponentProfile();
    const playerProps = componentProfile.playerProps;
    const skin = useMemo(() => getPlayerPropsSkin(schemeMeta), [schemeMeta]);
    const [category, setCategory] = useState<PlayerPropCategory | 'all'>('all');

    const entries = useMemo(
        () => PLAYER_PROP_ENTRIES.filter((entry) => visibleMarkets(entry, category).length > 0),
        [category],
    );

    const body = match(playerProps.profile)
        .with('betano-stat-matrix', () => (
            <MatrixLayout
                entries={entries}
                category={category}
                skin={skin}
                showGolden={playerProps.showGoldenSubstitution}
            />
        ))
        .with('superbet-curated-rail', () => <RailLayout entries={entries} category={category} skin={skin} />)
        .otherwise(() => <ListLayout entries={entries} category={category} skin={skin} />);

    return (
        <section
            className={cn('flex min-w-0 flex-col gap-[var(--component-player-gap,8px)]', skin.sectionClassName, className)}
            data-player-props-profile={playerProps.profile}
            data-player-props-layout={playerProps.layout}
            data-player-props-interaction={playerProps.interaction}
            style={componentProfile.style}
        >
            <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                    <div className="text-auxiliary-xs font-bold uppercase text-[var(--brand-primary-0)]">
                        Player Props
                    </div>
                    <h2 className="text-headline-md text-content-primary">Top player markets</h2>
                </div>
                <span className={skin.headerChipClassName}>Bet Builder ready</span>
            </div>

            {playerProps.categoryFilter === 'chips' ? (
                <div className="flex flex-wrap gap-1.5">
                    <button
                        type="button"
                        className={cn(skin.categoryChipClassName, category === 'all' && skin.categoryChipActiveClassName)}
                        onClick={() => setCategory('all')}
                    >
                        All
                    </button>
                    {PLAYER_PROP_CATEGORIES.map((meta) => (
                        <button
                            key={meta.id}
                            type="button"
                            className={cn(
                                skin.categoryChipClassName,
                                category === meta.id && skin.categoryChipActiveClassName,
                            )}
                            onClick={() => setCategory(meta.id)}
                        >
                            {meta.label}
                        </button>
                    ))}
                </div>
            ) : null}

            {body}
        </section>
    );
};
