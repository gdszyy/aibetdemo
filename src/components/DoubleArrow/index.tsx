import type { ComponentProps, FunctionComponent } from 'react';
import { cn } from '@/utils/common';
import { DoubleArrowUpOutlined } from '../icons2/DoubleArrowUpOutlined';

/** 双箭头，带方向 */
export const DoubleArrow: FunctionComponent<
    ComponentProps<typeof DoubleArrowUpOutlined> & { direction: 'up' | 'down' | 'left' | 'right' }
> = ({ direction, className, ...props }) => {
    return (
        <DoubleArrowUpOutlined
            className={cn(
                direction === 'up' && 'rotate-0',
                direction === 'down' && 'rotate-180',
                direction === 'left' && '-rotate-90',
                direction === 'right' && 'rotate-90',
                className,
            )}
            {...props}
        />
    );
};
