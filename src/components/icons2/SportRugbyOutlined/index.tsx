import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const SportRugbyOutlined: FC<SVGIconProps> = ({ color = ['currentColor'], ...props }) => {
    return (
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <path
                d="M8.82123 8.82165L11.1783 11.1783M10.5891 7.05373L12.9462 9.41082M7.05415 10.5891L9.41082 12.9462M5.28832 14.7166L14.7166 5.28832M2.33957 11.7679L8.23207 17.6604M11.7679 2.33957L17.6604 8.23207M14.125 14.125C18.03 10.2196 19.3491 5.20707 17.0708 2.92915C14.7929 0.650816 9.7804 1.96998 5.87498 5.87498C1.96998 9.7804 0.650816 14.7929 2.92915 17.0708C5.20707 19.3491 10.2196 18.03 14.125 14.125Z"
                stroke={getColor(color, 1, 'white')}
                strokeWidth="1.66667"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
