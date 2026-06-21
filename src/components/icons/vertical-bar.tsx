import type { SVGProps } from "react";
const SvgVerticalBar = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 14 14"
    {...props}
  >
    <rect width={1} height={12} x={6.5} y={1} fill="currentColor" rx={0.5} />
  </svg>
);
export default SvgVerticalBar;
