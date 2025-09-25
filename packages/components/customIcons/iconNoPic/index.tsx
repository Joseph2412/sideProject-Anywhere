import React from "react";

interface IconNoPicProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  fill?: string;
}

export const IconNoPic: React.FC<IconNoPicProps> = ({
  width = 32,
  height = 32,
  className,
  fill = "white",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M16 18.6667C18.7001 18.6667 20.8889 16.4778 20.8889 13.7778C20.8889 11.0777 18.7001 8.88888 16 8.88888C13.2999 8.88888 11.1111 11.0777 11.1111 13.7778C11.1111 16.4778 13.2999 18.6667 16 18.6667Z"
        fill={fill}
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.77777 16C1.77777 23.8418 8.15822 30.2222 16 30.2222C23.8418 30.2222 30.2222 23.8418 30.2222 16C30.2222 8.15822 23.8418 1.77777 16 1.77777C8.15822 1.77777 1.77777 8.15822 1.77777 16ZM4.44444 16C4.44444 9.62844 9.62844 4.44444 16 4.44444C22.3715 4.44444 27.5555 9.62844 27.5555 16C27.5555 19.5592 25.9379 22.7479 23.3992 24.8693C21.9484 22.2004 19.1261 20.4444 16 20.4444C12.8683 20.4444 10.0401 22.2073 8.597 24.8662C6.06049 22.7447 4.44444 19.5575 4.44444 16Z"
        fill={fill}
      />
    </svg>
  );
};

export default IconNoPic;
