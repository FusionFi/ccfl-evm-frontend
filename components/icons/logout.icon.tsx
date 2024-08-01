import type { SvgProps } from 'antd';
import { twMerge } from 'tailwind-merge';

export const LogoutIcon = ({ className }: SvgProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        opacity="0.4"
        d="M6 2H5.2C4.0799 2 3.51984 2 3.09202 2.21799C2.7157 2.40973 2.40973 2.71569 2.21799 3.09202C2 3.51984 2 4.07989 2 5.2V10.8C2 11.9201 2 12.4802 2.21799 12.908C2.40973 13.2843 2.71569 13.5903 3.09202 13.782C3.51984 14 4.0799 14 5.2 14H6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6667 11.3337L14 8.00033M14 8.00033L10.6667 4.66699M14 8.00033H6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
