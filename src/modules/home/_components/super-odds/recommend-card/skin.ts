import type { CSSProperties } from 'react';
import type { SchemeBrand, SchemeMode } from '@/components/theme-provider/scheme-meta';

export type RecommendCardSkin = SchemeBrand;

interface RecommendSectionSkin {
    rootClassName: string;
    titleClassName: string;
    titleAccentClassName: string;
    showLightning: boolean;
    cardClassName: string;
    cardTitleClassName: string;
    dividerStyle: CSSProperties;
    badgeClassName: string;
    badgeTextClassName: string;
    selectionTitleClassName: string;
    selectionMetaClassName: string;
    footerButtonClassName: string;
    footerInnerClassName: string;
    footerIconClassName: string;
    footerOddsClassName: string;
}

export const getRecommendCardSkin = (brand: SchemeBrand): RecommendCardSkin => {
    return brand;
};

export const getRecommendSectionSkin = (skin: RecommendCardSkin, mode: SchemeMode): RecommendSectionSkin => {
    if (skin === 'betano') {
        const isLight = mode === 'light';

        return {
            rootClassName: isLight
                ? 'rounded-md border border-[#dfe4ec] bg-[#ffffff] px-3 pt-4 shadow-[0_14px_28px_-24px_rgba(17,27,52,0.22)]'
                : 'rounded-md border border-[#2a2d46] bg-[#0e0f22] px-3 pt-4 shadow-[0_18px_36px_-28px_rgba(14,15,34,0.8)]',
            titleClassName: isLight ? 'text-[#111b34]' : 'text-[#ff6a33]',
            titleAccentClassName: 'bg-[#ff3d00]',
            showLightning: false,
            cardClassName: isLight
                ? 'rounded-md border border-[#dfe4ec] bg-[#f7f9fb] shadow-[0_10px_22px_-20px_rgba(17,27,52,0.2)]'
                : 'rounded-md border border-[#2b304d] bg-[#181a2f] shadow-[0_12px_26px_-22px_rgba(0,0,0,0.9)]',
            cardTitleClassName: isLight ? 'text-[#111b34]' : 'text-[#f4f6fb]',
            dividerStyle: {
                background: isLight
                    ? 'linear-gradient(90deg, rgba(255, 61, 0, 0) 0%, rgba(255, 61, 0, 0.36) 50%, rgba(255, 61, 0, 0) 100%)'
                    : 'linear-gradient(90deg, rgba(255, 61, 0, 0) 0%, rgba(255, 61, 0, 0.7) 50%, rgba(255, 61, 0, 0) 100%)',
            },
            badgeClassName: isLight
                ? 'rounded-full bg-[#ff3d00] px-2.5 py-1 text-[#ffffff]'
                : 'rounded-full bg-[#ff3d00] px-2.5 py-1 text-[#0e0f22]',
            badgeTextClassName: 'text-auxiliary-xxs font-black uppercase leading-none',
            selectionTitleClassName: isLight ? 'text-[#111b34]' : 'text-[#f4f6fb]',
            selectionMetaClassName: isLight ? 'text-[#5b647e]' : 'text-[#b1b8cf]',
            footerButtonClassName: isLight
                ? 'rounded-sm border-[#00a067] bg-[#00a067]'
                : 'rounded-sm border-[#31d893] bg-[#31d893]',
            footerInnerClassName: isLight
                ? 'rounded-[6px] bg-[#00a067] group-hover/betBtn:bg-[#008f5c]'
                : 'rounded-[6px] bg-[#31d893] group-hover/betBtn:bg-[#42e5a3]',
            footerIconClassName: isLight ? 'bg-[#ffffff] text-[#00a067]' : 'bg-[#071040] text-[#31d893]',
            footerOddsClassName: isLight ? 'text-[#ffffff]' : 'text-[#071040]',
        };
    }

    if (skin === 'match') {
        const isLight = mode === 'light';

        return {
            rootClassName: isLight
                ? 'rounded-sm border border-[#d8e2dd] bg-[#ffffff] px-3 pt-4 shadow-[0_14px_28px_-24px_rgba(16,37,28,0.22)]'
                : 'rounded-sm border border-[#313131] bg-[#161616] px-3 pt-4 shadow-[0_18px_30px_-24px_rgba(0,0,0,0.82)]',
            titleClassName: isLight ? 'text-[#17251f]' : 'text-[#f2f2f2]',
            titleAccentClassName: isLight ? 'bg-[#169c63]' : 'bg-[#26c07a]',
            showLightning: false,
            cardClassName: isLight
                ? 'rounded-sm border border-[#d8e2dd] bg-[#f8fbf9]'
                : 'rounded-sm border border-[#313131] bg-[#1e1e1e]',
            cardTitleClassName: isLight ? 'text-[#17251f]' : 'text-[#f2f2f2]',
            dividerStyle: {
                background: isLight
                    ? 'linear-gradient(90deg, rgba(22, 156, 99, 0) 0%, rgba(22, 156, 99, 0.35) 50%, rgba(22, 156, 99, 0) 100%)'
                    : 'linear-gradient(90deg, rgba(38, 192, 122, 0) 0%, rgba(38, 192, 122, 0.45) 50%, rgba(38, 192, 122, 0) 100%)',
            },
            badgeClassName: isLight
                ? 'rounded-xs border border-[#169c63] bg-[#dff3ea] px-2 py-1 text-[#0f7f50]'
                : 'rounded-xs border border-[#26c07a] bg-[#123024] px-2 py-1 text-[#33d488]',
            badgeTextClassName: 'text-auxiliary-xxs font-bold uppercase leading-none',
            selectionTitleClassName: isLight ? 'text-[#17251f]' : 'text-[#f2f2f2]',
            selectionMetaClassName: isLight ? 'text-[#5e7068]' : 'text-[#a6a6a6]',
            footerButtonClassName: isLight
                ? 'rounded-sm border-[#169c63] bg-[#dff3ea]'
                : 'rounded-sm border-[#26c07a] bg-[#123024]',
            footerInnerClassName: isLight
                ? 'rounded-[6px] bg-[#ffffff] group-hover/betBtn:bg-[#ecf5f0]'
                : 'rounded-[6px] bg-[#1e1e1e] group-hover/betBtn:bg-[#242424]',
            footerIconClassName: isLight ? 'bg-[#169c63] text-[#ffffff]' : 'bg-[#26c07a] text-[#07130d]',
            footerOddsClassName: isLight ? 'text-[#0f7f50]' : 'text-[#33d488]',
        };
    }

    if (skin === 'betbus') {
        const isLight = mode === 'light';

        return {
            rootClassName: isLight
                ? 'rounded-sm border border-[#d8e2dd] bg-[#ffffff] px-3 pt-4 shadow-[0_14px_28px_-24px_rgba(16,37,28,0.22)]'
                : 'rounded-sm border border-[#2f2f2f] bg-[#121212] px-3 pt-4 shadow-[0_18px_30px_-24px_rgba(0,0,0,0.85)]',
            titleClassName: isLight ? 'text-[#17251f]' : 'text-[#f2f2f2]',
            titleAccentClassName: isLight ? 'bg-[#169c63]' : 'bg-[#fa434e]',
            showLightning: false,
            cardClassName: isLight
                ? 'rounded-sm border border-[#d8e2dd] bg-[#f8fbf9]'
                : 'rounded-sm border border-[#313131] bg-[#1e1e1e]',
            cardTitleClassName: isLight ? 'text-[#17251f]' : 'text-[#f2f2f2]',
            dividerStyle: {
                background: isLight
                    ? 'linear-gradient(90deg, rgba(22, 156, 99, 0) 0%, rgba(22, 156, 99, 0.35) 50%, rgba(22, 156, 99, 0) 100%)'
                    : 'linear-gradient(90deg, rgba(250, 67, 78, 0) 0%, rgba(250, 67, 78, 0.45) 50%, rgba(250, 67, 78, 0) 100%)',
            },
            badgeClassName: isLight
                ? 'rounded-xs border border-[#169c63] bg-[#dff3ea] px-2 py-1 text-[#0f7f50]'
                : 'rounded-xs border border-[#fa434e] bg-[#321016] px-2 py-1 text-[#fa434e]',
            badgeTextClassName: 'text-auxiliary-xxs font-bold uppercase leading-none',
            selectionTitleClassName: isLight ? 'text-[#17251f]' : 'text-[#f2f2f2]',
            selectionMetaClassName: isLight ? 'text-[#5e7068]' : 'text-[#a6a6a6]',
            footerButtonClassName: isLight
                ? 'rounded-sm border-[#169c63] bg-[#dff3ea]'
                : 'rounded-sm border-[#444444] bg-[#252525]',
            footerInnerClassName: isLight
                ? 'rounded-[6px] bg-[#ffffff] group-hover/betBtn:bg-[#ecf5f0]'
                : 'rounded-[6px] bg-[#121212] group-hover/betBtn:bg-[#2f2f2f]',
            footerIconClassName: isLight ? 'bg-[#169c63] text-[#ffffff]' : 'bg-[#fa434e] text-[#ffffff]',
            footerOddsClassName: isLight ? 'text-[#0f7f50]' : 'text-[#f2f2f2]',
        };
    }

    return {
        rootClassName: 'rounded-md px-3 pt-4',
        titleClassName: 'text-neutral-black-h',
        titleAccentClassName: 'bg-neutral-black-h',
        showLightning: true,
        cardClassName: 'rounded-sm bg-surface-1',
        cardTitleClassName: 'text-filltext-ft-h',
        dividerStyle: {
            background:
                'linear-gradient(90deg, rgba(226, 229, 234, 0.00) 0%, var(--filltext-ft-c, #E2E5EA) 50%, rgba(226, 229, 234, 0.00) 100%)',
        },
        badgeClassName: '',
        badgeTextClassName: '',
        selectionTitleClassName: 'text-filltext-ft-h',
        selectionMetaClassName: 'text-filltext-ft-g',
        footerButtonClassName: 'rounded-xs border-filltext-ft-c bg-filltext-ft-c',
        footerInnerClassName: 'rounded-xs bg-filltext-ft-a group-hover/betBtn:bg-filltext-ft-b',
        footerIconClassName: '',
        footerOddsClassName: 'text-filltext-ft-g',
    };
};
