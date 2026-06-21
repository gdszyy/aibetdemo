import type { SVGProps } from "react";
const SvgMarketFault = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 14 14"
    {...props}
  >
    <g clipPath="url(#market-fault_svg__a)">
      <path
        stroke="#3C4851"
        strokeWidth={1.4}
        d="M2.917.702a2.273 2.273 0 0 1 2.218 2.272v9.543a.787.787 0 0 1-.787.787h-2.86a.787.787 0 0 1-.788-.787V2.974C.7 1.737 1.688.732 2.917.702Z"
      />
      <path
        fill="#3C4851"
        d="M9.998 6.126a.584.584 0 0 0 1.01 0l2.022-3.5a.584.584 0 0 0-.505-.876H8.482c-.45 0-.73.486-.505.875zM9.998 7.877a.584.584 0 0 1 1.01 0l2.022 3.501a.583.583 0 0 1-.505.875H8.482a.583.583 0 0 1-.505-.875z"
      />
    </g>
    <defs>
      <clipPath id="market-fault_svg__a">
        <path fill="#fff" d="M0 0h14.004v14.004H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgMarketFault;
