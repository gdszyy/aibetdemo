import type { ReactNode } from 'react';

type FooterSiteMapColumnKey = 'sports' | 'casino' | 'legal' | 'support';

type FooterSiteMapItemKey =
    | 'sports-live'
    | 'sports-home'
    | 'sports-rules'
    | 'casino-home'
    | 'casino-slots'
    | 'casino-promotions'
    | 'legal-terms'
    | 'legal-privacy'
    | 'legal-aml-kyc'
    | 'legal-responsible-gaming'
    | 'support-faq'
    | 'support-contact-us'
    | 'support-deposit-withdrawal';

export interface FooterSiteMapColumnConfig {
    key: FooterSiteMapColumnKey;
    title: ReactNode;
    items: {
        key: FooterSiteMapItemKey;
        title: ReactNode;
        href?: string;
        onClick?: (payload: FooterSiteMapColumnConfig['items'][0]) => void;
    }[];
}
