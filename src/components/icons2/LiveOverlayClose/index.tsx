import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const LiveOverlayClose: FC<SVGIconProps> = ({ color = ['currentColor'], ...props }) => {
    return (
        <svg viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <path
                d="M1.24609 1.24609L13.3673 13.3673M1.24609 13.3673L13.3673 1.24609"
                stroke={getColor(color, 1, '#ffffff')}
                strokeOpacity="0.2"
                strokeLinecap="round"
                strokeWidth="2.49351"
            />
        </svg>
    );
};
