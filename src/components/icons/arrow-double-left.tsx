import type { SVGProps } from "react";
const SvgArrowDoubleLeft = (props: SVGProps<SVGSVGElement>) => (
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
      d="M6 10 2.283 6.283a.4.4 0 0 1 0-.566L6 2M10 10 6.283 6.283a.4.4 0 0 1 0-.566L10 2"
    />
  </svg>
);
export default SvgArrowDoubleLeft;
