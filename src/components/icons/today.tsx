import type { SVGProps } from "react";
const SvgToday = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 14 14"
    {...props}
  >
    <path
      stroke="#3C4851"
      strokeWidth={1.4}
      d="M7.002.7c2.777 0 4.63 2.865 3.49 5.398l-3.14 6.98a.383.383 0 0 1-.699 0l-3.141-6.98C2.372 3.565 4.225.7 7.002.7Z"
    />
  </svg>
);
export default SvgToday;
