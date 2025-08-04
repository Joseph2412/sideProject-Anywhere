import React, { forwardRef } from 'react';
import { Button, ButtonProps } from 'antd';
import styles from './PrimaryButton.module.css';

// Estendiamo i props di AntD + un opzionale text
type Props = ButtonProps & {
  text?: string;
};

// forwardRef con tipo HTMLButtonElement in uscita, HTMLElement in entrata
const PrimaryButtonInner = (
  { text, children, ...rest }: Props,
  ref: React.Ref<HTMLButtonElement>
) => {
  return (
    <Button
      {...rest}
      ref={ref as unknown as React.Ref<HTMLElement>}
      size="large"
      block
      className={styles.primary}
    >
      {text || children}
    </Button>
  );
};

// forwardRef tipato correttamente per TypeScript + Ant Design
export const PrimaryButton = forwardRef<HTMLButtonElement, Props>(PrimaryButtonInner);
PrimaryButton.displayName = 'PrimaryButton';
