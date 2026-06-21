import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const MenuOutlined: FC<SVGIconProps> = ({ color = ['currentColor'], ...props }) => {
    return (
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <path
                d="M1 1H15M2 8H14M1 15H15"
                stroke={getColor(color, 1, '#99A4B7')}
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
};
