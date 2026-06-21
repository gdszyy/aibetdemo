'use client';

import Image from 'next/image';
import type { FunctionComponent } from 'react';
import { useIsMobile } from '@/hooks/use-media-query';
import { Link } from '@/i18n';
import { WORLD_CUP_LEAGUE_ID } from '@/modules/marketing/promotion/world-cup-league/constants';
import { cn } from '@/utils/common';
import WorldCupMenuIcon from './assets/menu-icon.png';
import WorldCupMenuIconH5 from './assets/menu-icon-h5.png';

export const WorldCupMenuItem: FunctionComponent<{
    className?: string;
}> = ({ className }) => {
    const isMobile = useIsMobile();

    return (
        <div className={cn('relative h-full shrink-0 inline-flex items-center')}>
            <Link
                className={cn('inline-flex h-full shrink-0 items-center pt-1')}
                href={`/leagues/${WORLD_CUP_LEAGUE_ID}`}
            >
                <Image
                    src={isMobile ? WorldCupMenuIconH5 : WorldCupMenuIcon}
                    alt=""
                    quality={100}
                    className={cn('w-12 h-auto shrink-0', 'max-md:w-10', className)}
                />
            </Link>
        </div>
    );
};
