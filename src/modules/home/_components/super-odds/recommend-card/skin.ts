import type { CSSProperties } from 'react';
import type { SchemeBrand, SchemeMode } from '@/components/theme-provider/scheme-meta';

export type RecommendCardSkin = SchemeBrand;

interface RecommendSectionSkin {
    rootClassName: string;
    rootStyle?: CSSProperties;
    titleClassName: string;
    titleAccentClassName: string;
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

const getNonSuperbetSuperOddCardClassName = (isLight: boolean): string =>
    isLight
        ? 'relative rounded-sm border border-[#f3c3c8] bg-[#fff5f6] shadow-[0_10px_22px_-20px_rgba(230,0,18,0.26)]'
        : 'relative rounded-sm border border-[#5a2028] bg-[#201116] shadow-[0_12px_26px_-22px_rgba(0,0,0,0.9)]';

export const getRecommendSectionSkin = (skin: RecommendCardSkin, mode: SchemeMode): RecommendSectionSkin => {
    if (skin === 'superbet') {
        // Superbet 品牌色：选中/CTA 红 #c21e1c，中性深底 #181a1b（与 brand-ui-skin 的
        // --brand-odds-selected-bg / --brand-match-card-bg 对齐），不再使用偏亮的 #ff1f32 与酒红底。
        const isLight = mode === 'light';
        const superOddCardClassName = isLight
            ? 'relative rounded-md border border-[#f0c2c4] bg-[#fffafa] shadow-[0_18px_34px_-26px_rgba(194,30,28,0.34)]'
            : 'relative rounded-md border border-[#2b2f31] bg-[#181a1b] shadow-[0_18px_34px_-24px_rgba(0,0,0,0.84)]';

        return {
            rootClassName: isLight
                ? 'rounded-md border border-[#e6dcdd] px-3 pt-4 shadow-[0_18px_36px_-30px_rgba(194,30,28,0.22)]'
                : 'rounded-md border border-[#23262a] px-3 pt-4 shadow-[0_18px_36px_-26px_rgba(0,0,0,0.86)]',
            rootStyle: {
                background: isLight
                    ? 'linear-gradient(180deg, #fbe3e3 0%, #fffafa 42%, rgba(255, 255, 255, 0) 90%)'
                    : 'linear-gradient(180deg, rgba(194, 30, 28, 0.22) 0%, #14171a 48%, rgba(7, 8, 12, 0) 92%)',
            },
            titleClassName: isLight ? 'text-[#151923]' : 'text-[#f4f6f9]',
            titleAccentClassName: 'bg-[#c21e1c]',
            cardClassName: superOddCardClassName,
            cardTitleClassName: isLight ? 'text-[#c21e1c]' : 'text-[#ffffff]',
            dividerStyle: {
                background:
                    'linear-gradient(90deg, rgba(194, 30, 28, 0) 0%, rgba(194, 30, 28, 0.65) 50%, rgba(194, 30, 28, 0) 100%)',
            },
            badgeClassName: 'rounded-full bg-[#181a1b] px-2.5 py-1 text-[#ffffff] shadow-[0_0_0_1px_rgba(194,30,28,0.55)]',
            badgeTextClassName: 'text-auxiliary-xxs font-black uppercase leading-none',
            selectionTitleClassName: isLight ? 'text-[#151923]' : 'text-[#f4f6f9]',
            selectionMetaClassName: isLight ? 'text-[#5c6879]' : 'text-[#b3bac6]',
            footerButtonClassName: 'rounded-sm border-[#c21e1c] bg-[#c21e1c]',
            footerInnerClassName: 'rounded-[6px] bg-[#c21e1c] group-hover/betBtn:bg-[#d2302d]',
            footerIconClassName: 'bg-[#ffffff] text-[#c21e1c]',
            footerOddsClassName: 'text-[#ffffff]',
        };
    }

    if (skin === 'betano') {
        const isLight = mode === 'light';
        const cardClassName = isLight
            ? 'relative rounded-md border border-[#dfe4ec] bg-[#ffffff] shadow-none'
            : 'relative rounded-md border border-[#2a2d46] bg-[#0e0f22] shadow-none';

        return {
            rootClassName: isLight
                ? 'rounded-md border border-[#dfe4ec] bg-[#ffffff] px-3 pt-4 shadow-none'
                : 'rounded-md border border-[#2a2d46] bg-[#0e0f22] px-3 pt-4 shadow-none',
            titleClassName: isLight ? 'text-[#111b34]' : 'text-[#ff6a33]',
            titleAccentClassName: 'bg-[#ff3d00]',
            cardClassName,
            cardTitleClassName: isLight ? 'text-[#111b34]' : 'text-[#f4f6fb]',
            dividerStyle: {
                background: isLight ? '#e2e7f1' : '#2a2d46',
            },
            badgeClassName: 'rounded bg-[#ff3d00] px-2.5 py-1 text-[#ffffff]',
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
            cardClassName: getNonSuperbetSuperOddCardClassName(isLight),
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
            cardClassName: getNonSuperbetSuperOddCardClassName(isLight),
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
        cardClassName: getNonSuperbetSuperOddCardClassName(true),
        cardTitleClassName: 'text-filltext-ft-h',
        dividerStyle: {
            background:
                'linear-gradient(90deg, rgba(226, 229, 234, 0.00) 0%, var(--filltext-ft-c, #E2E5EA) 50%, rgba(226, 229, 234, 0.00) 100%)',
        },
        badgeClassName: 'rounded-full bg-[#121318] px-2.5 py-1 text-[#ffffff]',
        badgeTextClassName: 'text-auxiliary-xxs font-black uppercase leading-none',
        selectionTitleClassName: 'text-filltext-ft-h',
        selectionMetaClassName: 'text-filltext-ft-g',
        footerButtonClassName: 'rounded-xs border-filltext-ft-c bg-filltext-ft-c',
        footerInnerClassName: 'rounded-xs bg-filltext-ft-a group-hover/betBtn:bg-filltext-ft-b',
        footerIconClassName: '',
        footerOddsClassName: 'text-filltext-ft-g',
    };
};
