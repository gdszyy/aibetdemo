import type { SVGProps } from "react";
const SvgUcSetting = (props: SVGProps<SVGSVGElement>) => (
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
      strokeWidth={1.5}
      d="M6.67 2.75h6.66c.573 0 1.097.302 1.379.783l3.33 5.69c.281.481.281 1.073 0 1.553l-3.33 5.69a1.6 1.6 0 0 1-1.379.784H6.67a1.6 1.6 0 0 1-1.379-.783l-3.33-5.69a1.54 1.54 0 0 1 0-1.553l3.33-5.69A1.6 1.6 0 0 1 6.67 2.75Z"
    />
    <circle cx={10} cy={10} r={3.4} stroke="currentColor" strokeWidth={1.2} />
  </svg>
);
export default SvgUcSetting;
