import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const HomeOutlined: FC<SVGIconProps> = ({ color = ['currentColor'], ...props }) => {
    return (
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <path
                d="M17.2002 7.25293V17.2002H11.7998V11.2002H8.2002V17.2002H2.7998V7.25293L10 2.93164L17.2002 7.25293Z"
                stroke={getColor(color, 1, '#495266')}
                strokeWidth="1.6"
            />
        </svg>
    );
};
