import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const CasinoGameShowsFilled: FC<SVGIconProps> = ({
    color = ['currentColor', 'currentColor', 'currentColor', 'currentColor'],
    ...props
}) => {
    return (
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <path
                d="M7.92483 7.0293L2.18492 14.8721C2.04986 15.0566 1.98527 15.2834 2.00283 15.5113C2.02039 15.7393 2.11895 15.9535 2.28068 16.1151L3.06304 16.8984C3.22713 17.0623 3.44512 17.1611 3.67654 17.1764C3.90796 17.1918 4.13708 17.1226 4.32134 16.9817L11.8414 11.2418"
                stroke={getColor(color, 1, '#495266')}
                strokeWidth="1.91522"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M12.7138 11.2421C15.3582 11.2421 17.5019 9.09843 17.5019 6.45406C17.5019 3.8097 15.3582 1.66602 12.7138 1.66602C10.0695 1.66602 7.92578 3.8097 7.92578 6.45406C7.92578 9.09843 10.0695 11.2421 12.7138 11.2421Z"
                fill={getColor(color, 2, '#495266')}
                stroke={getColor(color, 3, '#495266')}
                strokeWidth="1.91522"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M3.99877 17C4.89663 16.6384 5.82774 16.3496 7.0012 16.4622C8.76139 16.6311 10.212 18.3354 12.0066 18.2711C13.8013 18.2068 14.5191 15.8483 13.5001 14.9992"
                stroke={getColor(color, 4, '#495266')}
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
