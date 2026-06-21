import type { SVGProps } from "react";
const SvgUpTriangle = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 12 8"
    {...props}
  >
    <path
      fill="currentColor"
      d="M5.183.657a1 1 0 0 1 1.634 0l4.07 5.766A1 1 0 0 1 10.07 8H1.93a1 1 0 0 1-.817-1.577z"
    />
  </svg>
);
export default SvgUpTriangle;
