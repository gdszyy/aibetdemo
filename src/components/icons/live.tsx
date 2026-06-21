import type { SVGProps } from "react";
const SvgLive = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    fill="none"
    viewBox="0 0 16 16"
    {...props}
  >
    <path
      stroke="currentColor"
      strokeWidth={1.44}
      d="M3.367 3.919h6.698c2.493 0 4.415 1.854 4.415 4.023v.914c0 2.17-1.922 4.023-4.415 4.023H3.367c-1.075 0-1.847-.792-1.847-1.652V5.57c0-.859.772-1.651 1.847-1.651Z"
    />
    <path
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={1.2}
      d="M6.052 6.315a.2.2 0 0 1 .156-.013l3.048 1.717.023.012.024.011c.28.127.333.298.333.385s-.053.257-.333.384l-.01.004-.011.006-3.072 1.534a.2.2 0 0 1-.158-.012q-.01-.007-.016-.012V6.326z"
    />
  </svg>
);
export default SvgLive;
