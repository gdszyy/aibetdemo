'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { FC, MouseEvent } from 'react';
import { AdPlacementJumpType, type FloatingCardAdPlacement } from '@/api/models/ad-placement';
import { Close } from '@/components/icons';
import { cn } from '@/utils/common';
import ArrowIcon from './assets/arrow_icon.svg';

interface AdPlacementFloatingCardProps {
    item: FloatingCardAdPlacement;
    className?: string;
    onClick: (item: FloatingCardAdPlacement) => void;
    onRemove: (event: MouseEvent<HTMLButtonElement>, id: number) => void;
}

/**
 * 单张悬浮广告卡片。
 *
 * 背景图、标题、正文、按钮文案都来自后端活动配置。
 * 卡片本身保持展示职责，点击跳转和关闭逻辑由父组件注入，便于轮播态和展开态复用。
 */
export const AdPlacementFloatingCard: FC<AdPlacementFloatingCardProps> = ({ item, className, onClick, onRemove }) => {
    const t = useTranslations('common');

    return (
        <div className={cn('relative h-19 overflow-hidden rounded-sm bg-transparent', className)}>
            {item.data.background_image && (
                <Image
                    src={item.data.background_image}
                    alt={item.data.title ?? item.activity_name}
                    fill
                    sizes="320px"
                    className="object-cover"
                />
            )}
            <div className="absolute inset-0 bg-filltext-ft-h/30" />
            <button
                type="button"
                className="absolute right-0 top-0 z-20 flex size-4 cursor-pointer items-center justify-center rounded-xs bg-transparent text-filltext-ft-e"
                onClick={(event) => onRemove(event, item.id)}
                aria-label={t('action.close')}
            >
                <Close className="size-[6.67px]" />
            </button>
            <div
                className={cn(
                    'relative z-10 flex h-full w-full flex-col items-start gap-0.5 p-2 text-left',
                    item.data.jump_type !== AdPlacementJumpType.None && 'cursor-pointer',
                )}
            >
                <span className="line-clamp-1 text-auxiliary-md text-neutral-white-h font-poppins">
                    {item.data.title ?? item.activity_name}
                </span>
                {item.data.content && (
                    <span className="line-clamp-2 text-[8px] leading-2.5 text-filltext-ft-c font-poppins">
                        {item.data.content}
                    </span>
                )}
                <div className="flex-1"></div>
                {item.data.button_text && (
                    <button
                        type="button"
                        className="group mt-1 ml-auto inline-flex h-3.5 w-fit cursor-pointer items-center gap-1 rounded-full bg-brand-primary-0 px-2 font-poppins text-[8px] text-neutral-white-h shadow-[0_0_4px_0_var(--brandprimary-4),inset_0_0_1.4px_0_var(--neutralwhitef)]"
                        onClick={() => onClick(item)}
                    >
                        {item.data.button_text}
                        <Image
                            src={ArrowIcon}
                            alt=""
                            width={8}
                            height={8}
                            className="hidden size-2 group-hover:block"
                        />
                    </button>
                )}
            </div>
        </div>
    );
};
