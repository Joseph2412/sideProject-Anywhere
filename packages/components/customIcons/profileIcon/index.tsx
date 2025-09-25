import React from "react";

interface ProfileIconProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  fill?: string;
  stroke?: string;
}

export const ProfileIcon: React.FC<ProfileIconProps> = ({
  width = 16,
  height = 16,
  className,
  fill = "none",
  stroke = "#00063E",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7.99995 8.66688C8.98179 8.66688 9.77772 7.87095 9.77772 6.88911C9.77772 5.90727 8.98179 5.11133 7.99995 5.11133C7.01811 5.11133 6.22217 5.90727 6.22217 6.88911C6.22217 7.87095 7.01811 8.66688 7.99995 8.66688Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.5813 13.464C5.00708 11.9769 6.37597 10.8889 7.99997 10.8889C9.62397 10.8889 10.9929 11.9769 11.4186 13.464"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.99999 14.4446C11.5592 14.4446 14.4444 11.5593 14.4444 8.00011C14.4444 4.44094 11.5592 1.55566 7.99999 1.55566C4.44082 1.55566 1.55554 4.44094 1.55554 8.00011C1.55554 11.5593 4.44082 14.4446 7.99999 14.4446Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ProfileIcon;
