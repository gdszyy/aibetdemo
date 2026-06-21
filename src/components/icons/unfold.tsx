import type { SVGProps } from "react";
const SvgUnfold = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 18 20"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={2}
      d="m4.75 8 3.717-3.717a.4.4 0 0 1 .566 0L12.75 8M4.75 12l3.717 3.717a.4.4 0 0 0 .566 0L12.75 12"
    />
  </svg>
);
export default SvgUnfold;
