import type { SVGProps } from "react";
const SvgError = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fill="#E80104"
      d="M6.857 3.239a1.333 1.333 0 0 1 2.286 0l5.645 9.408a1.334 1.334 0 0 1-1.143 2.02H2.355a1.334 1.334 0 0 1-1.144-2.02zM8 11.999a.667.667 0 1 0 0 1.335.667.667 0 0 0 0-1.334m0-6.665a.85.85 0 0 0-.851.887l.157 3.78a.695.695 0 0 0 1.389 0l.157-3.78A.85.85 0 0 0 8 5.334"
    />
  </svg>
);
export default SvgError;
