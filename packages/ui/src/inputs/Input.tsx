import { Input, Form } from "antd";
import { Rule } from "antd/es/form";
import { InputProps } from "antd/lib/input";
import { FormItemProps } from "antd/es/form";

type NibolInputProps = InputProps &
  FormItemProps & {
    label: string;
    name: string;
    rules?: Rule[];
    password?: boolean;
    validateTrigger?: string;
  };

export const NibolInput: React.FC<NibolInputProps> = ({
  label,
  name,
  rules = [],
  password = false,
  className,
  validateTrigger,
  ...rest
}) => {
  return (
    <Form.Item
      label={label}
      name={name}
      rules={rules}
      validateTrigger={validateTrigger}
    >
      {password ? (
        <Input.Password {...rest} size="large" className={className} />
      ) : (
        <Input {...rest} size="large" className={className} />
      )}
    </Form.Item>
  );
};
