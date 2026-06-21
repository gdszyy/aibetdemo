import type { StaticImageData } from 'next/image';
import type { TranslationKey } from '@/i18nV2/types';
import { PromoCardPromo1Bg, PromoCardPromo1Fg } from '../_images';
import { CHAMPION_HANDICAP_PROMOTION_CARD_IMAGE } from '../champion-handicap/_constants/data';

export type PromotionStatus = 'active' | 'upcoming' | 'ended';
export type PromotionCategory = 'sports' | 'casino' | 'all';

// TODO 等运营位需求完成后，删除整个原来的promotion逻辑

export interface PromotionItem {
    id: string;
    titleKey: TranslationKey<'promotion'>;
    descriptionKey: TranslationKey<'promotion'>;
    backgroundImage: string | StaticImageData;
    foregroundImage: string | StaticImageData;
    status?: PromotionStatus;
    priority: number;
    startDate?: string;
    endDate?: string;
    category: PromotionCategory;
    slug: string;
}

const STATUS_ORDER: Record<PromotionStatus, number> = { active: 0, upcoming: 1, ended: 2 };

const getStatusOrder = (status?: PromotionStatus): number => (status ? STATUS_ORDER[status] : Number.MAX_SAFE_INTEGER);

const getStartTime = (startDate?: string): number => {
    if (!startDate) return 0;
    const timestamp = new Date(startDate).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
};

export function sortPromotions(list: PromotionItem[]): PromotionItem[] {
    return [...list].sort((a, b) => {
        if (getStatusOrder(a.status) !== getStatusOrder(b.status)) {
            return getStatusOrder(a.status) - getStatusOrder(b.status);
        }
        if (a.priority !== b.priority) return b.priority - a.priority;
        return getStartTime(b.startDate) - getStartTime(a.startDate);
    });
}

export const FIRST_DEPOSIT_PROMOTION: PromotionItem = {
    id: 'first-deposit-bonus',
    titleKey: 'list.cards.firstDeposit.title',
    descriptionKey: 'list.cards.firstDeposit.description',
    backgroundImage: PromoCardPromo1Bg,
    foregroundImage: PromoCardPromo1Fg,
    priority: 100,
    category: 'all',
    slug: 'first-deposit-bonus',
};
// mock
export const CHAMPION_HANDICAP_PROMOTION: PromotionItem = {
    id: 'champion-handicap',
    titleKey: 'list.cards.championHandicap.title',
    descriptionKey: 'list.cards.championHandicap.description',
    backgroundImage: CHAMPION_HANDICAP_PROMOTION_CARD_IMAGE,
    foregroundImage: CHAMPION_HANDICAP_PROMOTION_CARD_IMAGE,
    priority: 90,
    category: 'all',
    slug: 'champion-handicap',
};

export function getPromotionsByCategory(category: 'sports' | 'casino'): PromotionItem[] {
    const cards = [FIRST_DEPOSIT_PROMOTION, CHAMPION_HANDICAP_PROMOTION];
    const filtered = cards.filter((promotion) => promotion.category === 'all' || promotion.category === category);
    return sortPromotions(filtered);
}
