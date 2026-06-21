import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const LanguageOutlined: FC<SVGIconProps> = ({
    color = ['currentColor', 'currentColor', 'currentColor', 'currentColor', 'currentColor'],
    ...props
}) => {
    return (
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <path
                d="M1.66663 17.916H18.3333"
                stroke={getColor(color, 1, '#2A303C')}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M2.5 8.33333C2.5 8.33333 6.27192 7.5 10 7.5C13.7281 7.5 17.5 8.33333 17.5 8.33333"
                stroke={getColor(color, 2, '#2A303C')}
                strokeWidth="1.66667"
            />
            <path
                d="M2.08337 12.5C2.08337 12.5 5.83337 13.3333 10 13.3333C14.1667 13.3333 17.9167 12.5 17.9167 12.5"
                stroke={getColor(color, 3, '#2A303C')}
                strokeWidth="1.66667"
            />
            <path
                d="M9.99996 2.5C5.39758 2.5 1.66663 6.23096 1.66663 10.8333C1.66663 14.0869 3.11448 16.5443 5.83329 17.9167H14.1666C16.8855 16.5443 18.3333 14.0869 18.3333 10.8333C18.3333 6.23096 14.6023 2.5 9.99996 2.5Z"
                stroke={getColor(color, 4, '#2A303C')}
                strokeWidth="2"
            />
            <path
                d="M10 2.5C8.38921 2.5 7.08337 6.23096 7.08337 10.8333C7.08337 13.8239 7.50525 16.4465 8.33337 17.9167H11.6667C12.4948 16.4465 12.9167 13.8239 12.9167 10.8333C12.9167 6.23096 11.6109 2.5 10 2.5Z"
                stroke={getColor(color, 5, '#2A303C')}
                strokeWidth="1.66667"
            />
        </svg>
    );
};
