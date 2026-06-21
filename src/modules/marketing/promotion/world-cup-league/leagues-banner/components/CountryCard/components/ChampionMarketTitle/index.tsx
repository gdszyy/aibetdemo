import type { FC } from 'react';
import { cn } from '@/utils/common';
import { CHAMPION_TITLE_GRADIENT } from '../../constants';

/** 冠军市场标题属性。 */
interface ChampionMarketTitleProps {
    /** 冠军市场标题文案。 */
    title: string;
    /** 标题展示尺寸。 */
    size?: 'desktop' | 'mobile';
}

/** 冠军市场标题及两侧金色装饰。 */
export const ChampionMarketTitle: FC<ChampionMarketTitleProps> = ({ title, size = 'desktop' }) => {
    const isMobile = size === 'mobile';

    return (
        <div className={cn('flex items-center', isMobile ? 'gap-1' : 'gap-2')}>
            <span className={cn('flex items-center', isMobile ? 'gap-px' : 'gap-0.5')}>
                <span
                    className={cn(
                        'rounded-full bg-linear-to-r from-transparent to-[#FFC750]',
                        isMobile ? 'h-px w-4' : 'h-0.5 w-10',
                    )}
                />
                <span
                    className={cn(
                        'rotate-45 bg-linear-to-b from-[#FFF6E0] to-[#FFC750]',
                        isMobile ? 'size-1' : 'size-1.5',
                    )}
                />
            </span>
            <h2
                className="bg-clip-text text-headline-sm text-transparent"
                style={{
                    backgroundImage: CHAMPION_TITLE_GRADIENT,
                    ...(isMobile ? { fontSize: 12, lineHeight: '16px' } : {}),
                }}
            >
                {title}
            </h2>
            <span className={cn('flex items-center', isMobile ? 'gap-px' : 'gap-0.5')}>
                <span
                    className={cn(
                        'rotate-45 bg-linear-to-b from-[#FFF6E0] to-[#FFC750]',
                        isMobile ? 'size-1' : 'size-1.5',
                    )}
                />
                <span
                    className={cn(
                        'rounded-full bg-linear-to-r from-[#FFC750] to-transparent',
                        isMobile ? 'h-px w-4' : 'h-0.5 w-10',
                    )}
                />
            </span>
        </div>
    );
};
