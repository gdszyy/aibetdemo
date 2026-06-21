import type { SVGProps } from "react";
const SvgSearch = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <g stroke="currentColor" strokeWidth={2} clipPath="url(#search_svg__a)">
      <circle cx={6.857} cy={6.857} r={5.857} />
      <path strokeLinecap="round" d="m14.857 14.856-3.428-3.428" />
    </g>
    <defs>
      <clipPath id="search_svg__a">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgSearch;
