import type { SVGProps } from "react";
const SvgPhoneOff = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <g clipPath="url(#phone-off_svg__a)">
      <path
        fill="#C4C4C4"
        d="M5.554 10.607c-.004 1.444.175 2.52-2.698 2.83-2.875.31-2.498-1.766-2.494-3.167.005-1.617 3.79-3.857 9.742-3.853 5.95.007 9.72 2.256 9.714 3.87-.004 1.402.36 3.478-2.513 3.164-2.872-.316-2.684-1.391-2.68-2.835.005-1.01-2.327-1.235-4.53-1.237-2.207-.002-4.537.22-4.54 1.228"
      />
    </g>
    <defs>
      <clipPath id="phone-off_svg__a">
        <path fill="#fff" d="M20 0H0v20h20z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgPhoneOff;
