import { Form, Button, Space, Row, Col, Card, Select } from 'antd';
import { NibolInput } from '../../../inputs/Input';
import styles from './Payments.module.css';
import { useEffect, useState } from 'react';

import { useSetAtom } from 'jotai';
import { messageToast } from '@repo/ui';

export const PaymentsForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({}); // Nuovo state per salvare i valori iniziali

  /**
   * Array dei codici paese supportati per i pagamenti
   * Utilizzato nel Select per permettere all'utente di scegliere la nazione per i dati di fatturazione
   * Formato: codici ISO 3166-1 alpha-2 e alpha-3
   */
  const countryCode = ['IT', 'FR', 'DE', 'ES', 'GBR', 'CHE', 'NLD', 'AT'];

  /**
   * Array delle valute corrispondenti ai paesi europei supportati
   * Utilizzato per popolare il Select delle valute in base alla nazione scelta
   * Formato: codici ISO 4217
   */
  // Codici valuta corrispondenti alle nazioni europee
  const currencyCode = ['EUR', 'GBP', 'CHF'];

  const setMessage = useSetAtom(messageToast);

  /**
   * useEffect per il caricamento iniziale dei dati di pagamento dal backend
   * Recupera i dati esistenti e li popola automaticamente nel form
   * Pattern: fetch + setFieldsValue per pre-popolamento form con dati esistenti
   * Dependency: [form] - si riattiva solo se cambia l'istanza del form
   */
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Nessun token trovato nel localStorage');
      return;
    }

    fetch('http://localhost:3001/api/venues/payments', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data) {
          form.setFieldsValue(data);
          setInitialValues(data); // Salva i valori iniziali per il form
        } else {
          console.error('Payments non trovati');
        }
      })
      .catch(error => {
        console.error('Errore nel recupero dei dati:', error);
      });
  }, [form]);

  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      const res = await fetch(`http://localhost:3001/api/venues/payments`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          companyName: values.companyName,
          address: values.address,
          iban: values.iban,
          bicSwift: values.bicSwift,
          countryCode: values.countryCode,
          currencyCode: values.currencyCode,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        form.setFieldsValue(data);
        setMessage({
          type: 'success',
          message: 'Pagamenti aggiornati con successo',
          duration: 3,
          placement: 'bottomRight',
        });
      } else {
        setMessage({
          type: 'error',
          message: "Errore durante l'aggiornamento dei pagamenti",
          duration: 3,
          placement: 'bottomRight',
        });
      }
    } catch (error) {
      console.error('Error updating payments:', error);
      setMessage({
        type: 'error',
        message: "Errore durante l'aggiornamento dei pagamenti",
        duration: 3,
        placement: 'bottomRight',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark={false} // Nasconde gli asterischi globalmente
      style={{ width: '100%', borderRadius: 8 }}
      onFinish={onFinish}
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
            <Form.Item
              rules={[
                { required: true, message: `Inserisci L'iban` },
                {
                  pattern: /^[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}$/,
                  message: 'Formato IBAN non valido (es: IT00X0000000000000000000000)',
                },
                {
                  max: 34,
                  message: 'IBAN troppo lungo (massimo 34 caratteri)',
                },
              ]}
            >
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
            <Form.Item
              rules={[
                { required: true, message: 'Inserisci il Codice BIC/SWIFT' },
                {
                  pattern: /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/,
                  message: 'Formato BIC/SWIFT non valido (8 o 11 caratteri)',
                },
              ]}
            >
              <NibolInput
                validateTrigger="onSubmit"
                label="BIC/SWIFT"
                name="bicSwift"
                hideAsterisk={true}
                required={true}
                style={{ height: 32, width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[0, 0]}>
          <Col span={12}>
            <Form.Item
              validateTrigger="onSubmit"
              name="countryCode"
              label="Paese"
              rules={[{ required: true, message: 'Seleziona una Nazione' }]}
            >
              <Select
                style={{ height: 32, width: '100%' }}
                options={countryCode.map(code => ({ label: code, value: code }))}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              validateTrigger="onSubmit"
              name="currencyCode"
              label="Valuta"
              rules={[{ required: true, message: 'Seleziona Una Valuta' }]}
            >
              <Select
                style={{ height: 32, width: '100%' }}
                options={currencyCode.map(code => ({ label: code, value: code }))}
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item style={{ marginTop: 15 }}>
          <Space>
            <Button
              htmlType="button"
              onClick={() => form.setFieldsValue(initialValues)}
              className={styles.secondary}
            >
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
