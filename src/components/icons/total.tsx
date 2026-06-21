import type { SVGProps } from "react";
const SvgTotal = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 40 40"
    {...props}
  >
    <path
      fill="#DEE4E7"
      d="M3 7.5a3.5 3.5 0 1 1 7 0v25a3.5 3.5 0 1 1-7 0zM13 8a4 4 0 0 1 4-4h16a4 4 0 0 1 4 4v24a4 4 0 0 1-4 4H17a4 4 0 0 1-4-4z"
    />
  </svg>
);
export default SvgTotal;
