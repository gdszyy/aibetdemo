import type { SVGProps } from "react";
const SvgFreeSpin = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 14 14"
    {...props}
  >
    <g
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.05}
      clipPath="url(#free-spin_svg__a)"
    >
      <path d="M7 5.832H2.333c-.644 0-1.166.522-1.166 1.167v4.666c0 .645.522 1.167 1.166 1.167H7c.644 0 1.167-.522 1.167-1.167V7c0-.645-.523-1.167-1.167-1.167M10.453 8.166l2.042-2.042a1.307 1.307 0 0 0 0-1.75l-2.917-2.87a1.307 1.307 0 0 0-1.75 0L5.833 3.5m-2.333 7h.006m2.327-2.333h.006M8.75 3.499h.006M10.5 5.25h.006" />
    </g>
    <defs>
      <clipPath id="free-spin_svg__a">
        <path fill="#fff" d="M0 0h14v14H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgFreeSpin;
