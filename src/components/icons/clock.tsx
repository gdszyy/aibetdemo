import type { SVGProps } from "react";
const SvgClock = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <g clipPath="url(#clock_svg__a)">
      <circle cx={8} cy={8} r={7} stroke="currentColor" strokeWidth={1.67} />
      <mask id="clock_svg__b" fill="#fff">
        <path d="M7 3.7a.7.7 0 1 1 1.4 0v4.6a.7.7 0 1 1-1.4 0z" />
      </mask>
      <path
        fill="currentColor"
        d="M7 3.7a.7.7 0 1 1 1.4 0v4.6a.7.7 0 1 1-1.4 0z"
      />
      <path
        fill="currentColor"
        d="M8.4 3.7h-2v4.6h4V3.7zM7 8.3h2V3.7H5v4.6zm.7.7V7A1.3 1.3 0 0 1 9 8.3H5A2.7 2.7 0 0 0 7.7 11zm.7-.7h-2A1.3 1.3 0 0 1 7.7 7v4a2.7 2.7 0 0 0 2.7-2.7zM7.7 3v2a1.3 1.3 0 0 1-1.3-1.3h4A2.7 2.7 0 0 0 7.7 1zm0 0V1A2.7 2.7 0 0 0 5 3.7h4A1.3 1.3 0 0 1 7.7 5z"
        mask="url(#clock_svg__b)"
      />
      <mask id="clock_svg__c" fill="#fff">
        <path d="M7.7 9a.7.7 0 1 1 0-1.4h3.6a.7.7 0 1 1 0 1.4z" />
      </mask>
      <path
        fill="currentColor"
        d="M7.7 9a.7.7 0 1 1 0-1.4h3.6a.7.7 0 1 1 0 1.4z"
      />
      <path
        fill="currentColor"
        d="M7.7 7.6v2h3.6v-4H7.7zM11.3 9V7H7.7v4h3.6zm.7-.7h-2A1.3 1.3 0 0 1 11.3 7v4A2.7 2.7 0 0 0 14 8.3zm-.7-.7v2A1.3 1.3 0 0 1 10 8.3h4a2.7 2.7 0 0 0-2.7-2.7zM7 8.3h2a1.3 1.3 0 0 1-1.3 1.3v-4A2.7 2.7 0 0 0 5 8.3zm0 0H5A2.7 2.7 0 0 0 7.7 11V7A1.3 1.3 0 0 1 9 8.3z"
        mask="url(#clock_svg__c)"
      />
    </g>
    <defs>
      <clipPath id="clock_svg__a">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgClock;
