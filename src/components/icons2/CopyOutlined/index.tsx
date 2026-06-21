import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const CopyOutlined: FC<SVGIconProps> = ({ color = ['currentColor'], ...props }) => {
    return (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <path
                d="M8 14H7.6C6.71333 14 6 13.2867 6 12.4V7.6C6 6.71333 6.71333 6 7.6 6H12.4C13.2867 6 14 6.71333 14 7.6V8M11.6 10H16.4C16.8243 10 17.2313 10.1686 17.5314 10.4686C17.8314 10.7687 18 11.1757 18 11.6V16.4C18 16.8243 17.8314 17.2313 17.5314 17.5314C17.2313 17.8314 16.8243 18 16.4 18H11.6C11.1757 18 10.7687 17.8314 10.4686 17.5314C10.1686 17.2313 10 16.8243 10 16.4V11.6C10 11.3899 10.0414 11.1818 10.1218 10.9877C10.2022 10.7936 10.3201 10.6172 10.4686 10.4686C10.6172 10.3201 10.7936 10.2022 10.9877 10.1218C11.1818 10.0414 11.3899 10 11.6 10Z"
                stroke={getColor(color, 1, '#99A4B7')}
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};
