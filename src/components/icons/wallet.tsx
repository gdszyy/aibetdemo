import type { SVGProps } from "react";
const SvgWallet = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      stroke="#E80104"
      strokeWidth={2}
      d="M5 2h10a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3Z"
    />
    <path
      stroke="#E80104"
      strokeWidth={1.4}
      d="M11.5 7.7h6.8v4.6h-6.8a1.8 1.8 0 0 1-1.8-1.8v-1a1.8 1.8 0 0 1 1.8-1.8Z"
    />
    <circle cx={12} cy={10} r={1} fill="#E80104" />
  </svg>
);
export default SvgWallet;
