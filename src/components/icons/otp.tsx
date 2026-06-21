import type { SVGProps } from "react";
const SvgOtp = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      fill="#6D7D98"
      d="M20.91 11.12c0 4.89-3.55 9.47-8.4 10.81-.33.09-.69.09-1.02 0-4.85-1.34-8.4-5.92-8.4-10.81V6.73c0-.82.62-1.75 1.39-2.06l5.57-2.28c1.25-.51 2.66-.51 3.91 0l5.57 2.28c.76.31 1.39 1.24 1.39 2.06z"
    />
    <path
      fill="#fff"
      fillRule="evenodd"
      d="M16.515 8.395a1.2 1.2 0 0 1-.085 1.695l-4.69 4.243a1.2 1.2 0 0 1-1.61 0l-2.735-2.475a1.2 1.2 0 1 1 1.61-1.78l1.93 1.747L14.82 8.31a1.2 1.2 0 0 1 1.695.085"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgOtp;
