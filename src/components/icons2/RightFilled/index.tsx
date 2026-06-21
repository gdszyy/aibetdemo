import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const RightFilled: FC<SVGIconProps> = ({ color = ['currentColor'], ...props }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="1em" {...props}>
            <path
                d="M20 50 L40 70 L80 30"
                stroke={getColor(color, 1, 'black')}
                strokeWidth="10"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />
        </svg>
    );
};
