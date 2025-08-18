import React from "react";
import { Button, ButtonProps } from "antd";
import styles from "./PrimaryButton.module.css";

// Estendiamo i props di AntD + un opzionale text
type Props = ButtonProps & {
  text?: string;
};

export const PrimaryButton = React.forwardRef<HTMLElement, Props>(
  (
    { text, loading, disabled, style, className, onClick, children, ...rest },
    _ref,
  ) => {
    return (
      <Button
        {...rest}
        size="large"
        type="primary"
        loading={loading}
        disabled={disabled}
        style={style}
        className={`${styles.primary} ${className || ""}`}
        onClick={onClick}
      >
        {text || children}
      </Button>
    );
  },
);

PrimaryButton.displayName = "PrimaryButton";
