import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import type { TranslationKey } from '@/i18nV2/types';
import { ChampionHandicapView } from '../champion-handicap';
import { PromotionView } from '../first-deposit-bonus';
import { LuckyBetCodeView } from '../lucky-bet-code';
import { ParlayBoostView } from '../parlay-boost';
import { PARLAY_BOOST_PROMOTION_SLUG } from '../parlay-boost/constants';
import { WorldCup2026PassView } from '../world-cup-2026-pass';

interface PromotionPageConfig {
    component: React.FC;
    titleKey: TranslationKey<'promotion'>;
    descriptionKey?: TranslationKey<'promotion'>;
}

const PROMOTION_PAGES: Record<string, PromotionPageConfig> = {
    'first-deposit-bonus': { component: PromotionView, titleKey: 'hero.title' },
    'world-cup-2026-pass': { component: WorldCup2026PassView, titleKey: 'hero.title' },
    'lucky-bet-code': { component: LuckyBetCodeView, titleKey: 'list.cards.luckyBetCode.title' },
    'champion-handicap': {
        component: ChampionHandicapView,
        titleKey: 'championHandicap.metadata.title',
        descriptionKey: 'championHandicap.metadata.description',
    },
    [PARLAY_BOOST_PROMOTION_SLUG]: {
        component: ParlayBoostView,
        titleKey: 'list.cards.parlayBoost.title',
    },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const t = await getTranslations('promotion');
    const page = PROMOTION_PAGES[slug];

    if (!page) {
        return { title: t('list.title') };
    }

    return {
        title: t(page.titleKey),
        description: page.descriptionKey ? t(page.descriptionKey, { teamName: '' }) : undefined,
    };
}

export default async function PromotionDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const page = PROMOTION_PAGES[slug];

    if (!page) {
        notFound();
    }

    const PageComponent = page.component;
    return <PageComponent />;
}
