import React from 'react';

interface VenueIconProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  fill?: string;
  stroke?: string;
}

export const VenueIcon: React.FC<VenueIconProps> = ({
  width = 16,
  height = 14,
  className,
  fill = 'none',
  stroke = '#00063E',
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 14"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7.33337 12.5554V9.88875C7.33337 9.1524 7.93035 8.55542 8.66671 8.55542C9.40306 8.55542 10 9.1524 10 9.88875V12.5554"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.4444 12.5554H1.55554"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.6666 4.69336V12.5556"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.33337 12.5556V1.97339"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M1.55554 1.45508L14.4444 5.21152"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.22226 6.99995C6.71293 6.99995 7.11115 6.60172 7.11115 6.11106C7.11115 5.62039 6.71293 5.22217 6.22226 5.22217C5.7316 5.22217 5.33337 5.62039 5.33337 6.11106C5.33337 6.60172 5.7316 6.99995 6.22226 6.99995Z"
        fill={stroke}
      />
    </svg>
  );
};

export default VenueIcon;
