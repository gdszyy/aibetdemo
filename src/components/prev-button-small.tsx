import type { SVGProps } from 'react';

const SvgPrevButtonSmall = (props: SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" fill="none" viewBox="0 0 24 24" {...props}>
        <path
            d="M0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z"
            fill="white"
        />
        <path
            d="M14 16L10.2828 12.2828C10.1266 12.1266 10.1266 11.8734 10.2828 11.7172L14 8"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
        />
    </svg>
);
export default SvgPrevButtonSmall;
