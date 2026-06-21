import type { SVGProps } from "react";
const SvgStackOfCoins = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 60 60"
    {...props}
  >
    <path
      stroke="#E2E5EA"
      strokeWidth={3.6}
      d="M38.4 33.4c8.616 0 15.6-2.148 15.6-4.8 0-2.65-6.984-4.8-15.6-4.8s-15.6 2.15-15.6 4.8c0 2.652 6.984 4.8 15.6 4.8ZM54 39.398c0 2.652-6.984 4.8-15.6 4.8s-15.6-2.148-15.6-4.8"
    />
    <path
      stroke="#E2E5EA"
      strokeWidth={3.6}
      d="M54 28.602v21.12c0 2.916-6.984 5.28-15.6 5.28s-15.6-2.364-15.6-5.28v-21.12M21.6 16.6c8.616 0 15.6-2.149 15.6-4.8S30.216 7 21.6 7 6 9.149 6 11.8s6.984 4.8 15.6 4.8Z"
    />
    <path
      stroke="#E2E5EA"
      strokeLinecap="round"
      strokeWidth={3.6}
      d="M15.6 28.6c-4.54-.551-8.712-1.98-9.6-4.8m9.6 16.8c-4.54-.551-8.712-1.98-9.6-4.8"
    />
    <path
      stroke="#E2E5EA"
      strokeLinecap="round"
      strokeWidth={3.6}
      d="M15.6 52.6c-4.54-.551-8.712-1.982-9.6-4.8v-36m31.2 4.8v-4.8"
    />
  </svg>
);
export default SvgStackOfCoins;
