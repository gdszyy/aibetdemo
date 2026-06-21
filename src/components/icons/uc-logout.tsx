import type { SVGProps } from "react";
const SvgUcLogout = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 20 20"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M11.167 3.667H9.486c-1.585 0-2.378 0-2.87.488-.274.272-.396.637-.45 1.178m5 11.667h-1.68c-1.585 0-2.378 0-2.87-.488-.274-.272-.396-.637-.45-1.179m-3.333-5h5.834M4.083 8.25S2 9.783 2 10.333s2.083 2.084 2.083 2.084m12.59-8.75C17 4.18 17 4.844 17 6.17v8.328c0 1.326 0 1.99-.328 2.502a2 2 0 0 1-.195.26c-.403.455-1.041.637-2.317 1.002s-1.917.547-2.38.274a1.3 1.3 0 0 1-.223-.169c-.39-.37-.39-1.034-.39-2.364V4.664c0-1.33 0-1.994.39-2.364q.103-.096.223-.168c.463-.274 1.103-.092 2.38.274 1.276.364 1.914.547 2.317 1.002q.108.121.195.259"
    />
  </svg>
);
export default SvgUcLogout;
