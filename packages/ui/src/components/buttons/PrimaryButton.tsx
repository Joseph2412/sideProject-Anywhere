import { Button, ButtonProps } from "antd";
import * as React from "react";
import styles from "./PrimaryButton.module.css";

type Props = ButtonProps & {
  text?: string;
};

const PrimaryButtonInner = (
  { text, children, ...rest }: Props,
  ref: React.Ref<HTMLButtonElement>,
) => {
  return (
    <Button {...rest} ref={ref} size="large" block className={styles.primary}>
      {text || children}
    </Button>
  );
};

// Wrapper corretto per React 19
export const PrimaryButton = React.forwardRef(PrimaryButtonInner);

PrimaryButton.displayName = "PrimaryButton";
