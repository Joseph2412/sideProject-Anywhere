import React from "react";

interface BundleIconProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  fill?: string;
  stroke?: string;
}

export const BundleIcon: React.FC<BundleIconProps> = ({
  width = 14,
  height = 16,
  className,
  fill = "none",
  stroke = "#00063E",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 14 16"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M1 3.77783H5.96533C6.20089 3.77783 6.42756 3.87117 6.59378 4.03828L11.1329 8.57739C11.8271 9.27161 11.8271 10.3969 11.1329 11.0912L8.31333 13.9107C7.61911 14.6049 6.49378 14.6049 5.79956 13.9107L1.26044 9.37161C1.09333 9.2045 1 8.97872 1 8.74317V3.77783Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.33337 1.11108H7.29871C7.53426 1.11108 7.76093 1.20442 7.92715 1.37153L13.0565 6.50086"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.11111 8.00005C4.72476 8.00005 5.22222 7.50259 5.22222 6.88894C5.22222 6.27529 4.72476 5.77783 4.11111 5.77783C3.49746 5.77783 3 6.27529 3 6.88894C3 7.50259 3.49746 8.00005 4.11111 8.00005Z"
        fill={stroke}
      />
    </svg>
  );
};

export default BundleIcon;
