import { Form, Button, Upload, Avatar, Space, message, Row, Card, Col } from 'antd';
import { UploadOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { NibolInput } from '../inputs/Input';
import { useState, useEffect } from 'react';
import { useSetAtom } from 'jotai';
import { messageToast } from '@repo/ui/store/LayoutStore';
import { useUserProfile } from '@repo/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import styles from './profile.module.css';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';

export const ProfileForm = () => {
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); // Stato avatar
  const [loading, setLoading] = useState(false); // Stato loading

  const { data, isLoading } = useUserProfile();

  const setMessage = useSetAtom(messageToast);
  console.log('Dati profilo:', data);

  const queryClient = useQueryClient();

  const updateProfile = useMutation({
    mutationFn: async (values: { firstName: string; lastName: string }) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setMessage({
        type: 'success',
        message: 'Profilo Aggiornato con successo!',
        description: 'Profilo Aggiornato',
        duration: 3,
        placement: 'bottomRight',
      });
    },
    onError: () => {
      message.error("Errore durante l'aggiornamento");
    },
  });

  // Gestisce il submit del form profilo utente
  const onFinish = async (values: { firstName: string; lastName: string }) => {
    setLoading(true);
    try {
      await updateProfile.mutateAsync(values);
    } finally {
      setLoading(false);
    }
  };

  // Gestisce upload e preview avatar utente (solo preview locale)
  const handleAvatarChange = (info: UploadChangeParam<UploadFile>) => {
    // TODO: passare oggetto info completo in futuro

    const file = info.file.originFileObj;

    if (file) {
      // Controllo che file esista
      const reader = new FileReader();
      reader.onload = () => setAvatarUrl(reader.result as string);
      reader.readAsDataURL(file); // In futuro: integrazione S3
    } // TODO: implementare upload S3
  };

  /**
   * useEffect per sincronizzazione form con dati globali
   * Pattern: pre-popolamento form quando authUser è disponibile
   * Trigger: si attiva quando profile, user o form cambiano
   * Gestione null-safety: controlli espliciti per evitare errori TypeScript
   */
  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        firstName: data.user.firstName,
        lastName: data.user.lastName,
        email: data.user.email,
      });
    }
  }, [data, form]);

  const handleRemoveAvatar = () => setAvatarUrl(null); // In futuro: rimuovere da S3

  if (isLoading) {
    return <div>Caricamento profilo...</div>;
  }

  return (
    <Form
      form={form}
      layout="vertical"
      style={{ width: '100%', borderRadius: 8 }}
      onFinish={onFinish}
    >
      <Card style={{ marginRight: 16 }}>
        <Form.Item label="Foto profilo">
          <Space>
            <Avatar size={64} icon={!avatarUrl && <UserOutlined />} src={avatarUrl ?? undefined} />
            <Upload
              showUploadList={false}
              beforeUpload={() => false}
              onChange={handleAvatarChange}
              style={{ display: 'contents' }}
            >
              <Button
                icon={<UploadOutlined />}
                className={styles.buttonUpload}
                style={{
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                Carica
              </Button>
            </Upload>
            {avatarUrl && (
              <Button icon={<DeleteOutlined />} danger onClick={handleRemoveAvatar}>
                Rimuovi
              </Button>
            )}
          </Space>
        </Form.Item>

        <Row gutter={[16, 0]}>
          <Col span={12}>
            <Form.Item name="firstName" rules={[{ required: true, message: 'Inserisci il nome' }]}>
              <NibolInput
                name="firstName"
                validateTrigger="onSubmit"
                label="Nome"
                hideAsterisk={true}
                required={true}
                style={{ height: 32, width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="lastName"
              rules={[{ required: true, message: 'Inserisci il cognome' }]}
            >
              <NibolInput
                validateTrigger="onSubmit"
                label="Cognome"
                hideAsterisk={true}
                required={true}
                style={{ height: 32, width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="email">
          <NibolInput
            label="Email"
            disabled
            style={{ height: 32, width: '100%' }}
            hideAsterisk={true}
          />
        </Form.Item>
        <div style={{ color: '#8c8c8c', fontSize: 12, marginTop: 4 }}>
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
            <Button type="primary" htmlType="submit" loading={loading} className={styles.save}>
              Salva
            </Button>
          </Space>
        </Form.Item>
      </Card>
    </Form>
  );
};
