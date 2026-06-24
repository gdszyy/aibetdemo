import type { StaticImageData } from 'next/image';
import type { RecommendCardSelection } from '@/api/models/recommend-card';

export type ActivityVisualVariant = 'poster' | 'ticket' | 'offer' | 'sheet' | 'crest' | 'mission';

export interface ActivityStyleItem {
    id: string;
    eyebrow: string;
    title: string;
    description: string;
    metric: string;
    action: string;
    variant: ActivityVisualVariant;
    visualImage?: StaticImageData;
    visualPosition?: string;
}

export type QuickBetKind = 'single' | 'parlay' | 'outright';

export interface QuickBetItem {
    id: string;
    kind: QuickBetKind;
    badge: string;
    title: string;
    subtitle: string;
    marketLabel: string;
    outcomeLabel: string;
    odds: number;
    defaultStake: number;
    selections: RecommendCardSelection[];
}

export interface FollowBetProfile {
    id: string;
    name: string;
    tag: string;
    pickTitle: string;
    pickMeta: string;
    winRate: string;
    roi: string;
    followers: string;
    streak: string;
    selections: RecommendCardSelection[];
}

export interface PopularBetProfile {
    id: string;
    league: string;
    bettorName: string;
    stake: string;
    popularity: string;
    period: string;
    minute: string;
    home: { name: string; score: number };
    away: { name: string; score: number };
    selection: string;
    odds: string;
    href: string;
}

export type LeaderboardTrend = 'up' | 'stable' | 'new';

export interface LeaderboardRow {
    rank: number;
    name: string;
    amount: number;
    prize: string;
    trend: LeaderboardTrend;
    isCurrentUser?: boolean;
}
