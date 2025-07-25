import { Form, Input, Button, Divider, message } from "antd";
import { GoogleOutlined } from "@ant-design/icons";
import React from "react";
import { useState } from "react";
import styles from "./LoginForm.module.css";

const LoginForm: React.FC = () => {
  const [form] = Form.useForm();
  const [step, setStep] = useState<"email" | "password">("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFinish = (values: any) => {
    console.log("Dati inviati:", values);
    // Qui va la tua logica: fetch, redirect, ecc.
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <img src="/Logo Header.svg" alt="Nibol" className={styles.logo} />
        <Divider className={styles.divider} />

        <div className={styles.title}>
          <b>Accedi per gestire il tuo locale su Nibol</b>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          className={styles.form}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Inserisci la tua email" },
              { type: "email", message: "Email non valida" },
            ]}
          >
            <Input placeholder="esempio@email.com" size="large" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large">
              Continua
            </Button>
          </Form.Item>
        </Form>

        <Divider plain className={styles.orDivider}>
          OR
        </Divider>

        <Button
          icon={<GoogleOutlined />}
          size="large"
          block
          onClick={() => console.log("Login con Google")}
        >
          Continua con Google
        </Button>

        <Button type="link" block className={styles.register}>
          Non hai un account? Registrati
        </Button>
      </div>
    </div>
  );
};

export default LoginForm;
