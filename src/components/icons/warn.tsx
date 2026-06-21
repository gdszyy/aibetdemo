import type { SVGProps } from "react";
const SvgWarn = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 14 14"
    {...props}
  >
    <path
      fill="#AF0507"
      d="M13.948 6.974A6.974 6.974 0 1 1 0 6.974a6.974 6.974 0 0 1 13.948 0m-12.553 0a5.58 5.58 0 1 0 11.158 0 5.58 5.58 0 0 0-11.158 0"
    />
    <circle cx={6.974} cy={10.033} r={0.775} fill="#AF0507" />
    <path
      fill="#AF0507"
      d="M5.894 4.259a1.082 1.082 0 1 1 2.16 0l-.25 3.492a.832.832 0 0 1-1.66 0z"
    />
  </svg>
);
export default SvgWarn;
