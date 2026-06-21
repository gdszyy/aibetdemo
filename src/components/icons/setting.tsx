import type { SVGProps } from "react";
const SvgSetting = (props: SVGProps<SVGSVGElement>) => (
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
      strokeWidth={2}
      d="M6.3 2h7.4c.572 0 1.1.306 1.386.8l3.7 6.401a1.6 1.6 0 0 1 0 1.598l-3.7 6.401c-.286.494-.814.8-1.386.8H6.3c-.572 0-1.1-.306-1.386-.8l-3.7-6.401a1.6 1.6 0 0 1 0-1.598l3.7-6.401C5.2 2.306 5.728 2 6.3 2Z"
    />
    <circle cx={10} cy={10} r={3.2} stroke="currentColor" strokeWidth={1.6} />
  </svg>
);
export default SvgSetting;
