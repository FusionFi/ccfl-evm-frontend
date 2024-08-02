import type { SvgProps } from 'antd';

export const CloseIcon = ({ className }: SvgProps) => {
  function guidGenerator() {
    var S4 = function () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
  }
  const id = guidGenerator();
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8.8095 8L12.9111 3.11094C12.9798 3.02969 12.922 2.90625 12.8158 2.90625H11.5689C11.4954 2.90625 11.4251 2.93906 11.3767 2.99531L7.99388 7.02813L4.61106 2.99531C4.56419 2.93906 4.49388 2.90625 4.41888 2.90625H3.172C3.06575 2.90625 3.00794 3.02969 3.07669 3.11094L7.17825 8L3.07669 12.8891C3.06129 12.9072 3.05141 12.9293 3.04822 12.9529C3.04503 12.9764 3.04867 13.0004 3.05871 13.022C3.06874 13.0435 3.08475 13.0617 3.10483 13.0745C3.12492 13.0872 3.14823 13.0939 3.172 13.0938H4.41888C4.49231 13.0938 4.56263 13.0609 4.61106 13.0047L7.99388 8.97188L11.3767 13.0047C11.4236 13.0609 11.4939 13.0938 11.5689 13.0938H12.8158C12.922 13.0938 12.9798 12.9703 12.9111 12.8891L8.8095 8Z"
        fill={`url(#paint0_linear_767_9_${id})`}
      />
      <defs>
        <linearGradient
          id={`paint0_linear_767_9_${id}`}
          x1="3.04688"
          y1="10.278"
          x2="12.9409"
          y2="10.278"
          gradientUnits="userSpaceOnUse">
          <stop stopColor="#7D4899" />
          <stop offset="1" stopColor="#5498CD" />
        </linearGradient>
      </defs>
    </svg>
  );
};
