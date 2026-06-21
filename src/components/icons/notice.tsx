import type { SVGProps } from "react";
const SvgNotice = (props: SVGProps<SVGSVGElement>) => (
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
      strokeWidth={2}
      d="M12.063 17c0 1.105-.62 2-2 2-1.381 0-2-.895-2-2M9.435 5h1.258a5 5 0 0 1 4.997 5.168l-.073 2.191a5.3 5.3 0 0 0 1.183 3.519c.017.02.018.032.018.037q.003.014-.008.042a.1.1 0 0 1-.028.034c-.004.003-.013.009-.04.009H3.301l-.026-.003-.007-.004a.1.1 0 0 1-.022-.028.1.1 0 0 1-.008-.036l.002-.008.015-.02a5.24 5.24 0 0 0 1.253-3.578l-.071-2.159A5 5 0 0 1 9.435 5Z"
    />
    <path
      stroke="currentColor"
      strokeWidth={2}
      d="M10.063 1a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z"
    />
  </svg>
);
export default SvgNotice;
