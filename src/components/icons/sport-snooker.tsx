import type { SVGProps } from "react";
const SvgSportSnooker = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path fill="currentColor" d="M1 10a9 9 0 1 0 18 .001 9 9 0 0 0-18 0" />
    <path
      fill="#fff"
      d="M8.633 2.852s-2.559.617-4.412 4.147c0 0 .705 1.676 3.794 3 0 0 1.059-3.529 2.206-4.323z"
    />
  </svg>
);
export default SvgSportSnooker;
