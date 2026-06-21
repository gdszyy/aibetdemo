import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const BreadcrumbSeparatorOutlined: FC<SVGIconProps> = ({ color = ['currentColor'], ...props }) => {
    return (
        <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <rect
                x="8.07031"
                y="1.07422"
                width="1"
                height="12"
                rx="0.5"
                transform="rotate(15 8.07031 1.07422)"
                fill={getColor(color, 1, '#99A4B7')}
            />
        </svg>
    );
};
