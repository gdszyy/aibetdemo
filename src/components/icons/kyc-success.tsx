import type { SVGProps } from "react";
const SvgKycSuccess = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 14 14"
    {...props}
  >
    <path
      fill="url(#kyc-success_svg__a)"
      d="M6.612.426a.525.525 0 0 1 .776 0l.835.916a.53.53 0 0 0 .547.147l1.18-.376a.525.525 0 0 1 .673.388l.265 1.21c.044.2.2.357.4.401l1.211.265a.525.525 0 0 1 .388.672l-.376 1.18a.53.53 0 0 0 .147.548l.916.835a.525.525 0 0 1 0 .776l-.916.835a.53.53 0 0 0-.147.547l.376 1.18a.525.525 0 0 1-.388.673l-1.21.265c-.2.044-.357.2-.401.4l-.265 1.211a.525.525 0 0 1-.672.388l-1.18-.376a.53.53 0 0 0-.548.147l-.835.916a.525.525 0 0 1-.776 0l-.835-.916a.53.53 0 0 0-.547-.147l-1.18.376a.525.525 0 0 1-.673-.388l-.265-1.21a.53.53 0 0 0-.4-.401L1.5 10.623a.525.525 0 0 1-.388-.672l.376-1.18a.53.53 0 0 0-.147-.548l-.916-.835a.525.525 0 0 1 0-.776l.916-.835a.53.53 0 0 0 .147-.547l-.376-1.18a.525.525 0 0 1 .388-.673l1.21-.265c.2-.044.357-.2.401-.4L3.377 1.5a.525.525 0 0 1 .672-.388l1.18.376c.196.062.41.005.548-.147z"
    />
    <path
      stroke="#fff"
      strokeLinecap="round"
      strokeWidth={1.225}
      d="m3.938 7.438 2.625 2.187M6.562 9.626l3.5-4.814"
    />
    <defs>
      <linearGradient
        id="kyc-success_svg__a"
        x1={0.525}
        x2={13.563}
        y1={0.35}
        y2={13.563}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#0FF" />
        <stop offset={1} stopColor="#0004FF" />
      </linearGradient>
    </defs>
  </svg>
);
export default SvgKycSuccess;
