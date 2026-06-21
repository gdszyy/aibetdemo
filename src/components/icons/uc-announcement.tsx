import type { SVGProps } from "react";
const SvgUcAnnouncement = (props: SVGProps<SVGSVGElement>) => (
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
      strokeWidth={1.5}
      d="M1.75 9.153c0-1.306.983-2.434 2.312-2.666 1.66-.289 3.737-.723 5.207-1.287 1.963-.753 4.066-2.186 5.47-3.238a.32.32 0 0 1 .338-.024c.118.056.173.149.173.25V15.73c0 .1-.055.198-.183.257a.34.34 0 0 1-.359-.027c-1.394-1.07-3.476-2.5-5.469-3.17-1.404-.474-3.344-.756-4.949-.924-1.434-.15-2.54-1.327-2.54-2.713Z"
    />
    <path
      stroke="currentColor"
      strokeWidth={1.5}
      d="M2.5 11c1.36 3.172 1.487 2.648 2.19 5.87A1.43 1.43 0 0 0 6.083 18c.783 0 1.417-.634 1.417-1.417V5.5"
    />
    <path
      stroke="currentColor"
      strokeWidth={1.2}
      d="M15.5 6.5c3.039.281 3.039 4.719 0 5"
    />
  </svg>
);
export default SvgUcAnnouncement;
