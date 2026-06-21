'use client';

import type { FC } from 'react';
import { useBreadcrumb } from '@/modules/match/_hooks/use-breadcrumb';
import { cn } from '@/utils/common';

type BreadcrumbTitleProps = {
    sportId?: string;
    tournamentId?: string;
    matchId?: string;
    className?: string;
    /** 覆盖接口返回的标题。 */
    titleOverride?: string;
};

/** 体育页面顶部标题。 */
export const BreadcrumbTitle: FC<BreadcrumbTitleProps> = ({
    sportId,
    tournamentId,
    matchId,
    className,
    titleOverride,
}) => {
    const { data } = useBreadcrumb({ sportId, tournamentId, matchId });
    const title = titleOverride ?? data?.sport_name;

    if (!title) {
        return null;
    }

    return <div className={cn('mb-2 text-headline-lg text-brand-primary-4 text-left', className)}>{title}</div>;
};
