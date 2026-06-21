import type { FC } from 'react';
import { cn } from '@/utils/common';

const lineGradient = 'linear-gradient(270deg, var(--brand-primary-0) 0%, rgba(255, 255, 255, 0) 100%)';
const flippedLineGradient = 'linear-gradient(90deg, var(--brand-primary-0) 0%, rgba(255, 255, 255, 0) 100%)';

const Line: FC<{ flip?: boolean }> = ({ flip }) => {
    return (
        <span
            className=" w-14 shrink-0 rounded-full h-0.5 @md:w-[100px] "
            style={{
                backgroundImage: flip ? flippedLineGradient : lineGradient,
            }}
            aria-hidden="true"
        />
    );
};

/**
 * 标题组件，用于渲染带渐变装饰线的区块标题。
 */
export const Title: FC<{ title: string; color?: string }> = ({ title, color }) => {
    return (
        <div className="flex items-center justify-center gap-4">
            <Line />
            <p
                className={cn(
                    'text-center font-roboto-flex text-headline-lg max-md:text-headline-sm uppercase text-filltext-ft-h ',
                    color,
                )}
            >
                {title}
            </p>
            <Line flip />
        </div>
    );
};
