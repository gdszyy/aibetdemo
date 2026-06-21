import type { SVGProps } from "react";
const SvgI18N = (props: SVGProps<SVGSVGElement>) => (
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
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M1.667 17.916h16.666"
    />
    <path
      stroke="currentColor"
      strokeWidth={1.667}
      d="M2.5 8.333S6.272 7.5 10 7.5s7.5.833 7.5.833M2.083 12.5s3.75.833 7.917.833 7.917-.833 7.917-.833"
    />
    <path
      stroke="currentColor"
      strokeWidth={2}
      d="M10 2.5a8.333 8.333 0 0 0-8.333 8.333c0 3.254 1.448 5.711 4.166 7.084h8.334c2.719-1.373 4.166-3.83 4.166-7.084A8.333 8.333 0 0 0 10 2.5Z"
    />
    <path
      stroke="currentColor"
      strokeWidth={1.667}
      d="M10 2.5c-1.61 0-2.917 3.731-2.917 8.333 0 2.99.422 5.614 1.25 7.084h3.334c.828-1.47 1.25-4.093 1.25-7.084C12.917 6.231 11.61 2.5 10 2.5Z"
    />
  </svg>
);
export default SvgI18N;
