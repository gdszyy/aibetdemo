'use client';

import Image from 'next/image';
import { useLocale } from 'next-intl';
import { type ComponentType, type CSSProperties, type FC, type FormEvent, useEffect, useRef, useState } from 'react';
import type { CasinoGame } from '@/api/models/casino';
import { ProductEnum, ProductRawEnum } from '@/api/models/market';
import anniversaryBr from '@/assets/images/promotion/anniversary-br.png';
import parlayBr from '@/assets/images/promotion/parlay-br.png';
import refundBr from '@/assets/images/promotion/refund-br.png';
import { BannerCarousel, type BannerItem } from '@/components/banner-carousel';
import { ClockOutlined } from '@/components/icons2/ClockOutlined';
import { CupOutlined } from '@/components/icons2/CupOutlined';
import { SearchOutlined } from '@/components/icons2/SearchOutlined';
import { SportFootballOutlined } from '@/components/icons2/SportFootballOutlined';
import { StarFilled } from '@/components/icons2/StarFilled';
import { useThemeComponentProfile } from '@/components/theme-provider/component-profile';
import { useSchemeMeta } from '@/components/theme-provider/scheme-meta';
import { Link } from '@/i18n';
import { useHotCasinoGames } from '@/modules/home/_components/hot-casino-games/use-hot-casino-games';
import { PlayerProps } from '@/modules/home/_components/player-props';
import { SmartActivityCards } from '@/modules/home/_components/smart-activity-cards';
import { ParlayBoost } from '@/modules/home/_components/super-odds';
import { TopLiveMatches } from '@/modules/home/_components/top-live-matches';
import {
    type BannerMarket,
    getGlassActivityBanners,
    isGlassBannerScheme,
} from '@/modules/home/_logic/glass-activity-banners';
import { cn } from '@/utils/common';
import { createReferenceOddsEntity, type Odd, ReferenceOddsButton, type ReferenceOddsContext } from './reference-odds';
import styles from './reference-sports-home.module.css';

type IconComponent = ComponentType<{ className?: string }>;

interface MatchSide {
    abbr: string;
    name: string;
    color: string;
    score?: number;
}

/**
 * 首页推广横幅数据：直接复用整张 Banner 图资源，不叠加标题/文案/按钮。
 * 复用共享 BannerCarousel：移动端 1 张轮播、桌面端 3 张一行，aspect-360/128 与 720×256 图源比例一致。
 */
const PROMO_BANNERS: BannerItem[] = [
    { id: 1, title: 'Free Bet Bonanza', link: '/sports/promotions', imageUrl: anniversaryBr },
    { id: 2, title: 'Special Bets', link: '/sports/promotions', imageUrl: parlayBr },
    { id: 3, title: 'Lightning Goal: ENG vs CRO', link: '/sports/promotions', imageUrl: refundBr },
];

interface LeagueHub {
    /** 主标题，如 'Group C' / 'Brazil' */
    title: string;
    /** 上方小标，如 'World Cup' / 'Nation' / 'Futures' */
    eyebrow: string;
    /** 角标短码，如 'C' / 'BRA' / 'GB' */
    code: string;
    /** 国家/分组识别色：仅用于 accent 条、角标描边、12% 低饱和底纹，不再整块铺底 */
    accent: string;
    href: string;
    /** 当前直播场次，0 表示无直播 */
    live: number;
    /** 次要计数文案，如 '6 matches' / 'Outright' */
    meta: string;
    /** 下一条信息的前缀，如 'NEXT' / 'LIVE' / 'OPENS' */
    nextHint: string;
    /** 下一场/核心市场描述，如 'SCO vs BRA · 18:00' */
    next: string;
    viewers: string;
}

