import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const LiveOverlayBack: FC<SVGIconProps> = ({ color = ['currentColor'], ...props }) => {
    return (
        <svg viewBox="0 0 11 17" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <path
                d="M9.0918 0.908203L2.33333 7.66667C2.04931 7.95069 2.04931 8.41117 2.33333 8.69519L9.0918 15.4537"
                stroke={getColor(color, 1, '#ffffff')}
                strokeOpacity="0.2"
                strokeLinecap="round"
                strokeWidth="1.81818"
            />
        </svg>
    );
};
