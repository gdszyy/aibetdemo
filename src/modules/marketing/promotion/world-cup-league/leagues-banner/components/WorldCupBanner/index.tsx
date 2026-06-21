'use client';

import Image from 'next/image';
import { useLocale, useTranslations } from 'next-intl';
import type { FunctionComponent } from 'react';
import { Link } from '@/i18n';
import { WORLD_CUP_LEAGUE_ID } from '@/modules/marketing/promotion/world-cup-league/constants';
import { cn } from '@/utils/common';
import WorldCupMenuBg from './assets/banner-bg.png';
// import WorldCupMenuIcon from './assets/world-cup-banner.png';
import WorldCupMenuCollapsedIcon from './assets/world-cup-banner-collapsed.png';

export const WorldCupSidebarBanner: FunctionComponent<{
    collapsed?: boolean;
    className?: string;
}> = ({ collapsed = false, className }) => {
    const t = useTranslations('promotionWorldCupLeague');
    const locale = useLocale();

    return (
        <div className={cn('relative shrink-0 flex-1 items-center')}>
            <Link className={cn('flex shrink-0 items-center pt-1')} href={`/leagues/${WORLD_CUP_LEAGUE_ID}`}>
                {!collapsed && (
                    <div
                        className="w-full rounded-full text-center min-h-12 flex items-center justify-center"
                        style={{
                            backgroundImage: `url(${WorldCupMenuBg.src})`,
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: 'cover',
                        }}
                    >
                        <p
                            className={cn(
                                'text-sm font-bold font-poppins text-neutral-white-h leading-12',
                                locale !== 'en' && 'text-xs',
                            )}
                        >
                            {t('worldCupCountdown.title')}
                        </p>
                    </div>
                )}
                {collapsed && (
                    <Image
                        src={WorldCupMenuCollapsedIcon}
                        alt="menu-world-cup"
                        quality={100}
                        className={cn('w-full h-auto shrink-0', collapsed && 'w-12', className)}
                    />
                )}
            </Link>
        </div>
    );
};