const LEAGUES: LeagueHub[] = [
    {
        title: 'Group C',
        eyebrow: 'World Cup',
        code: 'C',
        accent: '#16a34a',
        href: '/leagues/80462',
        live: 2,
        meta: '6 matches',
        nextHint: 'NEXT',
        next: 'SCO vs BRA · 18:00',
        viewers: '42,318',
    },
    {
        title: 'Group A',
        eyebrow: 'World Cup',
        code: 'A',
        accent: '#0d9488',
        href: '/leagues/84635',
        live: 1,
        meta: '6 matches',
        nextHint: 'NEXT',
        next: 'CZE vs MEX · 21:00',
        viewers: '36,904',
    },
    {
        title: 'Group B',
        eyebrow: 'World Cup',
        code: 'B',
        accent: '#dc2626',
        href: '/leagues/84437',
        live: 1,
        meta: '6 matches',
        nextHint: 'NEXT',
        next: 'SUI vs CAN · 15:00',
        viewers: '31,576',
    },
    {
        title: 'Group K',
        eyebrow: 'World Cup',
        code: 'K',
        accent: '#2563eb',
        href: '/leagues/85334',
        live: 2,
        meta: '6 matches',
        nextHint: 'LIVE',
        next: "POR vs UZB · 62'",
        viewers: '24,690',
    },
    {
        title: 'Brazil',
        eyebrow: 'Nation',
        code: 'BRA',
        accent: '#15803d',
        href: '/leagues/84182',
        live: 1,
        meta: '4 matches',
        nextHint: 'NEXT',
        next: 'SCO vs BRA · 18:00',
        viewers: '58,112',
    },
    {
        title: 'Mexico',
        eyebrow: 'Nation',
        code: 'MEX',
        accent: '#0f766e',
        href: '/leagues/325',
        live: 0,
        meta: '3 matches',
        nextHint: 'NEXT',
        next: 'CZE vs MEX · 21:00',
        viewers: '49,280',
    },
    {
        title: 'Knockout',
        eyebrow: 'Futures',
        code: 'KO',
        accent: '#4f46e5',
        href: '/leagues/85215',
        live: 0,
        meta: 'Bracket',
        nextHint: 'OPENS',
        next: 'Round of 32 · Sat',
        viewers: '19,844',
    },
    {
        title: 'Golden Boot',
        eyebrow: 'Futures',
        code: 'GB',
        accent: '#7c3aed',
        href: '/leagues/80875',
        live: 0,
        meta: 'Outright',
        nextHint: 'MARKET',
        next: 'Top scorer',
        viewers: '16,731',
    },
];

const TREND_TABS = [
    'World Cup',
    'Today',
    'In-Play',
    'Group A',
    'Group B',
    'Group C',
    'Outrights',
    'Handicap',
    'Totals',
    'Both Teams',
    'Player Props',
];

const SEARCH_GROUPS = [
    { title: 'Recent', chips: ['Brazil', 'Mexico', 'World Cup winner'] },
    { title: 'Trending', chips: ['Scotland vs Brazil', 'Czechia vs Mexico', 'Brazil -1.5'] },
];

const SEARCH_RESULTS: Array<
    | {
          type: 'match';
          title: string;
          subtitle: string;
          odd: string;
          href: string;
      }
    | {
          type: 'game';
          title: string;
          subtitle: string;
          mono: string;
          bg: string;
          href: string;
      }
> = [
    {
        type: 'match',
        title: 'Scotland vs Brazil',
        subtitle: 'World Cup - Group C | Today 18:00 ET',
        odd: '1.42',
        href: '/matches/scotland-vs-brazil',
    },
    {
        type: 'match',
        title: 'Czechia vs Mexico',
        subtitle: 'World Cup - Group A | Today 21:00 ET',
        odd: '2.18',
        href: '/matches/czechia-vs-mexico',
    },
    {
        type: 'game',
        title: 'Penalty Shootout',
        subtitle: 'World Cup Arcade | Instant',
        mono: 'PK',
        bg: 'linear-gradient(150deg,#006847,#ce1126)',
        href: '/casino/game/penalty-shootout',
    },
    {
        type: 'game',
        title: 'Golden Boot Wheel',
        subtitle: 'World Cup Arcade | Live',
        mono: 'GB',
        bg: 'linear-gradient(150deg,#102a43,#d4af37)',
        href: '/casino/game/golden-boot-wheel',
    },
];

const TRENDING_EVENTS: Array<{
    id: string;
    league: string;
    timeLabel: string;
    time: string;
    home: MatchSide;
    away: MatchSide;
    odds: Odd[];
    marketName?: string;
}> = [
    {
        id: 'switzerland-canada',
        league: 'World Cup - Group B',
        timeLabel: 'Today',
        time: '15:00',
        home: { abbr: 'SUI', name: 'Switzerland', color: '#d52b1e' },
        away: { abbr: 'CAN', name: 'Canada', color: '#ff0000' },
        odds: [
            { id: 'home', label: '1', value: '2.62' },
            { id: 'draw', label: 'X', value: '3.15' },
            { id: 'away', label: '2', value: '2.78' },
        ],
    },
    {
        id: 'bosnia-qatar',
        league: 'World Cup - Group B',
        timeLabel: 'Today',
        time: '15:00',
        home: { abbr: 'BIH', name: 'Bosnia and Herzegovina', color: '#002f6c' },
        away: { abbr: 'QAT', name: 'Qatar', color: '#8a1538' },
        odds: [
            { id: 'home', label: '1', value: '1.88' },
            { id: 'draw', label: 'X', value: '3.45' },
            { id: 'away', label: '2', value: '4.20' },
        ],
    },
    {
        id: 'scotland-brazil',
        league: 'World Cup - Group C',
        timeLabel: 'Today',
        time: '18:00',
        home: { abbr: 'SCO', name: 'Scotland', color: '#005eb8' },
        away: { abbr: 'BRA', name: 'Brazil', color: '#009b3a' },
        marketName: 'Asian handicap',
        odds: [
            { id: 'home-handicap', label: 'SCO +1.5', value: '1.84' },
            { id: 'away-handicap', label: 'BRA -1.5', value: '2.02' },
            { id: 'over', label: 'O 2.5', value: '1.78' },
        ],
    },
    {
        id: 'morocco-haiti',
        league: 'World Cup - Group C',
        timeLabel: 'Today',
        time: '18:00',
        home: { abbr: 'MAR', name: 'Morocco', color: '#c1272d' },
        away: { abbr: 'HAI', name: 'Haiti', color: '#00209f' },
        odds: [
            { id: 'home', label: '1', value: '1.58' },
            { id: 'draw', label: 'X', value: '4.05' },
            { id: 'away', label: '2', value: '5.80' },
        ],
    },
    {
        id: 'czechia-mexico',
        league: 'World Cup - Group A',
        timeLabel: 'Today',
        time: '21:00',
        home: { abbr: 'CZE', name: 'Czechia', color: '#d7141a' },
        away: { abbr: 'MEX', name: 'Mexico', color: '#006847' },
        odds: [
            { id: 'home', label: '1', value: '3.10' },
            { id: 'draw', label: 'X', value: '3.25' },
            { id: 'away', label: '2', value: '2.18' },
        ],
    },
];

