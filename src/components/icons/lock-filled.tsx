import type { SVGProps } from "react";
const SvgLockFilled = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fill="currentColor"
      d="M12.375 6A2.625 2.625 0 0 1 15 8.625v3.75A2.625 2.625 0 0 1 12.375 15h-8.75A2.625 2.625 0 0 1 1 12.375v-3.75A2.625 2.625 0 0 1 3.625 6zM8 9.125a.875.875 0 0 0-.875.875v.625a.875.875 0 0 0 1.75 0V10A.875.875 0 0 0 8 9.125"
    />
    <path
      stroke="currentColor"
      strokeWidth={1.4}
      d="M4.2 5a3.3 3.3 0 0 1 3.3-3.3h1A3.3 3.3 0 0 1 11.8 5v2.737H4.2z"
    />
  </svg>
);
export default SvgLockFilled;
