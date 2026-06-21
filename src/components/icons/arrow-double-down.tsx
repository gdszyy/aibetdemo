import type { SVGProps } from "react";
const SvgArrowDoubleDown = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={2}
      d="M10 2 6.283 5.717a.4.4 0 0 1-.566 0L2 2M10 6 6.283 9.717a.4.4 0 0 1-.566 0L2 6"
    />
  </svg>
);
export default SvgArrowDoubleDown;
