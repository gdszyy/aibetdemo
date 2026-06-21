import type { SVGProps } from "react";
const SvgFullscreenIn = (props: SVGProps<SVGSVGElement>) => (
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
      x={3.5}
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
      d="M17.23 17.23h-3.269m3.27 0v-3.269m0 3.27-3.924-3.923M6.77 6.769h3.27m-3.27 0v3.27m0-3.27 3.923 3.923"
    />
  </svg>
);
export default SvgFullscreenIn;
