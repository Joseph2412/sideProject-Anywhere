import React from 'react';

interface CalendarIconProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  fill?: string;
  stroke?: string;
}

export const CalendarIcon: React.FC<CalendarIconProps> = ({
  width = 14,
  height = 15,
  className,
  fill = 'none',
  stroke = '#00063E',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 14 15"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M4.11108 2.44453V0.666748"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.88892 2.44453V0.666748"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.2222 2.44458H2.77778C1.79594 2.44458 1 3.24052 1 4.22236V11.7779C1 12.7598 1.79594 13.5557 2.77778 13.5557H11.2222C12.2041 13.5557 13 12.7598 13 11.7779V4.22236C13 3.24052 12.2041 2.44458 11.2222 2.44458Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1 5.55566H13"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.22217 8.22241H6.11106"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.3334 8.22241H10.7778"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.88892 10.8889H9.88892"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CalendarIcon;
