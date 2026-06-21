import type { SVGProps } from "react";
const SvgMarketOverUnder = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 14 14"
    {...props}
  >
    <path
      stroke="#3C4851"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.4}
      d="M8.111 13.206a6.302 6.302 0 1 1 5.083-5.03"
    />
    <circle
      cx={9.336}
      cy={9.336}
      r={3.968}
      stroke="#3C4851"
      strokeWidth={1.4}
    />
  </svg>
);
export default SvgMarketOverUnder;
