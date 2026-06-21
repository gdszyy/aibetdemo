import type { SVGProps } from "react";
const SvgOpenInNew = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <rect
      width={16}
      height={14}
      x={2}
      y={3}
      stroke="currentColor"
      strokeWidth={1.67}
      rx={2}
    />
  </svg>
);
export default SvgOpenInNew;
