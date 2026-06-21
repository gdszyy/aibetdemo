import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const CashbackOutlined: FC<SVGIconProps> = ({
    color = ['currentColor', 'currentColor', 'currentColor', 'currentColor', 'currentColor'],
    ...props
}) => {
    return (
        <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <path
                d="M5.54102 1.75H8.45768C8.68975 1.75 8.91231 1.84219 9.0764 2.00628C9.2405 2.17038 9.33268 2.39294 9.33268 2.625C9.33268 3.16648 9.11758 3.68579 8.73469 4.06868C8.3518 4.45156 7.8325 4.66667 7.29102 4.66667H6.70768C6.1662 4.66667 5.64689 4.45156 5.26401 4.06868C4.88112 3.68579 4.66602 3.16648 4.66602 2.625C4.66602 2.39294 4.7582 2.17038 4.9223 2.00628C5.08639 1.84219 5.30895 1.75 5.54102 1.75Z"
                stroke={getColor(color, 1, '#99A4B7')}
                strokeWidth="1.05"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M2.33301 9.91602V9.33268C2.33301 8.09501 2.82467 6.90802 3.69984 6.03285C4.57501 5.15768 5.762 4.66602 6.99967 4.66602C8.23735 4.66602 9.42434 5.15768 10.2995 6.03285C11.1747 6.90802 11.6663 8.09501 11.6663 9.33268V9.91602C11.6663 10.5349 11.4205 11.1283 10.9829 11.5659C10.5453 12.0035 9.95185 12.2493 9.33301 12.2493H4.66634C4.0475 12.2493 3.45401 12.0035 3.01643 11.5659C2.57884 11.1283 2.33301 10.5349 2.33301 9.91602Z"
                stroke={getColor(color, 2, '#99A4B7')}
                strokeWidth="1.05"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path d="M8.5 7.5L5.5 10" stroke={getColor(color, 3, '#99A4B7')} strokeLinecap="round" />
            <circle cx="6" cy="7.5" r="0.5" fill={getColor(color, 4, '#99A4B7')} />
            <circle cx="8" cy="10" r="0.5" fill={getColor(color, 5, '#99A4B7')} />
        </svg>
    );
};
