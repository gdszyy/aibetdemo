import type { SVGProps } from "react";
const SvgAdd = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      fill="#E80104"
      d="M10 1a9 9 0 1 1 0 18 9 9 0 0 1 0-18m.02 3.306a1 1 0 0 0-1 1V9.02H5.306a1 1 0 0 0 0 2H9.02v3.713a1 1 0 0 0 2 0V11.02h3.713a1 1 0 1 0 0-2H11.02V5.306a1 1 0 0 0-1-1"
    />
  </svg>
);
export default SvgAdd;
