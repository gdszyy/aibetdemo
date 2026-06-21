/** Supported region codes (ISO 3166-1 alpha-2) */
export type RegionCode = 'BR' | 'MX';

export interface RegionConfig {
    /** Region code */
    code: RegionCode;
    /** Phone country code (without +) */
    phoneCode: string;
    /** Phone number validation regex (without country code), null = skip validation */
    phonePattern: RegExp | null;
    /** Phone number placeholder example */
    phonePlaceholder: string;
    /** Identity document type identifier */
    idType: 'CPF' | 'RFC';
    /** Identity document display label (for UI) */
    idLabel: string;
    /** Identity document placeholder */
    idPlaceholder: string;
    /** Identity document basic format validation regex */
    idPattern: RegExp;
    /** Identity document checksum verify function (null = regex-only) */
    idVerify: ((value: string) => boolean) | null;
    /** Branch number validation regex */
    branchNoPattern: RegExp;
    /** Bank account number validation regex */
    accountNoPattern: RegExp;
    /** Default currency ISO 4217 */
    defaultCurrency: string;
}
