import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const SportBonusOutlined: FC<SVGIconProps> = ({
    color = ['currentColor', 'currentColor', 'currentColor'],
    ...props
}) => {
    return (
        <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <path
                d="M1.9487 9.91914C3.5587 12.7092 7.12637 13.6641 9.91704 12.0541C11.011 11.4245 11.8703 10.4558 12.3647 9.29439C12.7211 8.46154 12.8783 7.5571 12.8241 6.65285C12.7698 5.7486 12.5054 4.86946 12.052 4.08522C11.5995 3.30061 10.9704 2.63228 10.2145 2.13328C9.45857 1.63428 8.59676 1.31835 7.69745 1.21055C6.44451 1.05803 5.17596 1.31767 4.0837 1.95022C1.29362 3.56139 0.337538 7.12905 1.9487 9.91914Z"
                stroke={getColor(color, 1, '#99A4B7')}
                strokeWidth="1.05"
            />
            <path
                d="M9.88828 12.0018C9.88828 12.0018 9.33995 8.15708 8.16745 6.12592C6.99495 4.09475 4.11328 2 4.11328 2"
                stroke={getColor(color, 2, '#99A4B7')}
                strokeWidth="1.05"
                strokeLinecap="round"
            />
            <path
                d="M12.7547 7.33751C9.59827 6.64509 5.2851 9.53551 4.4206 12.143M9.57552 1.87109C8.70752 4.44943 4.47719 7.29784 1.33594 6.67951"
                stroke={getColor(color, 3, '#99A4B7')}
                strokeWidth="1.05"
                strokeLinecap="round"
            />
        </svg>
    );
};
