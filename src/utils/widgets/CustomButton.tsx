import React from "react";
import styles from "@/styles/CustomButton.module.css";

interface CustomButtonProps {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
  width?: string;
  height?: string;
  bgColor?: string;
  textColor?: string;
  disabled?: boolean;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  label,
  icon,
  onClick,
  width = "w-[12rem]",
  height = "min-h-[3rem]",
  bgColor = "bg-purple-600",
  textColor = "text-white",
  disabled = false,
}) => {
  return (
    <button
      type="button"
      onClick={!disabled ? onClick : undefined}
      className={`${width} ${height} ${bgColor} ${textColor} ${styles.button} ${
        disabled ? styles.disabled : ""
      }`}
      disabled={disabled}
    >
      <span className="flex items-center">{icon}</span>
      <p className="font-semibold">{label}</p>
    </button>
  );
};

export default CustomButton;
