import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const CasinoHotFilled: FC<SVGIconProps> = ({ color = ['currentColor'], ...props }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" width="1em" {...props}>
            <path
                fill={getColor(color, 1, 'currentColor')}
                d="M10 18.5a6.8 6.8 0 0 1-3.613-1.034 6.4 6.4 0 0 1-2.363-2.743 5.59 5.59 0 0 1-.298-3.505c.28-1.169.931-2.234 1.87-3.054C6.888 7.229 9.714 5.414 9.286 1.429c5.142 3.189 7.714 6.378 2.571 11.163.857 0 2.143 0 4.286-1.97.231.617.428 1.279.428 1.97 0 1.586-.676 3.107-1.883 4.228C13.482 17.94 11.81 18.5 10 18.5"
            />
        </svg>
    );
};
