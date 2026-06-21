import type { SVGProps } from "react";
const SvgSupport = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <g clipPath="url(#support_svg__a)">
      <path
        stroke="currentColor"
        strokeWidth={1.75}
        d="M4 8.88c.07 0 .125.056.125.125v4.998c0 .069-.056.125-.125.125l-.907-.003H3.09c-1.11 0-2.196-1.062-2.196-2.622 0-1.61 1.008-2.627 2.073-2.628zm13.047-.001c1.07 0 2.078 1.014 2.078 2.622 0 1.56-1.085 2.622-2.196 2.622h-.003l-.925.003a.125.125 0 0 1-.126-.125V9.007c0-.069.056-.125.124-.125z"
      />
      <path
        stroke="currentColor"
        strokeWidth={2}
        d="M3.008 9.23a7 7 0 1 1 13.986-.094"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={1.4}
        d="M6.875 12a5 5 0 0 0 6.25 0"
      />
      <path
        fill="currentColor"
        d="M8 18a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1"
      />
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth={1.4}
        d="m3.5 14.5.201.47A5 5 0 0 0 8.297 18H9"
      />
    </g>
    <defs>
      <clipPath id="support_svg__a">
        <path fill="#fff" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgSupport;
