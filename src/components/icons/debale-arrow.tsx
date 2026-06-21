import type { SVGProps } from "react";
const SvgDebaleArrow = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      stroke="#99A4B7"
      strokeLinecap="round"
      strokeWidth={2}
      d="m14 6-3.717 3.717a.4.4 0 0 1-.566 0L6 6M14 10l-3.717 3.717a.4.4 0 0 1-.566 0L6 10"
    />
  </svg>
);
export default SvgDebaleArrow;
