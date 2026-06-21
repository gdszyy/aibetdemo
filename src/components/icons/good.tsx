import type { SVGProps } from "react";
const SvgGood = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 31 31"
    {...props}
  >
    <g filter="url(#good_svg__a)">
      <path
        fill="#E80104"
        d="M9.676 12.185v10.497c0 .348-.136.681-.379.927a1.29 1.29 0 0 1-.915.385H5.794c-.343 0-.672-.139-.915-.385a1.32 1.32 0 0 1-.379-.927v-9.185c0-.348.136-.682.379-.928s.572-.384.915-.384zm0 0a5.14 5.14 0 0 0 3.66-1.537C14.309 9.663 15 8.392 15 7V5.5c0-.696.126-1.24.611-1.731A2.57 2.57 0 0 1 17.441 3a2.57 2.57 0 0 1 1.83.769C19.757 4.26 20 5.304 20 6v.779c0 .81-.1 1.619-.296 2.406a9 9 0 0 1-.554 1.579l-.65 1.42h5.412a2.57 2.57 0 0 1 1.83.77c.485.491.758 1.159.758 1.855l-1.294 6.56c-.186.805-.54 1.497-1.006 1.97-.467.473-1.022.703-1.582.655h-9.06a3.86 3.86 0 0 1-2.744-1.153 3.96 3.96 0 0 1-1.138-2.784"
      />
      <path
        stroke="#E80104"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.676 12.185v10.497c0 .348-.136.681-.379.927a1.29 1.29 0 0 1-.915.385H5.794c-.343 0-.672-.139-.915-.385a1.32 1.32 0 0 1-.379-.927v-9.185c0-.348.136-.682.379-.928s.572-.384.915-.384zm0 0a5.14 5.14 0 0 0 3.66-1.537C14.309 9.663 15 8.392 15 7V5.5c0-.696.126-1.24.611-1.731A2.57 2.57 0 0 1 17.441 3a2.57 2.57 0 0 1 1.83.769C19.757 4.26 20 5.304 20 6v.779c0 .81-.1 1.619-.296 2.406a9 9 0 0 1-.554 1.579l-.65 1.42h5.412a2.57 2.57 0 0 1 1.83.77c.485.491.758 1.159.758 1.855l-1.294 6.56c-.186.805-.54 1.497-1.006 1.97-.467.473-1.022.703-1.582.655h-9.06a3.86 3.86 0 0 1-2.744-1.153 3.96 3.96 0 0 1-1.138-2.784"
      />
    </g>
    <defs>
      <filter
        id="good_svg__a"
        width={31}
        height={30}
        x={0}
        y={0.5}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dy={2} />
        <feGaussianBlur stdDeviation={2} />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix values="0 0 0 0 1 0 0 0 0 0.588235 0 0 0 0 0.592157 0 0 0 1 0" />
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_78_10506"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_78_10506"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);
export default SvgGood;
