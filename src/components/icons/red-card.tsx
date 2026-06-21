import type { SVGProps } from "react";
const SvgRedCard = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 14 14"
    {...props}
  >
    <g clipPath="url(#red-card_svg__a)" filter="url(#red-card_svg__b)">
      <path
        fill="#EB3333"
        d="M5.15.267h6.06c1.515 0 2.61 1.346 2.272 2.945l-1.262 7.576c-.253 1.599-1.767 2.945-3.283 2.945h-6.06c-1.515 0-2.609-1.346-2.272-2.945l1.262-7.576C2.12 1.613 3.551.267 5.15.267"
      />
    </g>
    <defs>
      <clipPath id="red-card_svg__a">
        <path fill="#fff" d="M0 0h14v14H0z" />
      </clipPath>
      <filter
        id="red-card_svg__b"
        width={15}
        height={14.467}
        x={-1.456}
        y={-0.733}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dx={-2} dy={-1} />
        <feGaussianBlur stdDeviation={1.5} />
        <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
        <feColorMatrix values="0 0 0 0 1 0 0 0 0 0.49067 0 0 0 0 0.454289 0 0 0 1 0" />
        <feBlend in2="shape" result="effect1_innerShadow_4013_106751" />
      </filter>
    </defs>
  </svg>
);
export default SvgRedCard;
