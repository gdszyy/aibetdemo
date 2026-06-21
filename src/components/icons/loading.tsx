import type { SVGProps } from "react";
const SvgLoading = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <g clipPath="url(#loading_svg__a)" data-figma-skip-parse="true">
      <foreignObject
        width={2200}
        height={2200}
        x={-1100}
        y={-1100}
        transform="matrix(.01 0 0 .01 10 10)"
      >
        <div
          style={{
            background:
              "conic-gradient(from 90deg,rgba(255,255,255,0) 0deg,#e80104 360deg)",
            height: "100%",
            width: "100%",
            opacity: 1,
          }}
        />
      </foreignObject>
    </g>
    <path
      d="M20 10c0 5.523-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0s10 4.477 10 10M3 10a7 7 0 1 0 14 0 7 7 0 0 0-14 0"
      data-figma-gradient-fill='{"type":"GRADIENT_ANGULAR","stops":[{"color":{"r":1.0,"g":1.0,"b":1.0,"a":0.0},"position":0.0},{"color":{"r":0.90980392694473267,"g":0.0039215688593685627,"b":0.015686275437474251,"a":1.0},"position":1.0}],"stopsVar":[{"color":{"r":1.0,"g":1.0,"b":1.0,"a":0.0},"position":0.0},{"color":{"r":0.90980392694473267,"g":0.0039215688593685627,"b":0.015686275437474251,"a":1.0},"position":1.0}],"transform":{"m00":20.0,"m01":1.3445140996642263e-13,"m02":-1.3322676295501878e-13,"m10":8.3152302860108052e-14,"m11":20.0,"m12":-8.6597395920762210e-14},"opacity":1.0,"blendMode":"NORMAL","visible":true}'
    />
    <path fill="#E80104" d="M20 10a1.5 1.5 0 1 1-3 0h3" />
    <defs>
      <clipPath id="loading_svg__a">
        <path d="M20 10c0 5.523-4.477 10-10 10S0 15.523 0 10 4.477 0 10 0s10 4.477 10 10M3 10a7 7 0 1 0 14 0 7 7 0 0 0-14 0" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgLoading;
