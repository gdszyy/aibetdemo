'use client';
import { type FC, useMemo, useState } from 'react';
import type { VipBenefitTypeEnum } from '@/api/models/vip';
import { cn } from '@/utils/common';
import { useVipStaticConfGetter } from '../../services/useVipStaticConfGetter';

export interface BenefitItem {
    id: VipBenefitTypeEnum | number;
    description: string;
}

/**
 * 单个权益卡片组件，负责图标、标题和描述的展示与 hover 效果。
 */
export const BenefitCard: FC<{ item: BenefitItem }> = ({ item }) => {
    const { description } = item;
    const [isHovered, setIsHovered] = useState(false);
    const { benefitIconMap, benefitTitleMap } = useVipStaticConfGetter();
    const Icon = useMemo(() => benefitIconMap[item.id as VipBenefitTypeEnum], [benefitIconMap, item.id]);
    const title = useMemo(() => benefitTitleMap[item.id as VipBenefitTypeEnum], [benefitTitleMap, item.id]);

    return (
        <article
            className={cn(
                'group flex h-full flex-col rounded-md border border-filltext-ft-c/40 bg-surface-1 p-4 transition-colors duration-200',
                'hover:border-filltext-ft-f',
                'min-h-[128px]',
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* 图标容器 */}
            <div className="px-3 py-2.5 w-fit flex items-center justify-center rounded-sm bg-filltext-ft-a">
                <Icon className="size-6" color={isHovered ? 'var(--func-bonus)' : 'var(--filltext-ft-f)'} />
            </div>

            {/* 权益标题 */}
            <h3 className="mb-1 mt-2 text-title-sm font-poppins text-filltext-ft-h">{title}</h3>

            {/* 权益描述 */}
            <p
                className={cn(
                    'font-poppins text-auxiliary-sm leading-[1.3] text-filltext-ft-e',
                    isHovered && 'text-filltext-ft-g',
                )}
            >
                {description}
            </p>
        </article>
    );
};
