import type { SVGProps } from "react";
const SvgSportBoxing = (props: SVGProps<SVGSVGElement>) => (
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
      d="M13.542 27.08h2.083a5.21 5.21 0 0 0 5.208-5.208 5.21 5.21 0 0 0-5.208-5.208h-4.167a5.21 5.21 0 0 0-5.208 5.208v9.375a6.25 6.25 0 0 0 6.25 6.25h25a6.25 6.25 0 0 0 6.25-6.25v-4.166a4.167 4.167 0 0 0-4.167-4.167H25M35.417 45.833H14.583A2.083 2.083 0 0 1 12.5 43.75V37.5h25v6.25a2.09 2.09 0 0 1-2.083 2.083"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={2}
      strokeWidth={4.167}
      d="M6.25 20.83c-1.041 0-2.083-2.083-2.083-4.166v-4.167A8.33 8.33 0 0 1 12.5 4.164h25a8.33 8.33 0 0 1 8.334 8.333v4.167a6.255 6.255 0 0 1-6.25 6.25H20.73"
    />
  </svg>
);
export default SvgSportBoxing;
