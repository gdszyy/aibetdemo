import type { SVGProps } from "react";
const SvgSportWesternChess = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 50 50"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={2}
      strokeWidth={4.167}
      d="M41.666 45.83H8.333v-4.166l6.25-3.125h20.833l6.25 3.125zM14.583 19.79h20.833"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={2}
      strokeWidth={4.167}
      d="m28.896 19.79 5.479 18.75h-18.75l5.48-18.75"
    />
    <path
      stroke="currentColor"
      strokeWidth={4.167}
      d="M25 4.164a8.333 8.333 0 0 0-4.037 15.625h8.075A8.333 8.333 0 0 0 25 4.164Z"
    />
  </svg>
);
export default SvgSportWesternChess;
