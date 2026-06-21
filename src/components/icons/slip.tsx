import type { SVGProps } from "react";
const SvgSlip = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth={2.285}
      d="M2.814 2.29a1.34 1.34 0 0 1 1.328-1.106h11.716a1.34 1.34 0 0 1 1.328 1.106c.296 1.703.814 5.019.814 7.394 0 3.327-1.016 8.5-1.016 8.5l-3.492-2.594L10 18.184 6.508 15.59l-3.492 2.594S2 13.01 2 9.684c0-2.375.518-5.691.814-7.394Z"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={2.285}
      d="M7.143 6.041h5.714M7.143 11.041h5.714"
    />
  </svg>
);
export default SvgSlip;
