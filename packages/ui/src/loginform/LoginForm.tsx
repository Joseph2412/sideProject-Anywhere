"use client";

import { Form, Button, Divider, message } from "antd";
import { useState } from "react";
import styles from "./LoginForm.module.css";
import { NibolInput } from "../inputs/Input";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { GoogleLoginButton } from "../buttons/GoogleLoginButton";

message.config({
  top: 100,
  duration: 4,
  getContainer: () => document.body,
});

type LoginResponse = {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
};
const endPoint = "http://localhost:3001";

const userLogin = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const res = await fetch(endPoint + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error);
  }
  return data;
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

      const res = await fetch(endPoint + "/check-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!data.exists) {
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

      const response = await userLogin(email, values.password);

      message.success("Login effettuato!");
      onLoginSuccess?.({ name: response.user.name });
    } catch (err) {
      if (err instanceof Error)
        form.setFields([
          {
            name: "password",
            errors: [err.message],
          },
        ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${endPoint}/resetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Errore durante il reset password");
      }

      //setShowNotification(true)
    } catch (err) {
      console.log(err);
      message.error("Errore durante l'invio dell'email");
    } finally {
      setLoading(false);
    }
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
              disabled={loading}
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
