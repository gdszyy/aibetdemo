import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const SlipOutlined: FC<SVGIconProps> = ({
    color = ['currentColor', 'currentColor', 'currentColor'],
    ...props
}) => {
    return (
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <path
                d="M2.80491 3.27367C2.92223 2.63635 3.48021 2.18359 4.12824 2.18359H15.8718C16.5198 2.18359 17.0778 2.63635 17.1951 3.27367C17.4927 4.89044 18 7.97078 18 10.1836C18 13.315 16.9841 18.1836 16.9841 18.1836L13.4921 15.7429L10 18.1836L6.50794 15.7429L3.01587 18.1836C3.01587 18.1836 2 13.315 2 10.1836C2 7.97078 2.50729 4.89044 2.80491 3.27367Z"
                stroke={getColor(color, 1, '#495266')}
                strokeWidth="1.4"
                strokeLinejoin="round"
            />
            <line
                x1="6.7"
                y1="7.3"
                x2="13.3"
                y2="7.3"
                stroke={getColor(color, 2, '#495266')}
                strokeWidth="1.4"
                strokeLinecap="round"
            />
            <line
                x1="6.7"
                y1="11.4836"
                x2="13.3"
                y2="11.4836"
                stroke={getColor(color, 3, '#495266')}
                strokeWidth="1.4"
                strokeLinecap="round"
            />
        </svg>
    );
};
