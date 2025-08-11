import { Form, Button, Upload, Avatar, Space, message, Row, Col, Card } from 'antd';
import { UploadOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import { NibolInput } from '../inputs/Input';
import { useState, useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { authUserAtom, userProfileAtom, messageToast } from '@repo/ui/store/LayoutStore';
import { useUserProfile } from '@repo/hooks';
import styles from './profile.module.css';
import { UploadChangeParam, UploadFile } from 'antd/es/upload';

export const ProfileForm = () => {
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null); //Provvisorio: Imposta Atomo Jotai.
  const [loading, setLoading] = useState(false); //Stato di Loading in base a step

  const profile = useAtomValue(userProfileAtom); //Richiamo i dati di UserProfile
  const user = useAtomValue(authUserAtom); //Da qui richiamo solo USER EMAIL
  const setUser = useSetAtom(authUserAtom);
  const setProfile = useSetAtom(userProfileAtom);
  const reaload = useUserProfile(setUser, setProfile);
  const setMessage = useSetAtom(messageToast);

  const onFinish = async (values: { firstName: string; lastName: string }) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error();

      await reaload();
      console.log('Prova Toast. PROFILO AGGIORNATO Deve partire il toast');

      setMessage({
        type: 'success',
        message: 'Profilo Aggiornato con successo!',
        description: 'Profilo Aggiornato',
        duration: 3,
        placement: 'bottomRight',
      });
    } catch {
      message.error("Errore durante l'aggiornamento");
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    if (profile && user) {
      //Se abbiamo Profilo
      //Ridondante? si ma serve per far star zitto Typescript
      form.setFieldsValue({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: user.email, //Sennò segnalava il "Possibile NULL"
      }); //Setto i valori del Form con firstName, lastName ed Email (ma disabled)
    }
  }, [profile, form, user]);

  const handleRemoveAvatar = () => setAvatarUrl(null); //quando un domani averemo S3, richiamiamo path del file e lo leviamo.

  return (
    <Form
      form={form}
      layout="vertical"
      style={{ width: '100%', borderRadius: 8 }}
      onFinish={onFinish}
    >
      <Card>
        <Form.Item label="Foto profilo">
          <Space>
            <Avatar size={64} icon={!avatarUrl && <UserOutlined />} src={avatarUrl ?? undefined} />
            <Upload showUploadList={false} beforeUpload={() => false} onChange={handleAvatarChange}>
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

        <Row gutter={[0, 0]}>
          <Col span={12}>
            <Form.Item rules={[{ required: true, message: 'Inserisci il nome' }]}>
              <NibolInput
                validateTrigger="onSubmit"
                label="Nome"
                name="firstName"
                hideAsterisk={true}
                required={true}
                style={{ height: 32, width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item rules={[{ required: true, message: 'Inserisci il cognome' }]}>
              <NibolInput
                validateTrigger="onSubmit"
                label="Cognome"
                name="lastName"
                hideAsterisk={true}
                required={true}
                style={{ height: 32, width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <NibolInput
            label="Email"
            name="email"
            disabled
            style={{ height: 32, width: '49%' }}
            hideAsterisk={true}
          />
          <div style={{ color: '#8c8c8c', fontSize: 12, marginTop: 4 }}>
            Per modificare la mail, scrivi a support@nibol.com.
          </div>
        </Form.Item>
        <Form.Item>
          <Space>
            <Button
              htmlType="button"
              onClick={() => {
                if (profile) {
                  form.setFieldsValue({
                    firstName: profile.firstName,
                    lastName: profile.lastName,
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
