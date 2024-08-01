import type { SvgProps } from "antd";
import { twMerge } from "tailwind-merge";

export const CoinOutlinedIcon = ({ className }: SvgProps) => {
  const defaultClassName = "w-4 h-4";

  return (
    <svg
      className={twMerge(defaultClassName, className)}
      fill="none"
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_604_244)">
        <path
          d="M15.3327 6.03841C15.3327 3.20315 13.026 0.896484 10.1908 0.896484C8.05899 0.896484 6.22622 2.20054 5.44786 4.05279H0.666016V15.1387H10.9483V11.1244C13.4257 10.757 15.3327 8.61631 15.3327 6.03841ZM6.94762 10.0254C7.80856 10.727 8.8999 11.1558 10.0889 11.179V11.7227H1.52539V10.0254H6.94762ZM1.52539 9.16607V7.4688H5.25147C5.43197 8.09106 5.72715 8.66488 6.11242 9.16607H1.52539ZM5.17337 4.91216C5.09202 5.27482 5.04883 5.65158 5.04883 6.03841C5.04883 6.23143 5.05991 6.42189 5.08072 6.60943H1.52539V4.91216H5.17337ZM1.52539 14.2793V12.5821H10.0889V14.2793H1.52539ZM10.1908 10.321C7.82938 10.321 5.9082 8.39979 5.9082 6.03841C5.9082 3.67703 7.82938 1.75586 10.1908 1.75586C12.5521 1.75586 14.4733 3.67703 14.4733 6.03841C14.4733 8.39979 12.5521 10.321 10.1908 10.321Z"
          fill="currentColor"
        />
        <path
          d="M10.1914 2.84863C8.43268 2.84863 7.00195 4.27936 7.00195 6.03806C7.00195 7.79675 8.43268 9.22748 10.1914 9.22748C11.9501 9.22748 13.3808 7.79675 13.3808 6.03806C13.3808 4.27947 11.9501 2.84863 10.1914 2.84863ZM10.1914 8.3681C8.90657 8.3681 7.86133 7.32287 7.86133 6.03806C7.86133 4.75324 8.90657 3.70801 10.1914 3.70801C11.4762 3.70801 12.5214 4.75324 12.5214 6.03806C12.5214 7.32287 11.4762 8.3681 10.1914 8.3681Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_604_244">
          <rect
            width="14.6667"
            height="14.6667"
            fill="white"
            transform="translate(0.666016 0.666992)"
          />
        </clipPath>
      </defs>
    </svg>
  );
};
