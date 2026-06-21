import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const SearchOutlined: FC<SVGIconProps> = ({
    color = ['currentColor', 'currentColor', 'currentColor'],
    ...props
}) => {
    return (
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <circle cx="9" cy="9" r="7.16" stroke={getColor(color, 1, '#2A303C')} strokeWidth="1.68" />
            <path
                d="M17.4996 17.5L14.2852 14.2832"
                stroke={getColor(color, 2, '#2A303C')}
                strokeWidth="1.68"
                strokeLinecap="round"
            />
            <path
                d="M4.76367 8.70508L4.76915 8.75469C4.99656 10.8135 6.4876 12.5101 8.50012 13"
                stroke={getColor(color, 3, '#2A303C')}
                strokeWidth="1.4"
                strokeLinecap="round"
            />
        </svg>
    );
};
