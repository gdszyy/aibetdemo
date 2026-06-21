import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const WordCupPassCardRectangle: FC<SVGIconProps> = ({ color = ['currentColor'], ...props }) => {
    return (
        <svg viewBox="0 0 90 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <path
                d="M4 8C5.02665 3.89342 7.80682 0 12.0398 0H77.9602C82.1932 0 84.9734 3.89342 86 8C86.988 11.9518 90 16 90 16H0C0 16 3.01204 11.9518 4 8Z"
                fill={getColor(color, 1, '#E80104')}
            />
        </svg>
    );
};
