import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const DoubleArrowUpOutlined: FC<SVGIconProps> = ({ color = ['currentColor', 'currentColor'], ...props }) => {
    return (
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <path
                d="M2.66675 13.334L7.62296 8.37777C7.83124 8.1695 8.16893 8.16949 8.37721 8.37777L13.3334 13.334"
                stroke={getColor(color, 1, '#495266')}
                strokeWidth="2.66667"
                strokeLinecap="round"
            />
            <path
                d="M2.66675 8L7.62296 3.04379C7.83124 2.83551 8.16893 2.83551 8.37721 3.04379L13.3334 8"
                stroke={getColor(color, 2, '#495266')}
                strokeWidth="2.66667"
                strokeLinecap="round"
            />
        </svg>
    );
};
