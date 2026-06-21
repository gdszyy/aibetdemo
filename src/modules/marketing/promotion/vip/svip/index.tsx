'use client';

import type { FC } from 'react';
import SVIPMobileBg from './assets/svip_mobile_bg.jpg';
import SVIPPcBg from './assets/svip_pc_bg.jpg';
import { ReturnLink } from './components/ReturnLink';
import { SVIPBenefitsSection } from './components/SVIPBenefitsSection';
import { SVIPCTA } from './components/SVIPCTA';
import { SVIPHero } from './components/SVIPHero';

export const SVIPPage: FC = () => {
    return (
        <main className="relative min-h-screen overflow-hidden p-2 pb-6 md:p-0 md:py-6">
            <div className="relative w-full bg-black rounded-lg overflow-hidden">
                <div
                    className="pointer-events-none absolute inset-0 bg-contain bg-top bg-no-repeat md:hidden"
                    style={{ backgroundImage: `url(${SVIPMobileBg.src})` }}
                />

                <div
                    className="pointer-events-none absolute inset-0 hidden bg-contain bg-top bg-no-repeat md:block"
                    style={{ backgroundImage: `url(${SVIPPcBg.src})` }}
                />

                <div className="relative z-10">
                    <div className="relative z-10 text-left pt-4 ml-4">
                        <ReturnLink />
                    </div>
                    <SVIPHero />
                    <SVIPBenefitsSection />
                    <SVIPCTA />
                </div>
            </div>
        </main>
    );
};
