import { Form, Button, Space, Row, Col, Card, Select } from 'antd';
import { NibolInput } from '../../../inputs/Input';
import styles from './Payments.module.css';

export const PaymentsForm = () => {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      style={{ width: '100%', borderRadius: 8 }}
      //onFinish={onFinish}
    >
      <Card
        bodyStyle={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 15, paddingRight: 15 }}
        style={{ marginBottom: 20 }}
      >
        <Row gutter={[0, 0]}>
          <Col span={12}>
            <Form.Item rules={[{ required: true, message: 'Ragione Sociale Richiesta' }]}>
              <NibolInput
                validateTrigger="onSubmit"
                label="Ragione Sociale"
                name="companyName"
                hideAsterisk={true}
                required={true}
                style={{ height: 32, width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item rules={[{ required: true, message: `Inserisci L'indirizzo` }]}>
              <NibolInput
                validateTrigger="onSubmit"
                label="Indirizzo"
                name="address"
                hideAsterisk={true}
                required={true}
                style={{ height: 32, width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[0, 0]}>
          <Col span={12}>
            <Form.Item rules={[{ required: true, message: `Inserisci L'iban` }]}>
              <NibolInput
                validateTrigger="onSubmit"
                label="IBAN"
                name="iban"
                hideAsterisk={true}
                required={true}
                style={{ height: 32, width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item rules={[{ required: true, message: 'Inserisci il COdice BIC/SWIFT' }]}>
              <NibolInput
                validateTrigger="onSubmit"
                label="BIC/SWIFT"
                name="lastName"
                hideAsterisk={true}
                required={true}
                style={{ height: 32, width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[0, 0]}>
          <Col span={12}>
            <Form.Item name="countryCode" label="Paese">
              <Select
                mode="tags"
                style={{ height: 32, width: '100%' }}
                // options={availableServices.map(service => ({ label: service, value: service }))} da integrare: Codici PAESE
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="currencyCode" label="Valuta">
              <Select
                mode="tags"
                style={{ height: 32, width: '100%' }}
                // options={availableServices.map(service => ({ label: service, value: service }))} da integrare: Codici VALUTE
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item style={{ marginTop: 15 }}>
          <Space>
            <Button htmlType="button" className={styles.secondary}>
              Annulla
            </Button>
            <Button type="primary" htmlType="submit" className={styles.save}>
              Salva
            </Button>
          </Space>
        </Form.Item>
      </Card>

      <Card bodyStyle={{ paddingTop: 10, paddingBottom: 10, paddingLeft: 15 }}>
        <div style={{ color: '#8c8c8c', fontSize: 12, marginBottom: 8 }}>
          Informazioni Per emissione Fattura
        </div>

        <div>
          <p style={{ fontSize: 12, margin: 0 }}>Nibol S.R.L</p>
          <p style={{ fontSize: 12, margin: 0 }}>P.IVA: IT10683870967</p>
          <p style={{ fontSize: 12, margin: 0 }}>Via Alfredo Campanini 4. 20121, Milano(MI)</p>
          <p style={{ fontSize: 12, margin: 0 }}>SDIT9K4ZHO</p>
          <p style={{ fontSize: 12, margin: 0 }}>billing@nibol.com</p>
          <p style={{ fontSize: 12, margin: 0 }}>PEC: nibol@pec.it</p>
        </div>
      </Card>
    </Form>
  );
};
