import { CPFVerify } from '@/utils/verifies';
import type { RegionCode, RegionConfig } from './types';

export const DEFAULT_REGION: RegionCode = 'BR';

export const REGION_REGISTRY: Record<RegionCode, RegionConfig> = {
    BR: {
        code: 'BR',
        phoneCode: '55',
        phonePattern: /^(?:[1-9]{2}9\d{8}|\d{5})$/, // BR mobile or 5-digit test number
        phonePlaceholder: '11987654321',
        idType: 'CPF',
        idLabel: 'CPF',
        idPlaceholder: '000.000.000-00',
        idPattern: /^\d{3}\.?\d{3}\.?\d{3}-?\d{2}$/, // 11 digits + optional separators
        idVerify: CPFVerify,
        branchNoPattern: /^\d{1,4}$/, // BR branch: 1-4 digits
        accountNoPattern: /^\d{1,9}-?\d{1}$/, // BR bank account: up to 10 digits with optional hyphen
        defaultCurrency: 'BRL',
    },
    MX: {
        code: 'MX',
        phoneCode: '52',
        phonePattern: /^(?:[1-9]\d{9}|\d{5})$/, // MX mobile or 5-digit test number
        phonePlaceholder: '5512345678',
        idType: 'RFC',
        idLabel: 'CURP',
        idPlaceholder: 'ABCD123456XX0',
        idPattern: /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[A-Z0-9][0-9]$/, // CURP
        idVerify: null, // RFC has no checksum algorithm
        branchNoPattern: /^\d{11}$/, // MX branch: exactly 11 digits
        accountNoPattern: /^\d{18}$/, // MX CLABE: exactly 18 digits
        defaultCurrency: 'MXN',
    },
};
