import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const FavoriteOutlined: FC<SVGIconProps> = ({ color = ['currentColor'], ...props }) => {
    return (
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <path
                d="M12.1084 6.80566C12.2778 7.16577 12.6161 7.43424 13.0283 7.49707L17.8193 8.22656L14.3271 11.7979C14.0457 12.0856 13.9251 12.489 13.9883 12.876L14.8047 17.8682L10.582 15.5391L10.4424 15.4736C10.1106 15.3423 9.7354 15.364 9.41797 15.5391L5.19434 17.8682L6.01172 12.876C6.07491 12.489 5.95433 12.0856 5.67285 11.7979L2.17969 8.22656L6.97168 7.49707C7.3839 7.43424 7.72217 7.16577 7.8916 6.80566L10 2.32422L12.1084 6.80566Z"
                stroke={getColor(color, 1, '#495266')}
                strokeWidth="1.6"
            />
        </svg>
    );
};
