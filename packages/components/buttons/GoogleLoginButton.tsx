import { Button } from 'antd';
import * as React from 'react';
import styles from './GoogleLoginButton.module.css';

type GoogleLoginButtonProps = React.ComponentProps<typeof Button> & {
  iconSrc?: string;
};

export const GoogleLoginButton = React.forwardRef<HTMLButtonElement, GoogleLoginButtonProps>(
  ({ className, iconSrc = '/google-logo.svg', children, ...rest }, ref) => {
    return (
      <Button
        icon={<img src={iconSrc} alt="Google" width={20} height={20} style={{ marginRight: 8 }} />}
        size="large"
        block
        ref={ref as React.Ref<HTMLButtonElement>}
        className={`${styles.googleButton} ${className ?? ''}`}
        {...rest}
      >
        {children || 'Continua con Google'}
      </Button>
    );
  }
);

// Optional per debug/devtools
GoogleLoginButton.displayName = 'GoogleLoginButton';
