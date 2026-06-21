import type { SVGProps } from "react";
const SvgExitArrows = (props: SVGProps<SVGSVGElement>) => (
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
      d="M17.496 2.495 12.08 7.912m0 0h5m-5 0v-5M7.918 12.083 2.501 17.5m5.417-5.417v5m0-5h-5"
    />
  </svg>
);
export default SvgExitArrows;
