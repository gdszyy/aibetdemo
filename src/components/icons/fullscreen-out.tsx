import type { SVGProps } from "react";
const SvgFullscreenOut = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <rect
      width={17}
      height={17}
      x={4}
      y={3.5}
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.2}
      rx={4}
    />
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M13.808 10.692h3.27m-3.27 0V7.423m0 3.27 3.923-3.924m-6.539 6.539H7.924m3.27 0v3.269m0-3.27-3.924 3.924"
    />
  </svg>
);
export default SvgFullscreenOut;
