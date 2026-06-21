import type { SVGProps } from "react";
const SvgNoticeIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      stroke="#2A303C"
      strokeLinejoin="round"
      strokeWidth={1.75}
      d="M17.501 6.25h-15a.833.833 0 0 0-.833.833v9.167c0 .46.373.833.833.833h15c.46 0 .834-.373.834-.833V7.083a.833.833 0 0 0-.834-.833Z"
    />
    <path
      stroke="#2A303C"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.75}
      d="M5 10.002h7.5M5 13.336h3.333M6.25 6.252 8 3.92a2.5 2.5 0 0 1 4 0l1.75 2.334z"
    />
  </svg>
);
export default SvgNoticeIcon;
