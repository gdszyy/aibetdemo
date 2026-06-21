import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const DoubleArrowRightOutlined: FC<SVGIconProps> = ({ color = ['currentColor', 'currentColor'], ...props }) => {
    return (
        <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <path
                d="M5 1L8.71716 4.71716C8.87337 4.87337 8.87337 5.12663 8.71716 5.28284L5 9"
                stroke={getColor(color, 1, 'white')}
                strokeWidth="2"
                strokeLinecap="round"
            />
            <path
                d="M1 1L4.71716 4.71716C4.87337 4.87337 4.87337 5.12663 4.71716 5.28284L1 9"
                stroke={getColor(color, 2, 'white')}
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
};
