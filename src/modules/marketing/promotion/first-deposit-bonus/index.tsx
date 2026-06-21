'use client';

import type { FunctionComponent } from 'react';
import { ClientOnly } from '@/components/client-only';
import { PromotionBackButton } from '../_components/promotion-back-button';
import { BonusDetailsSection } from './_components/bonus-details-section';
import { HeroSection } from './_components/hero-section';
import { HowItWorksSection } from './_components/how-it-works-section';
import { PageStore } from './_components/page-store';
import { PromoCodesSection } from './_components/promo-codes-section';
import { ResponsibleGamingSection } from './_components/responsible-gaming-section';
import { TermsSection } from './_components/terms-section';

export const PromotionView: FunctionComponent = () => {
    return (
        <ClientOnly>
            <div className="relative flex flex-col items-center w-full overflow-x-hidden">
                <PageStore>
                    <PromotionBackButton />
                    <HeroSection />
                    <PromoCodesSection />
                    <BonusDetailsSection />
                    <HowItWorksSection />
                    <TermsSection />
                    <ResponsibleGamingSection />
                </PageStore>
            </div>
        </ClientOnly>
    );
};
