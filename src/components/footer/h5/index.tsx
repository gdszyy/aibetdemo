'use client';

import type { FunctionComponent } from 'react';
import { cn } from '@/utils/common';
import { Copyright } from '../components/copyright';
import { ExternalLink } from '../components/external-link';
import { Jurisdiction } from '../components/jurisdiction';
import { License } from '../components/license';
import { Logo } from '../components/logo';
import { SiteMap } from '../components/sitemap';

export const H5: FunctionComponent = () => {
    return (
        <footer className={cn('w-full bg-surface-1 border-t border-filltext-ft-c pt-6 pb-8 px-4')}>
            <div className="flex flex-col">
                <Logo />
                <div className="h-2" />
                <License />
                <Jurisdiction />
                <SiteMap />
                <ExternalLink />
                <Copyright />
            </div>
        </footer>
    );
};
