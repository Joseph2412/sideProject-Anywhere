import { Button, ButtonProps } from "antd";
import styles from "./PrimaryButton.module.css";
import React from "react";

const PrimaryButton: React.FC<ButtonProps> = (props) => {
  return (
    <Button
      type="primary"
      size="large"
      block
      className={styles.primary}
      {...props}
    >
      {props.children}
    </Button>
  );
};

export default PrimaryButton;
