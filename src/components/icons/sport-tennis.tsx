import type { SVGProps } from "react";
const SvgSportTennis = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <g clipPath="url(#sport-tennis_svg__a)">
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M4.516 2.015c4.41-3.028 10.44-1.909 13.466 2.5l.274.422c2.684 4.365 1.5 10.115-2.771 13.047q-.171.114-.345.223c-5.39-9.47-.3-16.513-.258-16.572l-.413-.229c-4.87 6.957-.405 17.109-.303 17.338a9.684 9.684 0 0 1-12.056-3.13C3.288 13.517 6.34 7.37 5.32 1.521l-.562.385s2.456 2.005-3.08 13.044C-.919 10.601.28 4.924 4.515 2.015"
        clipRule="evenodd"
      />
    </g>
    <defs>
      <clipPath id="sport-tennis_svg__a">
        <path fill="#fff" d="M0 0h20v20H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgSportTennis;
