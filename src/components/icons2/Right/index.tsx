import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const Right: FC<SVGIconProps> = ({ color = ['#00CC4E', 'white', 'white'], ...props }) => {
    return (
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <path
                d="M14.8571 7.99777C14.8571 11.7849 11.7871 14.8549 7.99996 14.8549C4.21287 14.8549 1.14282 11.7849 1.14282 7.99777C1.14282 4.21067 4.21287 1.14062 7.99996 1.14062C11.7871 1.14062 14.8571 4.21067 14.8571 7.99777Z"
                fill={getColor(color, 1, '#00CC4E')}
            />
            <line
                x1="4.67411"
                y1="8.72223"
                x2="7.00554"
                y2="10.4708"
                stroke={getColor(color, 2, 'white')}
                strokeWidth="1.37143"
                strokeLinecap="round"
            />
            <line
                x1="7.06845"
                y1="10.4579"
                x2="11.3188"
                y2="5.49918"
                stroke={getColor(color, 3, 'white')}
                strokeWidth="1.37143"
                strokeLinecap="round"
            />
        </svg>
    );
};