const PARLAY_PICKS: Array<{
    id: string;
    time: string;
    markets: string;
    boosted?: boolean;
    home: MatchSide;
    away: MatchSide;
    backed: string;
    backedTeam: string;
    odds: Odd[];
}> = [
    {
        id: 'spain-cape-verde',
        time: 'Today 18:00',
        markets: '+212 markets',
        boosted: true,
        home: { abbr: 'SCO', name: 'Scotland', color: '#005eb8' },
        away: { abbr: 'BRA', name: 'Brazil', color: '#009b3a' },
        backed: '81% backed',
        backedTeam: 'Brazil -1.5',
        odds: [
            { id: 'brazil-handicap', label: 'BRA -1.5', value: '2.02' },
            { id: 'over', label: 'Over 2.5', value: '1.78' },
            { id: 'vinicius-shot', label: 'Vini SOT', value: '1.92' },
        ],
    },
    {
        id: 'belgium-egypt',
        time: 'Today 21:00',
        markets: '+186 markets',
        home: { abbr: 'CZE', name: 'Czechia', color: '#d7141a' },
        away: { abbr: 'MEX', name: 'Mexico', color: '#006847' },
        backed: '74% backed',
        backedTeam: 'Mexico draw no bet',
        odds: [
            { id: 'mexico-dnb', label: 'MEX DNB', value: '1.62' },
            { id: 'under', label: 'Under 2.5', value: '1.86' },
            { id: 'btTS-no', label: 'BTTS No', value: '1.95' },
        ],
    },
    {
        id: 'saudi-uruguay',
        time: 'Today 15:00',
        markets: '+174 markets',
        boosted: true,
        home: { abbr: 'SUI', name: 'Switzerland', color: '#d52b1e' },
        away: { abbr: 'CAN', name: 'Canada', color: '#ff0000' },
        backed: '69% backed',
        backedTeam: 'goals market',
        odds: [
            { id: 'over', label: 'Over 2.0', value: '1.70' },
            { id: 'canada-score', label: 'CAN goal', value: '1.48' },
            { id: 'draw', label: 'Draw', value: '3.15' },
        ],
    },
    {
        id: 'iran-new-zealand',
        time: 'Today 18:00',
        markets: '+158 markets',
        home: { abbr: 'MAR', name: 'Morocco', color: '#c1272d' },
        away: { abbr: 'HAI', name: 'Haiti', color: '#00209f' },
        backed: '67% backed',
        backedTeam: 'Morocco win',
        odds: [
            { id: 'morocco', label: 'Morocco', value: '1.58' },
            { id: 'morocco-clean', label: 'Clean sheet', value: '2.10' },
            { id: 'under', label: 'Under 3.5', value: '1.44' },
        ],
    },
    {
        id: 'argentina-mexico',
        time: 'Today 21:00',
        markets: '+161 markets',
        home: { abbr: 'RSA', name: 'South Africa', color: '#007a4d' },
        away: { abbr: 'KOR', name: 'South Korea', color: '#c60c30' },
        backed: '62% backed',
        backedTeam: 'South Korea +0',
        odds: [
            { id: 'korea-dnb', label: 'KOR DNB', value: '1.74' },
            { id: 'under', label: 'Under 2.5', value: '1.72' },
            { id: 'draw', label: 'Draw', value: '3.05' },
        ],
    },
];

