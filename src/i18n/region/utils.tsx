import BR from 'country-flag-icons/react/3x2/BR';
import MX from 'country-flag-icons/react/3x2/MX';
import type { FC } from 'react';
import { DEFAULT_REGION, REGION_REGISTRY } from './constants';
import type { RegionCode, RegionConfig } from './types';

/** Country code → SVG flag component (tree-shaken, Windows-compatible) */
const FLAG_COMPONENTS: Record<string, typeof BR> = { BR, MX };

export const CountryFlag: FC<{ code: string; className?: string }> = ({ code, className }) => {
    const Flag = FLAG_COMPONENTS[code.toUpperCase()];
    return Flag ? <Flag className={className} /> : <span>{code}</span>;
};

/** Strip non-digit chars from phone input for validation / API calls */
export const normalizePhone = (value: string): string => value.trim().replace(/\D/g, '');

// ─── Lookup helpers ──────────────────────────────────────────

/** Get RegionConfig by RegionCode */
export const getRegionByCode = (code: RegionCode): RegionConfig =>
    REGION_REGISTRY[code] ?? REGION_REGISTRY[DEFAULT_REGION];

/**
 * Universal identity document verification
 * 1. Basic format via idPattern regex
 * 2. Checksum algorithm via idVerify (if available)
 */
export const verifyIdentityDocument = (value: string, config: RegionConfig): boolean => {
    const { idPattern, idVerify } = config;
    if (!idPattern.test(value)) return false;
    if (idVerify) return idVerify(value);
    return true;
};
