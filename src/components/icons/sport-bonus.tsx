import type { SVGProps } from "react";
const SvgSportBonus = (props: SVGProps<SVGSVGElement>) => (
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
      strokeWidth={1.05}
      clipPath="url(#sport-bonus_svg__a)"
    >
      <path d="M1.948 9.92a5.833 5.833 0 1 0 10.104-5.835A5.833 5.833 0 0 0 1.948 9.919Z" />
      <path
        strokeLinecap="round"
        d="M9.888 12.002s-.549-3.845-1.721-5.876S4.113 2 4.113 2"
      />
      <path
        strokeLinecap="round"
        d="M12.754 7.338c-3.156-.693-7.47 2.198-8.334 4.805M9.575 1.871C8.707 4.45 4.476 7.298 1.335 6.68"
      />
    </g>
    <defs>
      <clipPath id="sport-bonus_svg__a">
        <path fill="#fff" d="M0 0h14v14H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgSportBonus;