const OUTRIGHTS: Array<{ id: string; name: string; abbr: string; color: string; odd: string }> = [
    { id: 'brazil', name: 'Brazil', abbr: 'BRA', color: '#1a8c3a', odd: '5.80' },
    { id: 'france', name: 'France', abbr: 'FRA', color: '#0055a4', odd: '6.20' },
    { id: 'spain', name: 'Spain', abbr: 'ESP', color: '#aa151b', odd: '6.70' },
    { id: 'england', name: 'England', abbr: 'ENG', color: '#cf142b', odd: '8.20' },
    { id: 'argentina', name: 'Argentina', abbr: 'ARG', color: '#6cace4', odd: '9.40' },
    { id: 'portugal', name: 'Portugal', abbr: 'POR', color: '#006600', odd: '10.50' },
    { id: 'germany', name: 'Germany', abbr: 'GER', color: '#444444', odd: '13.00' },
];

const LIVE_MATCHES: Array<{
    id: string;
    league: string;
    minute: string;
    home: MatchSide;
    away: MatchSide;
    markets: string;
    odds: Odd[];
}> = [
    {
        id: 'portugal-uzbekistan',
        league: 'World Cup - Group K',
        minute: "62'",
        home: { abbr: 'POR', name: 'Portugal', color: '#006600', score: 3 },
        away: { abbr: 'UZB', name: 'Uzbekistan', color: '#1eb6e8', score: 0 },
        markets: '+ 198 markets',
        odds: [
            { id: 'home', label: '1', value: '1.02' },
            { id: 'over', label: 'O 4.5', value: '2.18' },
            { id: 'next-goal', label: 'Next POR', value: '1.64' },
        ],
    },
    {
        id: 'colombia-dr-congo',
        league: 'World Cup - Group K',
        minute: "76'",
        home: { abbr: 'COL', name: 'Colombia', color: '#fcd116', score: 1 },
        away: { abbr: 'COD', name: 'DR Congo', color: '#00a3e0', score: 0 },
        markets: '+ 142 markets',
        odds: [
            { id: 'home', label: '1', value: '1.18' },
            { id: 'draw', label: 'X', value: '5.60' },
            { id: 'under', label: 'U 2.5', value: '1.52' },
        ],
    },
];

const UPCOMING_MATCHES: Array<{
    id: string;
    day: string;
    time: string;
    title: string;
    league: string;
    odds: Odd[];
}> = [
    {
        id: 'scotland-brazil-upcoming',
        day: 'Today',
        time: '18:00',
        title: 'Scotland vs Brazil',
        league: 'World Cup - Group C',
        odds: [
            { id: 'home', label: '1', value: '7.40' },
            { id: 'draw', label: 'X', value: '4.70' },
            { id: 'away', label: '2', value: '1.42' },
        ],
    },
    {
        id: 'czechia-mexico-upcoming',
        day: 'Today',
        time: '21:00',
        title: 'Czechia vs Mexico',
        league: 'World Cup - Group A',
        odds: [
            { id: 'home', label: '1', value: '3.10' },
            { id: 'draw', label: 'X', value: '3.25' },
            { id: 'away', label: '2', value: '2.18' },
        ],
    },
    {
        id: 'ecuador-germany',
        day: 'Thu',
        time: '16:00',
        title: 'Ecuador vs Germany',
        league: 'World Cup - Group E',
        odds: [
            { id: 'home', label: '1', value: '4.80' },
            { id: 'draw', label: 'X', value: '3.70' },
            { id: 'away', label: '2', value: '1.70' },
        ],
    },
];

const ChevronIcon: FC<{ direction: 'left' | 'right'; className?: string }> = ({ direction, className }) => (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
            d={direction === 'left' ? 'M12.5 4.5 7 10l5.5 5.5' : 'M7.5 4.5 13 10l-5.5 5.5'}
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const FireIcon: FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
            d="M10.9 2.4c.4 2.5 2.6 3.8 3.6 5.8 1.8 3.8-.8 8-4.7 8-3.3 0-5.8-2.4-5.8-5.7 0-2.3 1.4-4.1 3.4-5.9-.1 1.6.5 2.6 1.3 3.2.4-2.1 1-3.8 2.2-5.4Z"
            fill="currentColor"
        />
    </svg>
);

const EyeIcon: FC<{ className?: string }> = ({ className }) => (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
        <path
            d="M10 4.6c-3.6 0-6.6 2.2-8 5.4 1.4 3.2 4.4 5.4 8 5.4s6.6-2.2 8-5.4c-1.4-3.2-4.4-5.4-8-5.4Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
        />
        <circle cx="10" cy="10" r="2.3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
);

