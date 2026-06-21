import type { SVGProps } from "react";
const SvgTimePending = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      fill="#FFC31D"
      d="M10.667 12.518v1.381a.1.1 0 0 1-.1.1H5.433a.1.1 0 0 1-.1-.1v-1.381a.33.33 0 0 1 .157-.283l2.227-1.392a.53.53 0 0 1 .566 0l2.227 1.392a.33.33 0 0 1 .157.283"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.333}
      d="m8 8 4.083 2.78a1.33 1.33 0 0 1 .584 1.101v1.786a.333.333 0 0 1-.334.333H3.667a.333.333 0 0 1-.334-.333v-1.785a1.33 1.33 0 0 1 .584-1.103zm0 0 4.083-2.78a1.33 1.33 0 0 0 .584-1.101V2.333A.333.333 0 0 0 12.333 2H3.667a.333.333 0 0 0-.334.333v1.785a1.33 1.33 0 0 0 .584 1.103z"
    />
  </svg>
);
export default SvgTimePending;
