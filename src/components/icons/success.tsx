import type { SVGProps } from "react";
const SvgSuccess = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 14 14"
    {...props}
  >
    <path
      fill="#1A7F1E"
      d="M14 7A7 7 0 1 1 0 7a7 7 0 0 1 14 0M1.4 7a5.6 5.6 0 1 0 11.2 0A5.6 5.6 0 0 0 1.4 7"
    />
    <path
      stroke="#1A7F1E"
      strokeLinecap="round"
      strokeWidth={1.4}
      d="m3.605 7.735 2.38 1.785M6.049 9.513l4.339-5.062"
    />
  </svg>
);
export default SvgSuccess;
