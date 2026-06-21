import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const CasinoBonusOutlined: FC<SVGIconProps> = ({ color = ['currentColor'], ...props }) => {
    return (
        <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <path
                d="M8.9688 12.4846C9.07147 12.3213 8.93905 12.0594 8.67422 11.5367C8.53363 11.2591 7.75372 9.85497 8.0238 9.5738C8.09438 9.5003 8.34405 9.56214 8.8428 9.68755C9.57547 9.87189 10.517 9.80714 11.3336 9.20105C14.4247 6.90622 8.85622 1.16797 7.00005 1.16797C5.14388 1.16797 -0.425783 6.90622 2.66705 9.20105C3.48313 9.80714 4.42463 9.87189 5.1573 9.68755C5.65605 9.56272 5.90572 9.5003 5.9763 9.5738C6.24697 9.85497 5.46705 11.2596 5.32588 11.5367C5.06105 12.0594 4.92922 12.3207 5.0313 12.4841C5.27338 12.8691 8.62697 13.0277 8.9688 12.4846Z"
                stroke={getColor(color, 1, '#99A4B7')}
                strokeWidth="1.05"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
