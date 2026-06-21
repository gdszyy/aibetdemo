import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const WrongCircleOutlined: FC<SVGIconProps> = ({
    color = ['currentColor', 'currentColor', 'currentColor'],
    ...props
}) => {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <path
                d="M24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12ZM2.4 12C2.4 17.3019 6.69807 21.6 12 21.6C17.3019 21.6 21.6 17.3019 21.6 12C21.6 6.69807 17.3019 2.4 12 2.4C6.69807 2.4 2.4 6.69807 2.4 12Z"
                fill={getColor(color, 1, '#AF0507')}
            />
            <path
                d="M16.9788 17.1425L7.02145 6.85631"
                stroke={getColor(color, 2, '#AF0507')}
                strokeWidth="2.4"
                strokeLinecap="round"
            />
            <path
                d="M7.02118 17.1425L16.9786 6.85631"
                stroke={getColor(color, 3, '#AF0507')}
                strokeWidth="2.4"
                strokeLinecap="round"
            />
        </svg>
    );
};