const SectionHeader: FC<{
    title: string;
    target?: string;
    onScroll?: (target: string, direction: -1 | 1) => void;
    live?: boolean;
    moreHref?: string;
}> = ({ title, target, onScroll, live = false, moreHref }) => (
    <div className={styles.sectionHead}>
        {live && (
            <span className={styles.liveTitlePill}>
                <span className={styles.liveDot} />
                LIVE
            </span>
        )}
        <h2 className={styles.sectionTitle}>{title}</h2>
        {moreHref ? (
            <Link href={moreHref} className={styles.sectionMore}>
                View All
            </Link>
        ) : null}
        {target && onScroll ? (
            <div className={styles.navArrows}>
                <button
                    type="button"
                    className={styles.arrowButton}
                    onClick={() => onScroll(target, -1)}
                    aria-label={`Scroll ${title} left`}
                >
                    <ChevronIcon direction="left" className={styles.arrowIcon} />
                </button>
                <button
                    type="button"
                    className={styles.arrowButton}
                    onClick={() => onScroll(target, 1)}
                    aria-label={`Scroll ${title} right`}
                >
                    <ChevronIcon direction="right" className={styles.arrowIcon} />
                </button>
            </div>
        ) : null}
    </div>
);

const SearchPopover: FC<{
    open: boolean;
    onChipClick: (label: string) => void;
    onResultClick: () => void;
}> = ({ open, onChipClick, onResultClick }) => (
    <div className={styles.searchPop} hidden={!open}>
        {SEARCH_GROUPS.map((group) => (
            <div key={group.title} className={styles.searchGroup}>
                <div className={styles.searchHeading}>{group.title}</div>
                <div className={styles.searchChips}>
                    {group.chips.map((chip) => (
                        <button key={chip} type="button" onClick={() => onChipClick(chip)}>
                            {chip}
                        </button>
                    ))}
                </div>
            </div>
        ))}

        <div className={styles.searchGroup}>
            <div className={styles.searchHeading}>Matches</div>
            {SEARCH_RESULTS.map((result) =>
                result.type === 'match' ? (
                    <Link key={result.href} href={result.href} className={styles.searchResult} onClick={onResultClick}>
                        <SportFootballOutlined className={styles.searchResultIcon} />
                        <span className={styles.searchResultTitle}>
                            {result.title}
                            <i>{result.subtitle}</i>
                        </span>
                        <span className={styles.searchOdd}>{result.odd}</span>
                    </Link>
                ) : null,
            )}
        </div>

        <div className={styles.searchGroup}>
            <div className={styles.searchHeading}>Games</div>
            {SEARCH_RESULTS.map((result) =>
                result.type === 'game' ? (
                    <Link key={result.href} href={result.href} className={styles.searchResult} onClick={onResultClick}>
                        <span className={styles.searchGameIcon} style={{ background: result.bg }}>
                            {result.mono}
                        </span>
                        <span className={styles.searchResultTitle}>
                            {result.title}
                            <i>{result.subtitle}</i>
                        </span>
                    </Link>
                ) : null,
            )}
        </div>
    </div>
);

const OddsGrid: FC<{
    context: ReferenceOddsContext;
    odds: Odd[];
    prefix: string;
}> = ({ context, odds, prefix }) => (
    <div className={styles.oddsGrid}>
        {odds.map((odd) => {
            const id = `${prefix}-${odd.id}`;
            const oddsEntity = createReferenceOddsEntity(odd, context);
            return (
                <ReferenceOddsButton
                    key={id}
                    className={styles.odd}
                    selectedClassName={styles.oddSelected}
                    oddsEntity={oddsEntity}
                >
                    <span className={styles.oddLabel}>{odd.label}</span>
                    <span className={styles.oddValue}>{odd.value}</span>
                </ReferenceOddsButton>
            );
        })}
    </div>
);

const Avatar: FC<{ side: MatchSide; className?: string }> = ({ side, className }) => (
    <span className={cn(styles.avatar, className)} style={{ background: side.color }}>
        {side.abbr}
    </span>
);

const Flag: FC<{ side: Pick<MatchSide, 'abbr' | 'color'> }> = ({ side }) => (
    <span className={styles.flag} style={{ background: side.color }}>
        {side.abbr}
    </span>
);

const HorizontalScroller: FC<{
    id: string;
    className?: string;
    setScroller: (id: string) => (node: HTMLDivElement | null) => void;
    children: React.ReactNode;
}> = ({ id, className, setScroller, children }) => (
    <div ref={setScroller(id)} className={cn(styles.hScroll, className)}>
        {children}
    </div>
);

/** 首页推广横幅：纯图片轮播，复用共享 BannerCarousel（移动端 1 张、桌面端 3 张一行）。 */
const PromoCards: FC = () => {
    const locale = useLocale();
    const schemeMeta = useSchemeMeta();
    const market: BannerMarket = locale === 'pt' ? 'br' : 'mx';
    const banners = isGlassBannerScheme(schemeMeta.scheme)
        ? getGlassActivityBanners(schemeMeta.scheme, market)
        : PROMO_BANNERS;

    return <BannerCarousel banners={banners} />;
};

