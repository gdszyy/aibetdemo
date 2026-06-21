import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const NoticeH5Outlined: FC<SVGIconProps> = ({
    color = ['currentColor', 'currentColor', 'currentColor'],
    ...props
}) => {
    return (
        <svg viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <path
                d="M18.0625 27C18.0625 28.1046 17.4432 29 16.0625 29C14.6818 29 14.0625 28.1046 14.0625 27"
                stroke={getColor(color, 1, '#2A303C')}
                strokeWidth="1.6"
            />
            <path
                d="M15.4346 14.7998H16.6934C19.6333 14.7999 21.9889 17.2355 21.8906 20.1738L21.8164 22.3662C21.7752 23.5951 22.1798 24.7976 22.9551 25.752C23.1009 25.9314 22.9734 26.2002 22.7422 26.2002H9.30078C9.07847 26.2002 8.95827 25.9396 9.10254 25.7705C9.91935 24.8142 10.3489 23.587 10.3076 22.3301L10.2373 20.1709C10.1407 17.2336 12.4957 14.7998 15.4346 14.7998Z"
                stroke={getColor(color, 2, '#2A303C')}
                strokeWidth="1.6"
            />
            <path
                d="M16.0625 11.2002C17.0566 11.2002 17.8623 12.0059 17.8623 13C17.8623 13.9941 17.0566 14.7998 16.0625 14.7998C15.0684 14.7998 14.2627 13.9941 14.2627 13C14.2627 12.0059 15.0684 11.2002 16.0625 11.2002Z"
                stroke={getColor(color, 3, '#2A303C')}
                strokeWidth="1.6"
            />
        </svg>
    );
};
