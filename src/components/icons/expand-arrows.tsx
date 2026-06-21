import type { SVGProps } from "react";
const SvgExpandArrows = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.67}
      d="m12.5 7.5 5-5m0 0h-5m5 0v5m-15 10 5-5m-5 5v-5m0 5h5"
    />
  </svg>
);
export default SvgExpandArrows;
