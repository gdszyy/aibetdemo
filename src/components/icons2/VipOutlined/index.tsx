import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const VipOutlined: FC<SVGIconProps> = ({ color = ['currentColor'], ...props }) => {
    return (
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <path
                d="M6.18125 7.54545H8.13083L10.0132 10.4909L11.8955 7.54545H13.8451L10.0132 13.6327L6.18125 7.54545ZM10.0132 1L18.0132 5.51636V14.5491L10.0132 19L2.01318 14.5491V5.51636L10.0132 1ZM3.69386 6.49818V13.5673L10.0132 17.1673L16.3325 13.5673V6.49818L10.0132 2.89818L3.69386 6.49818Z"
                fill={getColor(color, 1, '#495266')}
            />
        </svg>
    );
};
