import type { SVGProps } from "react";
const SvgBack = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke="#99A4B7"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M6.5 4 3 7l3.5 3.5"
    />
    <path
      stroke="#99A4B7"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={3}
      d="M3 7h11.497c3.441 0 6.364 2.81 6.498 6.25.142 3.635-2.861 6.75-6.498 6.75H5.999"
    />
  </svg>
);
export default SvgBack;
