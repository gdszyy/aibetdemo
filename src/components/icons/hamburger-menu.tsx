import type { SVGProps } from "react";
const SvgHamburgerMenu = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={2}
      d="M1 1h14M2 8h12M1 15h14"
    />
  </svg>
);
export default SvgHamburgerMenu;
