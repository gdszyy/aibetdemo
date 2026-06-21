import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const ArrowUpOutlined: FC<SVGIconProps> = ({ color = ['currentColor'], ...props }) => {
    return (
        <svg viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <path
                d="M12 6.44531L7.04379 1.4891C6.83551 1.28082 6.49782 1.28082 6.28954 1.4891L1.33333 6.44531"
                stroke={getColor(color, 1, '#495266')}
                strokeWidth="2.66667"
                strokeLinecap="round"
            />
        </svg>
    );
};