const TrendingCompetitionCard: FC<{ league: LeagueHub; icon: IconComponent }> = ({ league, icon: Icon }) => (
    <Link
        href={league.href}
        className={styles.leagueCard}
        data-home-recommend-card-kind="competition"
        style={{ '--league-accent': league.accent } as CSSProperties}
    >
        <div className={styles.leagueHead}>
            <span className={styles.leagueCode}>{league.code}</span>
            <span className={styles.leagueTitles}>
                <span className={styles.leagueEyebrow}>{league.eyebrow}</span>
                <span className={styles.leagueName}>{league.title}</span>
            </span>
            <Icon className={styles.leagueIcon} />
        </div>
        <div className={styles.leagueNext}>
            <span className={styles.leagueNextHint}>{league.nextHint}</span>
            <span className={styles.leagueNextValue}>{league.next}</span>
        </div>
        <div className={styles.leagueMeta}>
            {league.live > 0 ? (
                <span className={styles.leagueLive}>
                    <span className={styles.liveDot} />
                    {league.live} Live
                </span>
            ) : null}
            <span className={styles.leagueCount}>{league.meta}</span>
            <span className={styles.leagueWatch}>
                <EyeIcon className={styles.watchIcon} />
                {league.viewers}
            </span>
        </div>
    </Link>
);

const TrendingEventCard: FC<{
    event: (typeof TRENDING_EVENTS)[number];
}> = ({ event }) => (
    <article className={styles.trendCard} data-home-recommend-card-kind="trending-event">
        <div className={styles.trendTop}>
            <span>{event.league}</span>
            <span className={styles.playMark} />
        </div>
        <div className={styles.trendMiddle}>
            <div className={styles.trendTeam}>
                <Avatar side={event.home} />
                <span className={styles.teamName}>{event.home.name}</span>
            </div>
            <div className={styles.trendTime}>
                {event.timeLabel}
                <b>{event.time}</b>
            </div>
            <div className={styles.trendTeam}>
                <Avatar side={event.away} />
                <span className={styles.teamName}>{event.away.name}</span>
            </div>
        </div>
        <OddsGrid
            odds={event.odds}
            prefix={event.id}
            context={{
                eventId: `reference:${event.id}`,
                title: `${event.home.name} vs ${event.away.name}`,
                marketName: event.marketName ?? '1x2',
                tournamentId: `reference:${event.league}`,
            }}
        />
    </article>
);

const CasinoGameTile: FC<{ game: CasinoGame; lobbyId: number }> = ({ game, lobbyId }) => {
    const [imageError, setImageError] = useState(false);
    const showCover = Boolean(game.logo_url) && !imageError;

    return (
        <Link
            href={`/casino/game/${game.id}?lobby_id=${lobbyId}`}
            className={styles.gameTile}
            data-home-recommend-card-kind="casino-game"
        >
            <div className={styles.gameThumb}>
                {showCover ? (
                    <Image
                        src={game.logo_url}
                        alt={game.name}
                        fill
                        sizes="132px"
                        className={styles.gameCover}
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <span className={styles.gameMono}>{game.name.slice(0, 2).toUpperCase()}</span>
                )}
                {game.game_type ? <span className={styles.gameProvider}>{game.game_type}</span> : null}
                <span className={styles.gamePlay}>
                    <span>Play</span>
                </span>
            </div>
            <span className={styles.gameName}>{game.name}</span>
        </Link>
    );
};

const ParlayCard: FC<{
    item: (typeof PARLAY_PICKS)[number];
}> = ({ item }) => (
    <article className={styles.hotCard} data-home-recommend-card-kind="parlay-pick">
        <div className={styles.hotTop}>
            <CupOutlined className={styles.smallIcon} />
            <span className={styles.hotLeague}>International - World Cup</span>
            <button
                type="button"
                className={styles.star}
                aria-label={`Favorite ${item.home.name} vs ${item.away.name}`}
            >
                <StarFilled className={styles.smallIcon} />
            </button>
        </div>
        <div className={styles.hotTime}>
            <ClockOutlined className={styles.smallIcon} />
            {item.time}
            <span className={styles.marketTag}>{item.markets}</span>
            {item.boosted ? <span className={styles.boost}>BOOST</span> : null}
        </div>
        <div className={styles.matchup}>
            <div className={styles.country}>
                <Flag side={item.home} />
                <span className={styles.countryName}>{item.home.name}</span>
            </div>
            <span className={styles.vs}>VS</span>
            <div className={styles.country}>
                <Flag side={item.away} />
                <span className={styles.countryName}>{item.away.name}</span>
            </div>
        </div>
        <div className={styles.popularity}>
            <FireIcon className={cn(styles.smallIcon, styles.fire)} />
            {item.backed} <b>{item.backedTeam}</b>
        </div>
        <OddsGrid
            odds={item.odds}
            prefix={item.id}
            context={{
                eventId: `reference:${item.id}`,
                title: `${item.home.name} vs ${item.away.name}`,
                marketName: 'World Cup combo',
                tournamentId: 'reference:international-world-cup',
            }}
        />
    </article>
);

