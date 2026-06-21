import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const UserOutlined: FC<SVGIconProps> = ({ color = ['currentColor', 'currentColor'], ...props }) => {
    return (
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <path
                d="M7 12H13C15.7614 12 18 14.2386 18 17C18 18.1046 17.1046 19 16 19H4C2.89543 19 2 18.1046 2 17C2 14.2386 4.23858 12 7 12Z"
                stroke={getColor(color, 1, '#2A303C')}
                strokeWidth="2"
            />
            <path
                d="M10 1C12.2091 1 14 2.79086 14 5C14 7.20914 12.2091 9 10 9C7.79086 9 6 7.20914 6 5C6 2.79086 7.79086 1 10 1Z"
                stroke={getColor(color, 2, '#2A303C')}
                strokeWidth="2"
            />
        </svg>
    );
};
