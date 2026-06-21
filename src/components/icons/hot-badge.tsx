import type { SVGProps } from "react";
const SvgHotBadge = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 18 24"
    {...props}
  >
    <path
      fill="#E80104"
      d="M9 24a9.5 9.5 0 0 1-5.058-1.447c-1.491-.943-2.644-2.28-3.309-3.84a7.83 7.83 0 0 1-.417-4.907C.608 12.17 1.52 10.68 2.834 9.53 4.444 8.12 8.4 5.58 7.8 0c7.2 4.465 10.8 8.93 3.6 15.628 1.2 0 3 0 6-2.757.324.863.6 1.79.6 2.757 0 2.22-.948 4.35-2.636 5.92S11.387 24 9 24"
    />
  </svg>
);
export default SvgHotBadge;
