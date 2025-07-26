"use client";
import { Form, Checkbox, Divider } from "antd";
import { NibolInput } from "../inputs/Input";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { GoogleLoginButton } from "../buttons/GoogleLoginButton";
import styles from "./SignUpForm.module.css";

type SignUpFormProps = {
  onGoToLogin?: () => void;
};

const SignUpForm: React.FC<SignUpFormProps> = ({ onGoToLogin }) => {
  const [form] = Form.useForm();

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src="Logo.svg" alt="Nibol" className={styles.logo} />
        <Divider />

        <div className={styles.title}>
          <b>
            Crea un nuovo account
            <br />
            per il tuo locale
          </b>
        </div>

        <Form form={form} layout="vertical" style={{ width: "100%" }}>
          <div className={styles.doubleInput}>
            <NibolInput
              label="Nome"
              name="firstName"
              rules={[{ required: true, message: "Inserisci il nome" }]}
            />
            <NibolInput
              label="Cognome"
              name="lastName"
              rules={[{ required: true, message: "Inserisci il cognome" }]}
            />
          </div>

          <NibolInput
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Inserisci la tua email" },
              { type: "email", message: "Email non valida" },
            ]}
          />

          <NibolInput
            label="Password"
            name="password"
            password
            rules={[
              { required: true, message: "Inserisci una password" },
              {
                pattern: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^\w\s]).{8,}$/,
                message:
                  "Password non valida, almeno 8 caratteri, 1 maiuscola, 1 simbolo e 1 numero.",
              },
            ]}
          />

          <div className={styles.passwordNote}>
            Almeno 8 caratteri, 1 maiuscola, 1 simbolo e 1 numero.
          </div>

          <Form.Item
            name="terms"
            valuePropName="checked"
            rules={[
              {
                required: true,
                message: "Devi accettare i termini per continuare.",
              },
            ]}
          >
            <Checkbox>
              Creando un account, accetto le{" "}
              <a href="#">Condizioni di Servizio – Locale</a> e la{" "}
              <a href="#">Privacy Policy</a>.
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <PrimaryButton text="Crea account" htmlType="submit" />
          </Form.Item>
        </Form>

        <Divider plain className={styles.orDivider}>
          OR
        </Divider>
        <GoogleLoginButton />

        <div className={styles.loginLink}>
          Hai già un account?{" "}
          <a onClick={onGoToLogin} style={{ cursor: "pointer" }}>
            Accedi
          </a>
        </div>
      </div>
    </div>
  );
};

export default SignUpForm;
