import { Input, Form } from "antd";
import { Rule } from "antd/es/form";
import { InputProps } from "antd/lib/input";

type NibolInputProps = InputProps & {
  label: string;
  name: string;
  rules?: Rule[];
  password?: boolean;
};

export const NibolInput: React.FC<NibolInputProps> = ({
  label,
  name,
  rules = [],
  password = false,
  ...rest
}) => {
  return (
    <Form.Item label={label} name={name} rules={rules}>
      {password ? (
        <Input.Password {...rest} size="large" />
      ) : (
        <Input {...rest} size="large" />
      )}
    </Form.Item>
  );
};
