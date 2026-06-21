'use client';
import type { FC } from 'react';
import { useAnalyticsTracker } from '@/hooks/use-analytics-tracker';
import { SportsPage } from './sports-page';

export const HomePage: FC = () => {
    // Track analytics
    useAnalyticsTracker();

    return <SportsPage type="hot" />;
};
