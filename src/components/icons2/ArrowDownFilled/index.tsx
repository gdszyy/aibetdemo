import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const ArrowDownFilled: FC<SVGIconProps> = ({ color = ['currentColor'], ...props }) => {
    return (
        <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <path
                d="M0.5 4.41176L7 11L13.5 4.41176L12.1071 3L7 8.17647L1.89286 3L0.5 4.41176Z"
                fill={getColor(color, 1, '#2A303C')}
            />
        </svg>
    );
};
