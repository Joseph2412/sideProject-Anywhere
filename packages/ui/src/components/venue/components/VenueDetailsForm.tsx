import { Form, Button, Upload, Avatar, Space, Row, Col, Card, Select, Tag, Input } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { NibolInput } from '../../inputs/Input';
import styles from './venueDetailsForm.module.css';

export const VenueDetailsForm = () => {
  const availableServices = ['WiFi', 'Stampante', 'Caffè', 'Reception', 'Parcheggio'];
  const [form] = Form.useForm();

  return (
    <Form layout="vertical" style={{ width: '100%', borderRadius: 8 }} form={form}>
      <Card>
        <Form.Item
          label="Logo"
          className={styles.profileUpload}
          help="Formato 1:1, dimensione suggerita 400px x 400px"
        >
          <div className={styles.profileContainer}>
            <Avatar size={64} />
            <div className={styles.buttonColumn}>
              <Upload showUploadList={false} beforeUpload={() => false}>
                <Button>Carica</Button>
              </Upload>
              <Button icon={<DeleteOutlined />}>Rimuovi</Button>
            </div>
          </div>
        </Form.Item>

        <Row gutter={[0, 0]}>
          <Col span={12}>
            <Form.Item rules={[{ required: true, message: 'Inserisci il Nome de Locale' }]}>
              <NibolInput
                validateTrigger="onSubmit"
                label="Nome del Locale"
                name="name"
                hideAsterisk={true}
                required={true}
                style={{ height: 32, width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item rules={[{ required: true, message: `'Inserisci L'indirizzo del Locale'` }]}>
              <NibolInput
                validateTrigger="onSubmit"
                label="Indirizzo"
                name="adress"
                hideAsterisk={true}
                required={true}
                style={{ height: 32, width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item name="description" label="Descrizione">
          <Input.TextArea style={{ height: 32, width: '100%', minHeight: 100 }} />
        </Form.Item>
        <Form.Item name="services" label="Servizi">
          <Select
            mode="tags"
            style={{ height: 32, width: '100%' }}
            placeholder="Inserisci o Selezione dei Servizi"
            options={availableServices.map(service => ({ label: service, value: service }))}
          />
        </Form.Item>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
          {availableServices.map(service => (
            <Tag
              key={service}
              className={styles.clickableTag}
              onClick={() => {
                const current = form.getFieldValue('services') || [];
                if (!current.includes(service)) {
                  form.setFieldValue('services', [...current, service]);
                }
              }}
            >
              + {service}
            </Tag>
          ))}
        </div>
        <Form.Item style={{ marginTop: 20 }}>
          {/* Aggiungere Border/Margin sopra sezione Pulsanti */}
          <Space>
            <Button
              htmlType="button"
              // onClick={() => {
              //   if (profile) {
              //     form.setFieldsValue({
              //       firstName: profile.firstName,
              //       lastName: profile.lastName,
              //     });
              //   }
              // }}
            >
              Annulla
            </Button>
            <Button type="primary" htmlType="submit">
              Salva
            </Button>
          </Space>
        </Form.Item>
      </Card>
    </Form>
  );
};
