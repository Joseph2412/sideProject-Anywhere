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
  token: string;
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
  console.log("Risposta BackEnd", res);
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
  const [loading, setLoading] = useState(false);
  const setMessage = useSetAtom(messageToast);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields(); // email e password assieme
      const response = await userLogin(values.email, values.password);
      localStorage.setItem("token", response.token);
      message.success("Login effettuato!");
      onLoginSuccess?.({ name: response.user.name });
    } catch (err) {
      if (err instanceof Error) {
        form.setFields([
          {
            name: "password",
            errors: [err.message],
          },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      const values = await form.validateFields(["email"]);
      const email = values.email;

      setLoading(true);
      const res = await fetch(`${endPoint}/resetPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.message || "Errore durante il reset password");

      setMessage({
        type: "success",
        message: "Email inviata!",
        description: `Abbiamo inviato una mail all'indirizzo ${email} con le istruzioni per resettare la tua Password. Controlla la SPAM per sicurezza!`,
        duration: 4,
        placement: "bottomRight",
      });
    } catch (err) {
      console.log("Errore Reset Password: ", err);
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
            validateTrigger="onSubmit"
            label="Email"
            name="email"
            hideAsterisk={true}
            required={false}
            style={{ height: 32 }}
            className={styles.input}
            rules={[
              { required: true, message: "Inserisci la tua email" },
              { type: "email", message: "Email non valida" },
            ]}
          />

          <NibolInput
            validateTrigger="onSubmit"
            label="Password"
            name="password"
            hideAsterisk={true}
            className={styles.input}
            style={{ height: 32 }}
            rules={[{ required: true, message: "Inserisci la password" }]}
            password
          />

          <Form.Item style={{ marginBottom: 12 }}>
            <PrimaryButton
              loading={loading}
              disabled={loading}
              onClick={handleLogin}
              style={{ height: 32, marginBottom: 10 }}
              text="Continua"
            />
            <Divider
              plain
              className={styles.orDivider}
              style={{ marginTop: "0px", marginBottom: "8px" }}
            >
              OR
            </Divider>
            <GoogleLoginButton className={styles.googleButton} />
          </Form.Item>
        </Form>
      </div>

      <div
        style={{
          marginTop: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0px", // spazio tra i due pulsanti
        }}
      >
        <Button
          type="text"
          onClick={onGoToSignup}
          className={`${styles.register} ${styles.registerWrapper}`}
        >
          Non hai un account? Registrati
        </Button>
        <Button
          type="text"
          onClick={handleResetPassword}
          className={`${styles.register} ${styles.registerWrapper}`}
          style={{ marginTop: 4 }}
        >
          Reimposta password
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
