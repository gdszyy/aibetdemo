import type { SVGProps } from "react";
const SvgEmojiNeutral = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="-0.5 -0.5 13 13"
    {...props}
  >
    <path
      fill="currentColor"
      d="M4.083 5.25a.583.583 0 1 0 0-1.167.583.583 0 0 0 0 1.167m0 2.333a.583.583 0 0 0 0 1.167h3.5a.583.583 0 0 0 0-1.167zm4.084-2.916a.583.583 0 1 1-1.167 0 .583.583 0 0 1 1.167 0"
    />
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M11.667 5.833A5.833 5.833 0 1 1 0 5.833a5.833 5.833 0 0 1 11.667 0m-1.167 0a4.667 4.667 0 1 1-9.334 0 4.667 4.667 0 0 1 9.334 0"
      clipRule="evenodd"
    />
  </svg>
);
export default SvgEmojiNeutral;
