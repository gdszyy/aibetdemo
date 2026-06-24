'use client';

import { useMemo } from 'react';
import { type Scheme, useTheme } from '@/components/theme-provider/theme-provider';

export type SchemeBrand = 'superbet' | 'betano' | 'betbus' | 'match' | 'glass' | 'cis';
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
        brand: 'betbus',
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
    'match-mint': {
        scheme: 'match-mint',
        brand: 'match',
        mode: 'dark',
    },
    'match-bright': {
        scheme: 'match-bright',
        brand: 'match',
        mode: 'dark',
    },
    'match-red': {
        scheme: 'match-red',
        brand: 'match',
        mode: 'dark',
    },
    'match-navy-red': {
        scheme: 'match-navy-red',
        brand: 'match',
        mode: 'dark',
    },
    'match-navy-yellow': {
        scheme: 'match-navy-yellow',
        brand: 'match',
        mode: 'dark',
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
    'glass-light': {
        scheme: 'glass-light',
        brand: 'glass',
        mode: 'light',
    },
    'glass-dark': {
        scheme: 'glass-dark',
        brand: 'glass',
        mode: 'dark',
    },
    'glass-brasil-light': {
        scheme: 'glass-brasil-light',
        brand: 'glass',
        mode: 'light',
    },
    'glass-brasil-dark': {
        scheme: 'glass-brasil-dark',
        brand: 'glass',
        mode: 'dark',
    },
    'glass-mexico-light': {
        scheme: 'glass-mexico-light',
        brand: 'glass',
        mode: 'light',
    },
    'glass-mexico-dark': {
        scheme: 'glass-mexico-dark',
        brand: 'glass',
        mode: 'dark',
    },
    'glass-azul-light': {
        scheme: 'glass-azul-light',
        brand: 'glass',
        mode: 'light',
    },
    'glass-azul-dark': {
        scheme: 'glass-azul-dark',
        brand: 'glass',
        mode: 'dark',
    },
    'glass-roxo-light': {
        scheme: 'glass-roxo-light',
        brand: 'glass',
        mode: 'light',
    },
    'glass-roxo-dark': {
        scheme: 'glass-roxo-dark',
        brand: 'glass',
        mode: 'dark',
    },
    'cis-light': {
        scheme: 'cis-light',
        brand: 'cis',
        mode: 'light',
    },
};

export const getSchemeMeta = (scheme: string | undefined): SchemeMeta => {
    return SCHEME_META[scheme as Scheme] ?? DEFAULT_SCHEME_META;
};

export const useSchemeMeta = (): SchemeMeta => {
    const { theme } = useTheme();

    return useMemo(() => getSchemeMeta(theme), [theme]);
};
