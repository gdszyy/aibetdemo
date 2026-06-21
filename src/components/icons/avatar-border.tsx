import type { SVGProps } from "react";
const SvgAvatarBorder = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 48 48"
    {...props}
  >
    <circle
      cx={24}
      cy={24}
      r={23.5}
      fill="transparent"
      stroke="url(#avatar-border_svg__a)"
    />
    <defs>
      <linearGradient
        id="avatar-border_svg__a"
        x1={1.8}
        x2={46.5}
        y1={1.2}
        y2={46.5}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFEA00" />
        <stop offset={1} stopColor="red" />
      </linearGradient>
    </defs>
  </svg>
);
export default SvgAvatarBorder;
