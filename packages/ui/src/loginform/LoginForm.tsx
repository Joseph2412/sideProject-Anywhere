"use client";
import { Form, Button, Divider, message } from "antd";
import { useState } from "react";
import styles from "./LoginForm.module.css";
import { NibolInput } from "../inputs/Input";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { GoogleLoginButton } from "../buttons/GoogleLoginButton";

// Simula check se l'email è registrata
const fakeCheckEmail = async (email: string): Promise<boolean> => {
  await new Promise((res) => setTimeout(res, 700));
  return email === "giuseppe.randisi@nibol.com";
};

// Simula login
const fakeLogin = async (email: string, password: string): Promise<boolean> => {
  await new Promise((res) => setTimeout(res, 700));
  return password === "PasswordCorretta123!";
};

type Props = {
  onLoginSuccess?: (user: { name: string }) => void;
  onGoToSignup?: () => void;
};

const LoginForm: React.FC<Props> = ({ onLoginSuccess, onGoToSignup }) => {
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
      onLoginSuccess?.({ name: email });
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
        <img src="Logo.svg" alt="Nibol" className={styles.logo} />
        <Divider />

        <div className={styles.title}>
          <b>Accedi per gestire il tuo locale su Nibol</b>
        </div>

        <Form form={form} layout="vertical" style={{ width: "100%" }}>
          <NibolInput
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Inserisci la tua email" },
              { type: "email", message: "Email non valida" },
            ]}
            disabled={step === "password"}
          />

          {step === "password" && (
            <NibolInput
              label="Password"
              name="password"
              rules={[{ required: true, message: "Inserisci la password" }]}
              password
            />
          )}

          <Form.Item>
            <PrimaryButton
              loading={loading}
              onClick={
                step === "email" ? handleEmailCheck : handlePasswordLogin
              }
              text="Continua"
            />
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
            <GoogleLoginButton />
          </>
        )}

        <Button type="link" block onClick={onGoToSignup}>
          Non hai un account? Registrati
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
