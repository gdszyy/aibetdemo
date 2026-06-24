import type { CSSProperties } from 'react';
import type { SchemeBrand, SchemeMode } from '@/components/theme-provider/scheme-meta';
import type { BoostMotifKind } from './boost-motif';

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
    /** SuperOdd 角标处「加成」造型（替换 Superbet 原生小闪电），按品牌主题切换。 */
    boostMotif: BoostMotifKind;
    /** 「加成」造型的颜色/尺寸类名（通过 text-[color] 驱动 currentColor）。 */
    boostMotifClassName: string;
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
        // Superbet 官网真实「SUPER ODDS」模块为金色（2026-06 实测覆盖）：
        // 模块头部金→近黑渐变 linear-gradient(180deg,#9d7624 0%,#7e5e20 32%,#070708 84%)，
        // 标题白色斜体，「SUPER BOOST」角标为金字 #f8be2c + 金色 20% 透明胶囊（radius 1000px），
        // 卡面中性深底 #181a1b（radius 10px）。此前误调研成 #c21e1c 红，本次按官网实测金色覆盖。
        const isLight = mode === 'light';
        const superOddCardClassName = isLight
            ? 'relative rounded-[10px] border border-[#efe0bb] bg-[#fffdf7] shadow-[0_18px_34px_-26px_rgba(157,118,36,0.34)]'
            : 'relative rounded-[10px] border border-[#2b2f31] bg-[#181a1b] shadow-[0_18px_34px_-24px_rgba(0,0,0,0.84)]';

        return {
            rootClassName: isLight
                ? 'rounded-md border border-[#ecdcb4] px-3 pt-4 shadow-[0_18px_36px_-30px_rgba(157,118,36,0.26)]'
                : 'rounded-md border border-[#3a3320] px-3 pt-4 shadow-[0_18px_36px_-26px_rgba(0,0,0,0.86)]',
            rootStyle: {
                background: isLight
                    ? 'linear-gradient(180deg, #f7e6bb 0%, #fdf6e6 42%, rgba(255, 255, 255, 0) 90%)'
                    : 'linear-gradient(180deg, #9d7624 0%, #7e5e20 32%, #070708 84%)',
            },
            titleClassName: isLight ? 'text-[#3a2c0a]' : 'text-[#ffffff]',
            titleAccentClassName: isLight ? 'bg-[#c8920c]' : 'bg-[#f8be2c]',
            cardClassName: superOddCardClassName,
            cardTitleClassName: isLight ? 'text-[#8a6308]' : 'text-[#ffffff]',
            dividerStyle: {
                background:
                    'linear-gradient(90deg, rgba(248, 190, 44, 0) 0%, rgba(248, 190, 44, 0.6) 50%, rgba(248, 190, 44, 0) 100%)',
            },
            badgeClassName: isLight
                ? 'rounded-full bg-[#fbeec2] px-2 py-0.5 text-[#a9760a]'
                : 'rounded-full bg-[rgba(248,190,44,0.2)] px-2 py-0.5 text-[#f8be2c]',
            badgeTextClassName: 'text-auxiliary-xxs font-black uppercase italic leading-none',
            selectionTitleClassName: isLight ? 'text-[#151923]' : 'text-[#f4f6f9]',
            selectionMetaClassName: isLight ? 'text-[#5c6879]' : 'text-[#b3bac6]',
            footerButtonClassName: isLight ? 'rounded-sm border-[#e9ad17] bg-[#e9ad17]' : 'rounded-sm border-[#f8be2c] bg-[#f8be2c]',
            footerInnerClassName: isLight
                ? 'rounded-[6px] bg-[#e9ad17] group-hover/betBtn:bg-[#f5bd2a]'
                : 'rounded-[6px] bg-[#f8be2c] group-hover/betBtn:bg-[#ffce3a]',
            footerIconClassName: 'bg-[#181a1b] text-[#f8be2c]',
            footerOddsClassName: 'text-[#181a1b]',
            // superbet 保留官网原生「小闪电」造型（金色），其余品牌用各自主题造型。
            boostMotif: 'bolt',
            boostMotifClassName: isLight ? 'text-[#c8920c]' : 'text-[#f8be2c]',
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
            boostMotif: 'boost',
            boostMotifClassName: 'text-[#ffffff]',
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
            boostMotif: 'spark',
            boostMotifClassName: isLight ? 'text-[#0f7f50]' : 'text-[#33d488]',
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
            boostMotif: 'star',
            boostMotifClassName: isLight ? 'text-[#0f7f50]' : 'text-[#fa434e]',
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
        boostMotif: 'spark',
        boostMotifClassName: 'text-[#ffffff]',
    };
};