const OutrightCard: FC<{
    item: (typeof OUTRIGHTS)[number];
}> = ({ item }) => {
    const oddsEntity = createReferenceOddsEntity(
        { id: item.id, label: item.name, value: item.odd },
        {
            eventId: `reference:outright:${item.id}`,
            isOutright: true,
            marketName: 'World Cup Winner',
            title: 'Who will win the World Cup?',
            tournamentId: 'reference:world-cup-winner',
        },
    );

    return (
        <ReferenceOddsButton
            className={styles.outrightCard}
            data-home-recommend-card-kind="outright"
            oddsEntity={oddsEntity}
        >
            {({ selected }) => (
                <>
                    <Flag side={item} />
                    <div className={styles.outrightName}>{item.name}</div>
                    <div className={cn(styles.outrightOdd, selected && styles.oddSelected)}>
                        <span className={styles.oddValue}>{item.odd}</span>
                    </div>
                </>
            )}
        </ReferenceOddsButton>
    );
};

const LiveMatchRow: FC<{
    match: (typeof LIVE_MATCHES)[number];
}> = ({ match }) => (
    <article className={styles.matchRow} data-home-recommend-card-kind="live-row">
        <div className={styles.matchTop}>
            <span className={styles.matchLeague}>{match.league}</span>
            <span className={styles.matchMinute}>
                <span className={styles.liveDot} />
                {match.minute}
            </span>
        </div>
        <div className={styles.matchBody}>
            <div className={styles.teams}>
                {[match.home, match.away].map((team) => (
                    <div key={team.name} className={styles.teamLine}>
                        <span className={styles.smallAvatar}>{team.abbr}</span>
                        <span className={styles.teamLineName}>{team.name}</span>
                        <span className={styles.teamScore}>{team.score ?? 0}</span>
                    </div>
                ))}
            </div>
            <OddsGrid
                odds={match.odds}
                prefix={match.id}
                context={{
                    eventId: `reference:${match.id}`,
                    title: `${match.home.name} vs ${match.away.name}`,
                    marketName: '1x2',
                    matchStatus: 1,
                    productId: ProductEnum.Live,
                    productRaw: ProductRawEnum.Inplay,
                    tournamentId: `reference:${match.league}`,
                }}
            />
        </div>
        <div className={styles.matchBottom}>
            <Link href="/sports-live">{match.markets}</Link>
            <Link href="/sports-live">Stats</Link>
        </div>
    </article>
);

const UpcomingRow: FC<{
    match: (typeof UPCOMING_MATCHES)[number];
}> = ({ match }) => (
    <div className={styles.upcomingRow} data-home-recommend-card-kind="upcoming-row">
        <div className={styles.when}>
            {match.day}
            <b>{match.time}</b>
        </div>
        <div className={styles.upcomingTeams}>
            {match.title}
            <small>{match.league}</small>
        </div>
        <OddsGrid
            odds={match.odds}
            prefix={match.id}
            context={{
                eventId: `reference:${match.id}`,
                title: match.title,
                marketName: '1x2',
                tournamentId: `reference:${match.league}`,
            }}
        />
    </div>
);

