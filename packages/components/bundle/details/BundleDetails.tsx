import React, { useEffect } from 'react'; // React

import { Form, Button, Upload, Avatar, Space, Row, Col, Card, Select, Tag, Input } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';
import { NibolInput } from '../../inputs/Input';
import { useState } from 'react';
import { useVenues } from '@repo/hooks';

// Jotai e store
import { useAtomValue, useAtom, useSetAtom } from 'jotai';
import { messageToast } from '@repo/ui/store/LayoutStore';
import { PrimaryButton } from '../../buttons/PrimaryButton';

export const BundleDetails = () => {
  const [form] = Form.useForm();

  // Array servizi disponibili per venue

  const [loading, setLoading] = useState(false); // Stato loading
  const [venueDetails, setVenueDetails] = useState<any>({});
  const { data, isLoading } = useVenues();
  const [selectedType, setSelectedType] = useState<'sala' | 'desk' | undefined>(undefined);

  const setMessage = useSetAtom(messageToast);

  // useEffect per caricamento dati venue esistenti
  // useEffect(() => {
  //   if (data && data.venue) {
  //     form.setFieldsValue({
  //       ...data.venue,
  //       avatarUrl: data.venue.avatarURL || '',
  //     });
  //     setVenueDetails(data.venue);
  //   }
  // }, [data, form]);

  // const onFinish = async (values: typeof venueDetails) => {
  //   setLoading(true);
  //   try {
  //     const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/venues`, {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         Authorization: `Bearer ${localStorage.getItem('token')}`,
  //       },
  //       body: JSON.stringify(values),
  //     });
  //     if (res.ok) {
  //       const data = await res.json();
  //       setVenueDetails(data.venue);
  //       setMessage({
  //         type: 'success',
  //         message: 'Dettagli aggiornati',
  //         duration: 3,
  //         placement: 'bottomRight',
  //       });
  //     } else {
  //       setMessage({
  //         type: 'error',
  //         message: 'Errore salvataggio',
  //         duration: 3,
  //         placement: 'bottomRight',
  //       });
  //     }
  //   } catch {
  //     setMessage({
  //       type: 'error',
  //       message: 'Errore salvataggio',
  //       duration: 3,
  //       placement: 'bottomRight',
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // if (isLoading) {
  //   return <div>Caricamento dati venue...</div>;
  // }

  return (
    <Form
      layout="vertical"
      style={{ width: '100%', borderRadius: 8 }}
      form={form}
      initialValues={venueDetails || {}}
      requiredMark={false}
      // onFinish={onFinish}
    >
      <Card>
        <Row gutter={[0, 0]}>
          <Col span={12}>
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Inserisci il Nome del Piano' }]}
            >
              <NibolInput
                validateTrigger="onSubmit"
                label="Nome del Piano"
                name="name"
                hideAsterisk={true}
                required={true}
                style={{ height: 32, width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="type"
              rules={[{ required: true, message: 'Inserisci il Tipo di Piano' }]}
              label="Tipo di Piano"
              style={{ marginTop: 10 }}
            >
              <Select
                defaultValue="Sala" //Qui devi passare il tipo dinamico alla scelta del cliente
                style={{ width: '100%', height: 32 }}
                options={[
                  { value: 'sala', label: 'Sala' },
                  { value: 'desk', label: 'Desk' },
                ]}
                onChange={value => {
                  setSelectedType(value as 'sala' | 'desk');

                  //resetCampi Condizionali se DESK|SALA
                  if (value === 'desk') {
                    form.setFieldsValue({ seats: undefined });
                  } else {
                    form.setFieldsValue({ capacity: undefined, squareMetres: undefined });
                  }
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        {/* //Campi Descrizione e Servizi
         */}

        <Form.Item name="description" label="Descrizione">
          <Input.TextArea style={{ height: 32, width: '100%', minHeight: 100 }} />
        </Form.Item>
        <Form.Item name="services" label="Servizi">
          <Select mode="tags" style={{ height: 28, width: '100%' }} />
        </Form.Item>

        {/* //Campi Condizionali */}

        {/* SE SALA */}
        {selectedType === 'sala' && (
          <Row gutter={[16, 0]}>
            <Col span={12}>
              <Form.Item
                name="capacity"
                label="Capienza"
                rules={[{ required: true, message: 'Inserisci la capienza' }]}
              >
                <Input type="number" min={1} style={{ width: 100 }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="squareMetres"
                label="Metri Quadrati"
                rules={[{ required: true, message: 'Inserisci i metri quadrati' }]}
              >
                <Input type="number" min={1} style={{ width: 100 }} />
              </Form.Item>
            </Col>
          </Row>
        )}

        {/* Se DESK */}
        {selectedType === 'desk' && (
          <Form.Item
            name="seats"
            label="Posti Disponibili"
            rules={[{ required: true, message: 'Inserisci i posti disponibili' }]}
          >
            <Input type="number" min={1} style={{ width: 100 }} />
          </Form.Item>
        )}

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
