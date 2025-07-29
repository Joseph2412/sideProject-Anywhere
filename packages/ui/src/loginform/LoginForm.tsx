"use client";

import { Form, Button, Divider, message } from "antd";
import { useState } from "react";
import styles from "./LoginForm.module.css";
import { NibolInput } from "../inputs/Input";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { GoogleLoginButton } from "../buttons/GoogleLoginButton";
import { useSetAtom } from "jotai";
import { messageToast } from "../../../store/LayoutStore";

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
      const values = await form.validateFields(["email"]);
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
      const values = await form.validateFields(["password"]);

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

  const setMessage = useSetAtom(messageToast);
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
      setMessage(true);
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
            validateTrigger="onSubmit"
            label="Email"
            name="email"
            style={{ height: 32 }}
            className={styles.input}
            rules={[
              { required: true, message: "Inserisci la tua email" },
              { type: "email", message: "Email non valida" },
            ]}
            disabled={step === "password"}
          />

          {step === "password" && (
            <NibolInput
              validateTrigger="onSubmit"
              label="Password"
              name="password"
              className={styles.input}
              style={{ height: 32 }}
              rules={[{ required: true, message: "Inserisci la password" }]}
              password
            />
          )}

          <Form.Item style={{ marginBottom: step === "password" ? 6 : 12 }}>
            <PrimaryButton
              loading={loading}
              disabled={loading}
              onClick={
                step === "password" ? handlePasswordLogin : handleEmailCheck
              }
              style={{ height: 32, marginBottom: 10 }}
              text="Continua"
            />
          </Form.Item>

          {step === "password" ? (
            <>
              <Button
                block
                type="text"
                onClick={() => setStep("email")}
                className={styles.secondaryButton}
              >
                Cambia email
              </Button>
              <Button
                block
                type="text"
                onClick={handleResetPassword}
                className={styles.secondaryButton}
                style={{ marginTop: 15 }}
              >
                Reimposta password
              </Button>
            </>
          ) : (
            <>
              <Divider
                plain
                className={styles.orDivider}
                style={{ marginTop: "0px", marginBottom: "8px" }}
              >
                OR
              </Divider>
              <GoogleLoginButton className={styles.googleButton} />
            </>
          )}
        </Form>
      </div>
      <div
        style={{ marginTop: "16px", display: "flex", justifyContent: "center" }}
      >
        <Button
          type="text"
          onClick={onGoToSignup}
          className={`${styles.register} ${styles.registerWrapper}`}
        >
          Non hai un account? Registrati
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
