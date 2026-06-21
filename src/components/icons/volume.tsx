import type { SVGProps } from "react";
const SvgVolume = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 22 22"
    {...props}
  >
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeWidth={1.375}
      d="M19.984 7.332a37 37 0 0 1 0 7.333M16.387 8.25a33.5 33.5 0 0 1 0 5.5"
    />
    <path
      fill="#fff"
      stroke="#fff"
      strokeLinejoin="round"
      strokeWidth={0.917}
      d="M11.918 11c0-2.33-.197-4.61-.575-6.824-.113-.664-.89-.956-1.426-.548L6.91 5.912a1.83 1.83 0 0 1-1.11.374H2.752c-1.012 0-1.833.82-1.833 1.833v5.762c0 1.012.82 1.833 1.833 1.833h3.05c.4 0 .79.131 1.109.374l3.007 2.284c.537.408 1.313.116 1.426-.548A40.6 40.6 0 0 0 11.918 11Z"
    />
  </svg>
);
export default SvgVolume;
