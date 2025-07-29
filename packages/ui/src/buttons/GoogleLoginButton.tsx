import { Button } from "antd";
import type { ButtonProps } from "antd";

type Props = ButtonProps & {
  inconSrc?: string;
};

export const GoogleLoginButton = ({
  className,
  inconSrc = "/google-logo.png",
  ...rest
}: Props) => (
  <Button
    icon={
      <img
        src={inconSrc}
        alt="Google"
        width={20}
        height={20}
        style={{ marginRight: 8 }}
      />
    }
    size="large"
    block
    className={className}
    {...rest}
  >
    Continua con Google
  </Button>
);
