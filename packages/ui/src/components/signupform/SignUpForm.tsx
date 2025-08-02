"use client";
import { Form, Checkbox, Divider, message, Button } from "antd";
import { NibolInput } from "../inputs/Input";
import { PrimaryButton } from "../buttons/PrimaryButton";
import { GoogleLoginButton } from "../buttons/GoogleLoginButton";
import styles from "./SignUpForm.module.css";
import React from "react";
import { useState } from "react";

type SignupPayload = {
  name: string;
  email: string;
  password: string;
  role: "HOST";
};

type SignupResponse = {
  message: string;
  user: {
    id: number;
    name: string;
    email: string;
    role: "HOST";
  };
};

const userSignup = async (payload: SignupPayload): Promise<SignupResponse> => {
  const res = await fetch("http://localhost:3001/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || "Errore nella registrazione");
  }

  return data;
};

type SignUpFormProps = {
  onGoToLogin?: () => void;
};
type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  terms: boolean;
};

const SignUpForm: React.FC<SignUpFormProps> = ({ onGoToLogin }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const handleSubmit = async (values: FormValues) => {
    try {
      console.log("FORM VALUE: ", values); //Ritorno in console del PAYLOAD inviato al DB ELIMINA IN FASE DI RELEASE
      setLoading(true);
      const payload: SignupPayload = {
        name: `${values.firstName} ${values.lastName}`,
        email: values.email,
        password: values.password,
        role: "HOST", // Registro forzato per ora di HOST
      };

      await userSignup(payload);
      form.resetFields();

      message.success("Registrazione completata con successo!");

      onGoToLogin?.(); // Redirect automatico al login
    } catch (err) {
      if (err instanceof Error)
        message.error(err.message || "Errore nella registrazione");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src="/Logo.svg" alt="Nibol" className={styles.logo} />
        <Divider />

        <div className={styles.title}>
          <b>
            Crea un nuovo account
            <br />
            per il tuo locale
          </b>
        </div>

        <Form
          form={form}
          layout="vertical"
          style={{ width: "100%" }}
          onFinish={handleSubmit}
        >
          <div className={styles.doubleInput}>
            <NibolInput
              label="Nome"
              name="firstName"
              className={styles.input}
              style={{ height: 32 }}
              rules={[{ required: true, message: "Inserisci il nome" }]}
              hideAsterisk={true}
            />
            <NibolInput
              label="Cognome"
              name="lastName"
              className={styles.input}
              style={{ height: 32 }}
              rules={[{ required: true, message: "Inserisci il cognome" }]}
              hideAsterisk={true}
            />
          </div>

          <NibolInput
            label="Email"
            name="email"
            style={{ height: 32 }}
            className={styles.input}
            rules={[
              { required: true, message: "Inserisci la tua email" },
              { type: "email", message: "Email non valida" },
            ]}
            hideAsterisk={true}
          />

          <NibolInput
            label="Password"
            name="password"
            style={{ height: 32 }}
            className={styles.input}
            password
            hideAsterisk={true}
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
            <Checkbox className={styles.checkboxText}>
              Creando un account, accetto le{" "}
              <a href="#" className={styles.link}>
                Condizioni di Servizio – Locale
              </a>{" "}
              e la{" "}
              <a href="#" className={styles.link}>
                Privacy Policy
              </a>
              .
            </Checkbox>
          </Form.Item>

          <Form.Item>
            <PrimaryButton
              text="Crea account"
              htmlType="submit"
              loading={loading}
              disabled={loading}
              style={{ height: 32, marginTop: 10 }}
            />
          </Form.Item>
        </Form>

        <Divider plain className={styles.orDivider}>
          OR
        </Divider>
        <GoogleLoginButton style={{ height: 32, width: 380 }} />
      </div>
      <div
        style={{ marginTop: "16px", display: "flex", justifyContent: "center" }}
      >
        <Button
          type="text"
          onClick={onGoToLogin}
          className={`${styles.register} ${styles.registerWrapper}`}
        >
          Sei già Registrato? Accedi!
        </Button>
      </div>
    </div>
  );
};

export default SignUpForm;
