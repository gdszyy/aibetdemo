import type { SVGProps } from "react";
const SvgCorner = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 14 14"
    {...props}
  >
    <g clipPath="url(#corner_svg__a)">
      <path fill="#CCC" d="M1.232 14h.777V6.16h-.777z" />
      <g filter="url(#corner_svg__b)">
        <path
          fill="#1D2129"
          d="M.574 13.566c0 .238.189.427.427.427l12.019-.084c.371 0 .56-.448.308-.714-1.323-1.407-4.536-4.41-7.882-4.473a.4.4 0 0 0-.28.105c-.672.595-3.92 3.493-4.529 4.522a.4.4 0 0 0-.063.217"
        />
      </g>
      <g filter="url(#corner_svg__c)">
        <path fill="#EB3333" d="M1.232 0v6.398L9.19 6.37z" />
      </g>
      <path
        fill="#fff"
        d="M11.354 13.46H2.009c-.217 0-.329-.104-.434-.28a.49.49 0 0 1 .021-.545l3.668-2.828.462.497-3.332 2.47h8.967v.687z"
      />
      <path
        fill="#fff"
        d="M6.11 13.21c-.35-1.163-.965-1.982-2.26-2.22l.539-.455c1.49.504 1.757 1.12 2.443 2.492z"
      />
    </g>
    <defs>
      <filter
        id="corner_svg__b"
        width={14.569}
        height={6.271}
        x={-1.126}
        y={7.722}
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
        <feGaussianBlur stdDeviation={0.85} />
        <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
        <feColorMatrix values="0 0 0 0 0.935622 0 0 0 0 0.935622 0 0 0 0 0.935622 0 0 0 1 0" />
        <feBlend in2="shape" result="effect1_innerShadow_4013_106745" />
      </filter>
      <filter
        id="corner_svg__c"
        width={9.959}
        height={7.398}
        x={-0.768}
        y={-1}
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
        <feBlend in2="shape" result="effect1_innerShadow_4013_106745" />
      </filter>
      <clipPath id="corner_svg__a">
        <path fill="#fff" d="M0 0h14v14H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgCorner;
