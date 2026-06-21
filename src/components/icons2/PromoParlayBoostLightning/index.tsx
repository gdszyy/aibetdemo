import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const PromoParlayBoostLightning: FC<SVGIconProps> = ({ color = ['currentColor', '#FFC31D'], ...props }) => {
    return (
        <svg viewBox="0 0 14 26" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <path
                d="M0 13.8125L14 0L8.75 10.5625H14L0 26L5.25 13.8125H0Z"
                fill={getColor(color, 1, 'currentColor')}
                stroke={getColor(color, 2, '#FFC31D')}
                strokeWidth="0.4"
            />
        </svg>
    );
};
