import React, { useEffect } from 'react'; // React

import { Form, Button, Upload, Avatar, Space, Row, Col, Card, Select, Tag, Input } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';
import { NibolInput } from '../../inputs/Input';
import styles from './VenueDetailsForm.module.css';
import { useState } from 'react';
import { useVenues } from '@repo/hooks';

// Jotai e store
import { useSetAtom } from 'jotai';
import { messageToast } from '@repo/ui/store/LayoutStore';
import { PrimaryButton } from './../../buttons/PrimaryButton';

import type { VenueDetails } from '@repo/ui/store/LayoutStore';

export const VenueDetailsForm = () => {
  const [form] = Form.useForm();

  // Array servizi disponibili per venue
  const availableServices = ['WiFi', 'Stampante', 'Caffè', 'Reception', 'Parcheggio'];

  const [loading, setLoading] = useState(false); // Stato loading
  const [venueDetails, setVenueDetails] = useState<VenueDetails | null>(null);

  const { data, isLoading } = useVenues();

  const setMessage = useSetAtom(messageToast);

  // useEffect per caricamento dati venue esistenti
  useEffect(() => {
    if (data && data.venues) {
      form.setFieldsValue({
        ...data.venues[0],
        // avatarUrl: data.venues[0].avatarURL || '',
      });
      setVenueDetails(data.venues[0]);
    }
  }, [data, form]);

  const onFinish = async (values: typeof venueDetails) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/venues`, {
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
          message: 'Dettagli aggiornati',
          duration: 3,
          placement: 'bottomRight',
        });
      } else {
        setMessage({
          type: 'error',
          message: 'Errore salvataggio',
          duration: 3,
          placement: 'bottomRight',
        });
      }
    } catch {
      setMessage({
        type: 'error',
        message: 'Errore salvataggio',
        duration: 3,
        placement: 'bottomRight',
      });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <div>Caricamento dati venue...</div>;
  }

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
              rules={[{ required: true, message: "Inserisci L'indirizzo del Locale" }]}
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
            options={availableServices.map(service => ({
              label: service,
              value: service,
            }))}
          />
        </Form.Item>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 12 }}>
          {availableServices.map(service => (
            <Tag
              key={service}
              className={styles.clickableTag}
              onClick={() => {
                console.log('Valore attuale di services:', form.getFieldValue('services'));
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
          <Space>
            <Button
              htmlType="button"
              onClick={() => {
                if (venueDetails) {
                  form.setFieldsValue({
                    name: venueDetails.name,
                    address: venueDetails.address,
                    description: venueDetails.description,
                    services: venueDetails.services,
                  });
                }
              }}
              className={styles.secondary}
            >
              Annulla
            </Button>
            <PrimaryButton type="primary" htmlType="submit" disabled={loading}>
              Salva
            </PrimaryButton>
          </Space>
        </Form.Item>
      </Card>
    </Form>
  );
};
