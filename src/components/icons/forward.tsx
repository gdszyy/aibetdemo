import type { SVGProps } from "react";
const SvgForward = (props: SVGProps<SVGSVGElement>) => (
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
      strokeLinejoin="round"
      strokeWidth={1.167}
      d="m8.832 3.5 3.219 2.888a.613.613 0 0 1 0 .903L8.777 10.26m-3.59-1.875v.942a.554.554 0 0 0 .89.493l2.98-2.48a.642.642 0 0 0 0-.96L6.077 3.9a.554.554 0 0 0-.89.494v.992c-1.932 0-3.5 1.737-3.5 3.881v.775a.408.408 0 0 0 .784.206 3.02 3.02 0 0 1 2.714-1.861z"
    />
  </svg>
);
export default SvgForward;
