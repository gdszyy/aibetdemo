import type { SVGProps } from "react";
const SvgAddRectangle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 14"
    {...props}
  >
    <path
      stroke="#E80104"
      strokeWidth={2}
      d="M4 1h12a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3H4a3 3 0 0 1-3-3V4l.004-.154A3 3 0 0 1 4 1Z"
    />
    <path
      stroke="#E80104"
      strokeLinecap="round"
      strokeWidth={2}
      d="M6 7h8M10 10V4"
    />
  </svg>
);
export default SvgAddRectangle;
