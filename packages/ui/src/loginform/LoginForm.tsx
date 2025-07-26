import { Form, Input, Button, Divider, message } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import { useState } from "react";
import styles from "./LoginForm.module.css";

// Simula check se l'email è registrata
const fakeCheckEmail = async (email: string): Promise<boolean> => {
  await new Promise((res) => setTimeout(res, 700));
  return email === "riccardo.suardi@nibol.com";
};

// Simula login
const fakeLogin = async (email: string, password: string): Promise<boolean> => {
  await new Promise((res) => setTimeout(res, 700));
  return password === "PasswordCorretta123!";
};

const LoginForm = () => {
  const [form] = Form.useForm();
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmailCheck = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const email = values.email;

      // Simulazione chiamata API check email
      const exists = await fakeCheckEmail(email);

      if (!exists) {
        form.setFields([
          {
            name: "email",
            errors: [
              "Questa email non è registrata su Nibol, registrati per creare un nuovo account.",
            ],
          },
        ]);
        return;
      }

      setEmail(email);
      setStep("password");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordLogin = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      const success = await fakeLogin(email, values.password);
      if (!success) {
        form.setFields([
          {
            name: "password",
            errors: [
              "Credenziali sbagliate. Controlla l’indirizzo email o utilizza un’altra password.",
            ],
          },
        ]);
        return;
      }

      message.success("Login effettuato!");
      // ... redirect
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = () => {
    message.success(
      `Abbiamo mandato una email a ${email} con le istruzioni. Controlla la cartella SPAM.`,
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src="/Logo Header.svg" alt="Nibol" className={styles.logo} />
        <Divider />

        <div className={styles.title}>
          <b>Accedi per gestire il tuo locale su Nibol</b>
        </div>

        <Form form={form} layout="vertical" style={{ width: "100%" }}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Inserisci la tua email" },
              { type: "email", message: "Email non valida" },
            ]}
          >
            <Input disabled={step === "password"} size="large" />
          </Form.Item>

          {step === "password" && (
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: "Inserisci la password" }]}
            >
              <Input.Password size="large" />
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              block
              size="large"
              loading={loading}
              onClick={
                step === "email" ? handleEmailCheck : handlePasswordLogin
              }
            >
              Continua
            </Button>
          </Form.Item>
        </Form>

        {step === "password" && (
          <>
            <Button block type="text" onClick={() => setStep("email")}>
              Cambia email
            </Button>
            <Button block type="text" onClick={handleResetPassword}>
              Reimposta password
            </Button>
          </>
        )}

        {step === "email" && (
          <>
            <Divider plain className={styles.orDivider}>
              OR
            </Divider>
            <Button icon={<GoogleOutlined />} size="large" block>
              Continua con Google
            </Button>
          </>
        )}

        <Button type="link" block>
          Non hai un account? Registrati
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
