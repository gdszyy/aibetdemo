import type { SVGProps } from "react";
const SvgChecked = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <path
      stroke="#2E2E2E"
      d="M4 .5h4A3.5 3.5 0 0 1 11.5 4v4A3.5 3.5 0 0 1 8 11.5H4A3.5 3.5 0 0 1 .5 8V4A3.5 3.5 0 0 1 4 .5Z"
    />
    <path
      stroke="#0D9D17"
      strokeLinecap="round"
      strokeWidth={1.4}
      d="m3 5.592 1.442 2.254a1.2 1.2 0 0 0 2.047-.042L9 3.5"
    />
  </svg>
);
export default SvgChecked;