export const ReferenceSportsHome: FC = () => {
    const scrollersRef = useRef<Record<string, HTMLDivElement | null>>({});
    const searchRef = useRef<HTMLFormElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const componentProfile = useThemeComponentProfile();
    const { data: fanGames } = useHotCasinoGames();
    const [query, setQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);

    useEffect(() => {
        const handlePointerDown = (event: PointerEvent) => {
            if (!(event.target instanceof Node)) {
                return;
            }

            if (!searchRef.current?.contains(event.target)) {
                setSearchOpen(false);
            }
        };

        document.addEventListener('pointerdown', handlePointerDown);

        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
        };
    }, []);

    const setScroller = (id: string) => (node: HTMLDivElement | null) => {
        scrollersRef.current[id] = node;
    };

    const handleScroll = (target: string, direction: -1 | 1) => {
        scrollersRef.current[target]?.scrollBy({ left: direction * 320, behavior: 'smooth' });
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    const handleSearchChipClick = (label: string) => {
        setQuery(label);
        setSearchOpen(true);
        searchInputRef.current?.focus();
    };

    const handleSearchResultClick = () => {
        setSearchOpen(false);
        searchInputRef.current?.blur();
    };

    return (
        <div
            className={styles.root}
            data-home-recommend-profile={componentProfile.homeRecommend.profile}
            data-home-recommend-layout={componentProfile.homeRecommend.sectionLayout}
            data-home-recommend-interaction={componentProfile.homeRecommend.interaction}
            data-smart-activity-profile={componentProfile.activityCards.profile}
            data-smart-activity-layout={componentProfile.activityCards.layout}
            data-smart-activity-interaction={componentProfile.activityCards.interaction}
            style={componentProfile.style}
        >
            <form ref={searchRef} className={styles.topSearch} onSubmit={handleSubmit}>
                <SearchOutlined className={styles.searchIcon} />
                <input
                    ref={searchInputRef}
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    onFocus={() => setSearchOpen(true)}
                    placeholder="Search teams or matches"
                    type="search"
                />
                <SearchPopover
                    open={searchOpen}
                    onChipClick={handleSearchChipClick}
                    onResultClick={handleSearchResultClick}
                />
            </form>

            <PromoCards />

            <section className={cn(styles.section, styles.sectionCompact)}>
                <SectionHeader title="World Cup Hubs" target="competitions" onScroll={handleScroll} />
                <HorizontalScroller id="competitions" className={styles.leagueRow} setScroller={setScroller}>
                    {LEAGUES.map((league) => (
                        <TrendingCompetitionCard key={league.href} league={league} icon={SportFootballOutlined} />
                    ))}
                </HorizontalScroller>
            </section>

            <div className={styles.mainGrid}>
                {/* 排序原则：转化/参与优先 —— 实时可下注内容靠前，玩法卡其次，期货 / 异业交叉销售置底 */}

                {/* Tier 1 · 实时 In-Play（时效性最强、参与度最高） */}
                <div className={styles.section}>
                    <TopLiveMatches />
                </div>

                <section className={styles.section}>
                    <SectionHeader title="In Play" live />
                    <div className={styles.filterRow}>
                        <div className={styles.tabs}>
                            {['Football', 'Basketball', 'Tennis'].map((tab, index) => (
                                <button
                                    key={tab}
                                    type="button"
                                    className={cn(styles.tabButton, index === 0 && styles.tabActive)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                    {LIVE_MATCHES.map((match) => (
                        <LiveMatchRow key={match.id} match={match} />
                    ))}
                </section>

                {/* Tier 2 · 今日 / 即将开赛赛事（近场可下注） */}
                <section className={styles.section}>
                    <nav className={styles.trendTabs} aria-label="Event filters">
                        {TREND_TABS.map((tab, index) => (
                            <button
                                key={tab}
                                type="button"
                                className={cn(styles.trendTab, index === 0 && styles.trendTabActive)}
                            >
                                {tab}
                            </button>
                        ))}
                    </nav>
                    <SectionHeader title="Today at the World Cup" target="trend" onScroll={handleScroll} />
                    <HorizontalScroller id="trend" setScroller={setScroller}>
                        {TRENDING_EVENTS.map((event) => (
                            <TrendingEventCard key={event.id} event={event} />
                        ))}
                    </HorizontalScroller>
                </section>

                <section className={styles.section}>
                    <SectionHeader title="Upcoming Matches" />
                    <div className={styles.filterRow}>
                        <div className={styles.tabs}>
                            {['Today', 'Tomorrow', 'Week'].map((tab, index) => (
                                <button
                                    key={tab}
                                    type="button"
                                    className={cn(styles.tabButton, index === 0 && styles.tabActive)}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                    {UPCOMING_MATCHES.map((match) => (
                        <UpcomingRow key={match.id} match={match} />
                    ))}
                </section>

                {/* Tier 3 · 玩法卡（驱动高价值 / 高客单投注） */}
                <section className={styles.section}>
                    <SectionHeader title="Parlay Picks" target="parlay" onScroll={handleScroll} />
                    <HorizontalScroller id="parlay" setScroller={setScroller}>
                        {PARLAY_PICKS.map((pick) => (
                            <ParlayCard key={pick.id} item={pick} />
                        ))}
                    </HorizontalScroller>
                </section>

                <div className={styles.section}>
                    <ParlayBoost />
                </div>

                <div className={styles.section}>
                    <PlayerProps />
                </div>

                {/* 期货 & 异业交叉销售：按需求上移至 Smart Activity Cards（Cards da Copa em destaque）之前 */}
                <section className={styles.section}>
                    <SectionHeader title="Who will win the World Cup?" target="outrights" onScroll={handleScroll} />
                    <HorizontalScroller id="outrights" setScroller={setScroller}>
                        {OUTRIGHTS.map((item) => (
                            <OutrightCard key={item.id} item={item} />
                        ))}
                    </HorizontalScroller>
                </section>

                {fanGames?.games?.length ? (
                    <section className={styles.section}>
                        <SectionHeader
                            title="World Cup Fan Games"
                            moreHref={`/casino/${fanGames.lobby.id}?tag_id=${fanGames.tag.id}`}
                        />
                        <HorizontalScroller id="popular" className={styles.popularRow} setScroller={setScroller}>
                            {fanGames.games.map((game) => (
                                <CasinoGameTile key={game.id} game={game} lobbyId={fanGames.lobby.id} />
                            ))}
                        </HorizontalScroller>
                    </section>
                ) : null}

                {/* Smart Activity Cards（Cards da Copa em destaque）置于上述两块之后 */}
                <div className={styles.section}>
                    <SmartActivityCards />
                </div>
            </div>
        </div>
    );
};
