import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const CollapseOutlined: FC<SVGIconProps> = ({ color = ['currentColor', 'currentColor'], ...props }) => {
    return (
        <svg viewBox="0 0 16 26" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <path
                d="M2.66675 5.33398L7.62296 10.2902C7.83124 10.4985 8.16893 10.4985 8.37721 10.2902L13.3334 5.33398"
                stroke={getColor(color, 1, '#99A4B7')}
                strokeWidth="2.66667"
                strokeLinecap="round"
            />
            <path
                d="M2.66675 20.666L7.62296 15.7098C7.83124 15.5015 8.16893 15.5015 8.37721 15.7098L13.3334 20.666"
                stroke={getColor(color, 2, '#99A4B7')}
                strokeWidth="2.66667"
                strokeLinecap="round"
            />
        </svg>
    );
};
