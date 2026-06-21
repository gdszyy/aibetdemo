import type { SVGProps } from "react";
const SvgArrowDoubleRight = (props: SVGProps<SVGSVGElement>) => (
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
      d="m2 2 3.717 3.717a.4.4 0 0 1 0 .566L2 10M6 2l3.717 3.717a.4.4 0 0 1 0 .566L6 10"
    />
  </svg>
);
export default SvgArrowDoubleRight;
