import type { SVGProps } from "react";
const SvgUcTransaction = (props: SVGProps<SVGSVGElement>) => (
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
      strokeWidth={1.5}
      d="M16 8.8v-.4c0-3.017 0-4.526-.952-5.462C14.095 2 12.564 2 9.5 2s-4.596 0-5.548.938C3.001 3.875 3 5.383 3 8.4V12c0 2.63 0 3.945.738 4.83q.202.244.45.444c.9.726 2.234.726 4.906.726M6.25 6h6.5m-6.5 3.2H9.5"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.25}
      d="m15 15.415-1.25-.458v-2.042M10 14.582a3.75 3.75 0 1 0 7.499 0 3.75 3.75 0 0 0-7.499 0"
    />
  </svg>
);
export default SvgUcTransaction;
