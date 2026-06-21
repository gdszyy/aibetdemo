import type { SVGProps } from "react";
const SvgUser = (props: SVGProps<SVGSVGElement>) => (
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
      d="M7 12h6a5 5 0 0 1 5 5 2 2 0 0 1-2 2H4a2 2 0 0 1-2-2 5 5 0 0 1 5-5ZM10 1a4 4 0 1 1 0 8 4 4 0 0 1 0-8Z"
    />
  </svg>
);
export default SvgUser;
