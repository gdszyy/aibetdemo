import type { SVGProps } from "react";
const SvgCloseBold = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 14 14"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={2}
      d="m2 2 10 10M2 12 12 2"
    />
  </svg>
);
export default SvgCloseBold;
