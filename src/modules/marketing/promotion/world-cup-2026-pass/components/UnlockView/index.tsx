import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { WordCupPassDiscount } from '@/components/icons2/WordCupPassDiscount';
import { cn } from '@/utils/common';
import PremiumPass from '../../assets/premium-pass.png';
import { GradientBorder } from '../GradientBorder';

/**
 * 解锁通行证
 */
export const UnlockView: React.FC<{
    /** 原价 */
    premiumPrice: string;
    /** 折扣价 */
    discountPrice?: string;
    /** 是否有折扣 */
    isDiscount: boolean;
    /** 开通会员 */
    onUnlockPremium: () => void;
    /** 是否正在开通 */
    isUnlocking: boolean;
}> = ({ premiumPrice, discountPrice, isDiscount, onUnlockPremium, isUnlocking }) => {
    const t = useTranslations('promotionWorldCupPass');
    const [isUnlockButtonHovered, setIsUnlockButtonHovered] = useState<boolean>(false);

    return (
        <GradientBorder isHighLevel={true}>
            <div className="relative rounded-md bg-surface-1 p-3.75 flex md:flex-row flex-col items-center justify-between gap-2">
                {isDiscount && discountPrice && (
                    <span className="right-3.5 top-6 absolute size-6 rotate-[15.89deg]">
                        <WordCupPassDiscount className="size-full motion-safe:animate-spin motion-safe:[animation-duration:3s]" />
                    </span>
                )}
                <Image className="w-20 h-18" src={PremiumPass.src} width={80} height={72} alt="premium pass" />
                <div className="flex flex-col flex-1 gap-1 md:text-start text-center">
                    <span className="text-title-sm text-filltext-ft-h">{t('unlock.title')}</span>
                    <span className="text-auxiliary-sm text-filltext-ft-e">{t('unlock.description')}</span>
                </div>
                <div
                    className={cn(
                        'md:w-auto w-full flex justify-center shrink-0',
                        isUnlockButtonHovered && '-mr-[1.5px]',
                    )}
                    onMouseEnter={() => setIsUnlockButtonHovered(true)}
                    onMouseLeave={() => setIsUnlockButtonHovered(false)}
                >
                    <GradientBorder
                        streamer={isUnlockButtonHovered}
                        radius={999}
                        borderWidth={isUnlockButtonHovered ? 2 : 0.5}
                        isHighLevel={true}
                        className="w-full"
                    >
                        <button
                            type="button"
                            onClick={onUnlockPremium}
                            disabled={isUnlocking}
                            className={cn(
                                'px-[15.5px] md:w-auto w-full h-8 leading-8 bg-linear-to-t from-[#060B0C] to-[#02332B] text-auxiliary-sm text-neutral-white-h rounded-full',
                                isUnlocking && 'opacity-60',
                            )}
                        >
                            <span>
                                {t('unlock.unlockFor')}{' '}
                                {isDiscount && discountPrice ? (
                                    <span>
                                        <span className="line-through text-filltext-ft-e">{premiumPrice}</span>{' '}
                                        <span className="text-title-sm text-[#66FDCE]">{discountPrice}</span>
                                    </span>
                                ) : (
                                    <span>{premiumPrice}</span>
                                )}
                            </span>
                        </button>
                    </GradientBorder>
                </div>
            </div>
        </GradientBorder>
    );
};
