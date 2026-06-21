import type { FC } from 'react';
import { getColor } from '../utils/helper';
import type { SVGIconProps } from '../utils/types';

export const PromoParlayBoostWarn: FC<SVGIconProps> = ({
    color = ['currentColor', 'currentColor', 'currentColor'],
    ...props
}) => {
    return (
        <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" width="1em" {...props}>
            <path
                d="M15.9406 7.97028C15.9406 12.3722 12.3722 15.9406 7.97028 15.9406C3.56842 15.9406 0 12.3722 0 7.97028C0 3.56842 3.56842 0 7.97028 0C12.3722 0 15.9406 3.56842 15.9406 7.97028ZM1.59406 7.97028C1.59406 11.4918 4.44879 14.3465 7.97028 14.3465C11.4918 14.3465 14.3465 11.4918 14.3465 7.97028C14.3465 4.44879 11.4918 1.59406 7.97028 1.59406C4.44879 1.59406 1.59406 4.44879 1.59406 7.97028Z"
                fill={getColor(color, 1, 'currentColor')}
            />
            <circle cx="7.9704" cy="11.4657" r="0.885587" fill={getColor(color, 2, 'currentColor')} />
            <path
                d="M6.7364 4.86797C6.68526 4.15198 7.25232 3.54297 7.97013 3.54297C8.68795 3.54297 9.25501 4.15198 9.20387 4.86797L8.91882 8.85874C8.88327 9.35646 8.46912 9.74208 7.97013 9.74208C7.47115 9.74208 7.057 9.35646 7.02145 8.85874L6.7364 4.86797Z"
                fill={getColor(color, 3, 'currentColor')}
            />
        </svg>
    );
};
