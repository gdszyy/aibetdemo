import type { SVGProps } from "react";
const SvgScheduledTime = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeWidth={1.44}
      d="M14.48 4.354v6.14c0 1.007-.569 1.987-1.623 2.742-1.052.755-2.544 1.244-4.224 1.244H7.367c-1.68 0-3.172-.489-4.224-1.244-1.054-.755-1.623-1.735-1.623-2.743v-6.14c0-.865.84-1.633 1.68-1.633h9.6c.84 0 1.68.768 1.68 1.634Z"
    />
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth={1.234}
      d="M5.017 1.418v2.366M11.016 1.418v2.366M1.417 6.184h13.166M3.817 8.582h8.366M5.017 10.983h5.966"
    />
  </svg>
);
export default SvgScheduledTime;
