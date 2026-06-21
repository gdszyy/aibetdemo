import type { SVGProps } from "react";
const SvgUcNotification = (props: SVGProps<SVGSVGElement>) => (
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
      strokeWidth={1.5}
      d="M3 2.75h14c.69 0 1.25.56 1.25 1.25v9c0 .69-.56 1.25-1.25 1.25H3.69l-1.94 1.94V4c0-.69.56-1.25 1.25-1.25Z"
    />
    <circle cx={10} cy={8.5} r={1} fill="currentColor" />
    <circle cx={6} cy={8.5} r={1} fill="currentColor" />
    <circle cx={14} cy={8.5} r={1} fill="currentColor" />
  </svg>
);
export default SvgUcNotification;
