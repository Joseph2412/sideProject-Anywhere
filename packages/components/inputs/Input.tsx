import { Input, Form } from 'antd';
import { Rule } from 'antd/es/form';
import { InputProps } from 'antd/lib/input';
import { FormItemProps } from 'antd/es/form';

type NibolInputProps = InputProps &
  FormItemProps & {
    label: string;
    name: string;
    rules?: Rule[];
    password?: boolean;
    validateTrigger?: string;
    hideAsterisk?: boolean;
  };

export const NibolInput: React.FC<NibolInputProps> = ({
  label,
  name,
  rules = [],
  password = false,
  className,
  validateTrigger,
  hideAsterisk = false,
  ...rest
}) => {
  const { ref, ...safeRest } = rest as any;

  return (
    <Form.Item
      label={label}
      name={name}
      rules={rules}
      validateTrigger={validateTrigger}
      required={!hideAsterisk}
    >
      {password ? (
        <Input.Password {...safeRest} size="large" className={className} />
      ) : (
        <Input {...safeRest} size="large" className={className} />
      )}
    </Form.Item>
  );
};
