import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const ExpandOutlined: FC<SVGIconProps> = ({ color = ['currentColor', 'currentColor'], ...props }) => {
    return (
        <svg viewBox="0 0 16 26" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <path
                d="M2.66675 10.666L7.62296 5.70981C7.83124 5.50153 8.16893 5.50153 8.37721 5.70981L13.3334 10.666"
                stroke={getColor(color, 1, '#99A4B7')}
                strokeWidth="2.66667"
                strokeLinecap="round"
            />
            <path
                d="M2.66675 15.334L7.62296 20.2902C7.83124 20.4985 8.16893 20.4985 8.37721 20.2902L13.3334 15.334"
                stroke={getColor(color, 2, '#99A4B7')}
                strokeWidth="2.66667"
                strokeLinecap="round"
            />
        </svg>
    );
};
