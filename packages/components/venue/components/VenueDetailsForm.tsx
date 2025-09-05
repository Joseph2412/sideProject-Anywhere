import { useEffect } from 'react'; // React

import { Form, Button, Space, Row, Card, Select, Tag, Input, Col } from 'antd';

import { NibolInput } from '../../inputs/Input';
import { LogoUpload } from '../../logoUpload';
import styles from './VenueDetailsForm.module.css';
import { useState } from 'react';
import { useVenues } from '@repo/hooks';
import { useQueryClient } from '@tanstack/react-query';

// Jotai e store
import { useSetAtom } from 'jotai';
import { messageToast } from '@repo/ui/store/LayoutStore';
import { PrimaryButton } from './../../buttons/PrimaryButton';

import type { VenueDetails } from '@repo/ui/store/LayoutStore';

export const VenueDetailsForm = () => {
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  // Array servizi disponibili per venue
  const availableServices = ['WiFi', 'Stampante', 'Caffè', 'Reception', 'Parcheggio'];

  const [loading, setLoading] = useState(false); // Stato loading
  const [venueDetails, setVenueDetails] = useState<VenueDetails | null>(null);

  const { data, isLoading } = useVenues();

  const setMessage = useSetAtom(messageToast);

  // useEffect per caricamento dati venue esistenti
  useEffect(() => {
    if (data && data.venues.venue) {
      form.setFieldsValue({
        name: data.venues.venue.name,
        address: data.venues.venue.address,
        description: data.venues.venue.description,
        services: data.venues.venue.services,
        // avatarUrl: data.venues[0].avatarURL || '',
      });
      setVenueDetails(data.venues.venue);
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

        // Invalida la query per aggiornare tutti i componenti che usano venue data (inclusa la sidebar)
        await queryClient.invalidateQueries({ queryKey: ['venues'] });

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
      style={{ width: '100%', borderRadius: 8, height: '100%' }}
      form={form}
      initialValues={venueDetails || {}}
      onFinish={onFinish}
    >
      <Card>
        <LogoUpload size={80} showRemove={true} />

        <Row gutter={[16, 0]} style={{ marginTop: 16 }}>
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
                style={{ height: '32px', width: '100%' }}
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
                value="address"
                hideAsterisk={true}
                required={true}
                style={{ height: '32px', width: '100%' }}
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
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            marginTop: '8px',
            marginLeft: '4px',
          }}
        >
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
              <span
                style={{
                  display: 'flex',
                  marginBottom: '3px',
                  marginRight: '4px',
                  fontSize: '14px',
                }}
              >
                +
              </span>

              {service}
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
              style={{ borderColor: '#D9D9D9' }}
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
