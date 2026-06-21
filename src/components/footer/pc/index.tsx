'use client';

import type { FunctionComponent } from 'react';
import { cn } from '@/utils/common';
import { Copyright } from '../components/copyright';
import { ExternalLink } from '../components/external-link';
import { Jurisdiction } from '../components/jurisdiction';
import { License } from '../components/license';
import { Logo } from '../components/logo';
import { SiteMap } from '../components/sitemap';

export const PC: FunctionComponent = () => {
    return (
        <footer className={cn('w-full bg-surface-1 border-t border-filltext-ft-c flex-1 pb-8 md:pb-25')}>
            <div className="mx-auto w-full max-w-[var(--main-content-max-width,1200px)] flex flex-col gap-12 px-6 pt-6">
                <div className="flex flex-col">
                    <Logo />
                    <div className="flex flex-row gap-10">
                        <License />
                        <Jurisdiction />
                    </div>
                </div>
                <div className="h-px w-full bg-filltext-ft-c" />
                <SiteMap />
                <div className="h-px w-full bg-filltext-ft-c" />
                <ExternalLink />
                <div className="h-px w-full bg-filltext-ft-c" />
                <Copyright />
            </div>
        </footer>
    );
};
