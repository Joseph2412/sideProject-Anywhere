import React, { useEffect } from 'react'; //Importiamo TUTTO da React

import { Form, Button, Upload, Avatar, Space, Row, Col, Card, Select, Tag, Input } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';
import { NibolInput } from '../../inputs/Input';
import styles from './venueDetailsForm.module.css';
import { useState } from 'react';

//Import di Jotai e degli Atom Necessari
import { useAtomValue, useAtom, useSetAtom } from 'jotai';
import { messageToast } from '../../../store/LayoutStore';
import { venueAtom } from '../../../store/VenueDetails';

export const VenueDetailsForm = () => {
  const [form] = Form.useForm();
  const availableServices = ['WiFi', 'Stampante', 'Caffè', 'Reception', 'Parcheggio']; //Servizi Standard per tutti. HARDCODED is the Way.

  const [loading, setLoading] = useState(false); //Stato LOADING
  const [venueDetails, setVenueDetails] = useAtom(venueAtom);
  const venue = useAtomValue(venueAtom);

  const setMessage = useSetAtom(messageToast);

  //Richiamo Dati Sul Form
  useEffect(() => {
    fetch('http://localhost:3001/api/venues', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        console.log('Venue GET:', data.venue); // <-- Debug
        setVenueDetails(data.venue);
        form.setFieldsValue({ ...data.venue, avatarUrl: data.venue.avatarURL });
      });
  }, [form, setVenueDetails]);

  const onFinish = async (values: typeof venueDetails) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3001/api/venues`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        const data = await res.json();
        setVenueDetails(data.venue);
        setMessage({
          type: 'success',
          message: 'Dettagli del locale aggiornati con successo',
          duration: 3,
          placement: 'bottomRight',
        });
      } else {
        setMessage({
          type: 'error',
          message: 'Errore 1',
          duration: 3,
          placement: 'bottomRight',
        });
      }
    } catch {
      setMessage({
        type: 'error',
        message: 'Errore 2',
        duration: 3,
        placement: 'bottomRight',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      layout="vertical"
      style={{ width: '100%', borderRadius: 8 }}
      form={form}
      initialValues={venueDetails || {}}
      onFinish={onFinish}
    >
      <Card>
        <Form.Item name="avatarUrl" label="Foto profilo" className={styles.profileUpload}>
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
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Inserisci il Nome de Locale' }]}
            >
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
            <Form.Item
              name="address"
              rules={[{ required: true, message: `'Inserisci L'indirizzo del Locale'` }]}
            >
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
              onClick={() => {
                if (venue) {
                  form.setFieldsValue({
                    name: venue.name,
                    address: venue.address,
                    description: venue.description,
                    services: venue.services,
                  });
                }
              }}
              className={styles.secondary}
            >
              Annulla
            </Button>
            <Button type="primary" htmlType="submit" disabled={loading}>
              Salva
            </Button>
          </Space>
        </Form.Item>
      </Card>
    </Form>
  );
};
