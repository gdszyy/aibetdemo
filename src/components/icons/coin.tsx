import type { SVGProps } from "react";
const SvgCoin = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 17 17"
    {...props}
  >
    <path
      fill="#FFC31D"
      stroke="#F80"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.667}
      d="M.833 8.334a7.5 7.5 0 1 0 15 0 7.5 7.5 0 0 0-15 0"
    />
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M10.667 5.837a1.67 1.67 0 0 0-1.5-.834H7.5a1.667 1.667 0 1 0 0 3.334h1.667a1.666 1.666 0 1 1 0 3.333H7.5a1.67 1.67 0 0 1-1.5-.833M8.334 4.17v8.333"
    />
  </svg>
);
export default SvgCoin;
