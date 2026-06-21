import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const CloseOutlined: FC<SVGIconProps> = ({ color = ['currentColor'], ...props }) => {
    return (
        <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <path
                d="M0.699951 0.699219L10.7 10.6992M0.699951 10.6992L10.7 0.699219"
                stroke={getColor(color, 1, '#99A4B7')}
                strokeWidth="1.4"
                strokeLinecap="round"
            />
        </svg>
    );
};
