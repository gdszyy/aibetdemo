import type { SVGProps } from "react";
const SvgEnd = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <g clipPath="url(#end_svg__a)">
      <path
        stroke="#86909C"
        strokeWidth={1.2}
        d="M6 10.8a4.8 4.8 0 1 0 0-9.6 4.8 4.8 0 0 0 0 9.6Z"
      />
      <rect width={2.4} height={2.4} x={4.8} y={4.8} fill="#86909C" rx={0.72} />
    </g>
    <defs>
      <clipPath id="end_svg__a">
        <path fill="#fff" d="M0 0h12v12H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgEnd;
