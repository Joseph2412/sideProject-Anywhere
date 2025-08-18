import {
  Form,
  Button,
  Upload,
  Avatar,
  Space,
  message,
  Row,
  Col,
  Card,
} from "antd";
import {
  UploadOutlined,
  DeleteOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { NibolInput } from "../inputs/Input";
import { useState, useEffect } from "react";
import { useSetAtom } from "jotai";
import { messageToast } from "@repo/ui/store/LayoutStore";
import { useUserProfile } from "@repo/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "./profile.module.css";
import { UploadChangeParam, UploadFile } from "antd/es/upload";

export const ProfileForm = () => {
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); //Provvisorio: Imposta Atomo Jotai.
  const [loading, setLoading] = useState(false); //Stato di Loading in base a step

  const { data, isLoading } = useUserProfile();

  const setMessage = useSetAtom(messageToast);
  console.log("Dati profilo:", data);

  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: async (values: { firstName: string; lastName: string }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/user/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(values),
        },
      );
      if (!res.ok) throw new Error();
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      setMessage({
        type: "success",
        message: "Profilo Aggiornato con successo!",
        description: "Profilo Aggiornato",
        duration: 3,
        placement: "bottomRight",
      });
    },
    onError: () => {
      message.error("Errore durante l'aggiornamento");
    },
  });

  /**
   * Gestisce il submit del form profilo utente
   * Pattern: onFinish standard Antd con gestione loading, API call e reload state
   * Flow: validazione → API PUT → reload dati globali → toast feedback
   * Reload: ricarica automaticamente authUser e hostProfile dopo aggiornamento
   */
  const onFinish = async (values: { firstName: string; lastName: string }) => {
    setLoading(true);
    try {
      await updateProfile.mutateAsync(values);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gestisce l'upload e preview dell'avatar utente
   * Pattern: FileReader per conversione file → base64 per preview immediato
   * Preparazione: per futura integrazione S3, attualmente solo preview locale
   * Flow: file selection → FileReader → setAvatarUrl per preview
   */
  const handleAvatarChange = (info: UploadChangeParam<UploadFile>) => {
    //Al momento Any. Next passare oggetto con tutte le info

    const file = info.file.originFileObj;

    if (file) {
      //Controllo che file esiste
      const reader = new FileReader();
      reader.onload = () => setAvatarUrl(reader.result as string);
      reader.readAsDataURL(file); //Tutto questo varrà poi con integrazione S3. Per Ora DUMMY IMAGE
    } //TODO: Implementa Questa funzione. Aspetta Integrazione con S3
  };

  /**
   * useEffect per sincronizzazione form con dati globali
   * Pattern: pre-popolamento form quando authUser e hostProfile sono disponibili
   * Trigger: si attiva quando profile, user o form cambiano
   * Gestione null-safety: controlli espliciti per evitare errori TypeScript
   */
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        firstName: data.profile.firstName,
        lastName: data.profile.lastName,
        email: data.user.email,
      });
    }
  }, [data, form]);

  const handleRemoveAvatar = () => setAvatarUrl(null); //quando un domani averemo S3, richiamiamo path del file e lo leviamo.

  if (isLoading) {
    return <div>Caricamento profilo...</div>;
  }

  return (
    <Form
      form={form}
      layout="vertical"
      style={{ width: "100%", borderRadius: 8 }}
      onFinish={onFinish}
    >
      <Card>
        <Form.Item label="Foto profilo">
          <Space>
            <Avatar
              size={64}
              icon={!avatarUrl && <UserOutlined />}
              src={avatarUrl ?? undefined}
            />
            <Upload
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleAvatarChange}
            >
              <Button
                icon={<UploadOutlined />}
                className={styles.buttonUpload}
                style={{
                  height: 32,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                Carica
              </Button>
            </Upload>
            {avatarUrl && (
              <Button
                icon={<DeleteOutlined />}
                danger
                onClick={handleRemoveAvatar}
              >
                Rimuovi
              </Button>
            )}
          </Space>
        </Form.Item>

        <Row gutter={[0, 0]}>
          <Col span={12}>
            <Form.Item
              name="firstName"
              rules={[{ required: true, message: "Inserisci il nome" }]}
            >
              <NibolInput
                name="firstName"
                validateTrigger="onSubmit"
                label="Nome"
                hideAsterisk={true}
                required={true}
                style={{ height: 32, width: "100%" }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lastName"
              rules={[{ required: true, message: "Inserisci il cognome" }]}
            >
              <NibolInput
                validateTrigger="onSubmit"
                label="Cognome"
                hideAsterisk={true}
                required={true}
                style={{ height: 32, width: "100%" }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="email">
          <NibolInput
            label="Email"
            disabled
            style={{ height: 32, width: "49%" }}
            hideAsterisk={true}
          />
        </Form.Item>
        <div style={{ color: "#8c8c8c", fontSize: 12, marginTop: 4 }}>
          Per modificare la mail, scrivi a support@nibol.com.
        </div>
        <Form.Item>
          <Space>
            <Button
              htmlType="button"
              onClick={() => {
                if (data) {
                  form.setFieldsValue({
                    firstName: data.firstName,
                    lastName: data.lastName,
                  });
                }
              }}
              className={styles.secondary}
            >
              Annulla
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className={styles.save}
            >
              Salva
            </Button>
          </Space>
        </Form.Item>
      </Card>
    </Form>
  );
};
