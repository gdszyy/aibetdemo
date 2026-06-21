'use client';

import { useMemo } from 'react';
import { type Scheme, useTheme } from '@/components/theme-provider/theme-provider';

export type SchemeBrand = 'superbet' | 'betano' | 'betbus' | 'match';
export type SchemeMode = 'light' | 'dark';

export interface SchemeMeta {
    scheme: Scheme;
    brand: SchemeBrand;
    mode: SchemeMode;
}

const DEFAULT_SCHEME_META: SchemeMeta = {
    scheme: 'betbus',
    brand: 'betbus',
    mode: 'dark',
};

const SCHEME_META: Record<Scheme, SchemeMeta> = {
    gtb: {
        scheme: 'gtb',
        brand: 'superbet',
        mode: 'light',
    },
    betbus: {
        scheme: 'betbus',
        brand: 'betbus',
        mode: 'dark',
    },
    match: {
        scheme: 'match',
        brand: 'match',
        mode: 'dark',
    },
    'match-light': {
        scheme: 'match-light',
        brand: 'match',
        mode: 'light',
    },
    'superbet-light': {
        scheme: 'superbet-light',
        brand: 'superbet',
        mode: 'light',
    },
    'superbet-dark': {
        scheme: 'superbet-dark',
        brand: 'superbet',
        mode: 'dark',
    },
    'betano-light': {
        scheme: 'betano-light',
        brand: 'betano',
        mode: 'light',
    },
    'betano-dark': {
        scheme: 'betano-dark',
        brand: 'betano',
        mode: 'dark',
    },
};

export const getSchemeMeta = (scheme: string | undefined): SchemeMeta => {
    return SCHEME_META[scheme as Scheme] ?? DEFAULT_SCHEME_META;
};

export const useSchemeMeta = (): SchemeMeta => {
    const { theme } = useTheme();

    return useMemo(() => getSchemeMeta(theme), [theme]);
};
