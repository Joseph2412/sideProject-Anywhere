import { Button, ButtonProps } from "antd";
import styles from "./PrimaryButton.module.css";
import React from "react";

type PrimaryButtonProps = ButtonProps & {
  text: string;
};

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  text,
  children,
  ...rest
}) => {
  return (
    <Button size="large" block className={styles.primary} {...rest}>
      {text || children}
    </Button>
  );
};
