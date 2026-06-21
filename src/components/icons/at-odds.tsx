import type { SVGProps } from "react";
const SvgAtOdds = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 12 12"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={1.2}
      d="M10.502 6.455V4.499A3.5 3.5 0 0 0 7.001 1h-2a3.5 3.5 0 0 0-3.5 3.5l.001 3.003A3.497 3.497 0 0 0 5 11h2.5"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={1.2}
      d="M4.002 6.501V5.5a2 2 0 1 1 4 .001v1c0 1.105-.897 2-2.002 2a2 2 0 0 1-1.998-1.999ZM8.002 8.635l.109.022a2 2 0 0 0 2.392-1.96v-.562M8.002 8.5l.001-2v-3"
    />
  </svg>
);
export default SvgAtOdds;
