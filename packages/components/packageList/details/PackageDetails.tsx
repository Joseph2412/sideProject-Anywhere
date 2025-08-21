import React, { useEffect } from 'react';

//Componete FORM DETTAGLI PACCHETTO

import { Form, Button, Upload, Avatar, Space, Row, Col, Card, Select, Tag, Input } from 'antd';

import { DeleteOutlined } from '@ant-design/icons';
import { NibolInput } from '../../inputs/Input';
import { useState } from 'react';
import { useVenues } from '@repo/hooks';

// Jotai e store
import { useAtomValue, useSetAtom, useAtom } from 'jotai';
import { messageToast } from '@repo/ui/store/LayoutStore';
import { PrimaryButton } from '../../buttons/PrimaryButton';
import { fetchPackagesAtom } from '@repo/ui/store/PackageFormStore';
import { useSearchParams, useParams } from 'next/navigation';

export const PackageDetails = () => {
  const searchParams = useSearchParams();
  const params = useParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const setMessage = useSetAtom(messageToast);
  const fetchPackages = useSetAtom(fetchPackagesAtom);

  // Stato locale per i valori del form, sempre sincronizzato con la query string o fetch
  const [details, setDetails] = useState<any>({});

  // Se c'è id nei params, fetch dei dati pacchetto, altrimenti usa la query string
  useEffect(() => {
    const id = params?.id;
    if (id) {
      setLoading(true);
      fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/packages/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
        .then(res => res.json())
        .then(data => {
          setDetails(data);
          form.setFieldsValue({
            name: data.name,
            type: data.type === 'Sala' ? 'SALA' : data.type === 'Desk' ? 'DESK' : data.type,
            description: data.description,
            services: data.services,
            capacity: data.capacity,
            squareMetres: data.squareMetres,
            seats: data.seats,
            // aggiungi qui plans e immagini se servono
          });
        })
        .finally(() => setLoading(false));
    } else {
      const name = searchParams.get('name') || '';
      const type = searchParams.get('type') || '';
      const mappedType = type === 'Sala' ? 'SALA' : type === 'Desk' ? 'DESK' : undefined;
      setDetails({ name, type });
      form.setFieldsValue({ name, type: mappedType });
    }
  }, [params, searchParams, form]);

  // Calcola direttamente il tipo selezionato dall'atomo
  const selectedType = details?.type ? (details.type.toLowerCase() as 'sala' | 'desk') : undefined;

  // Gestione submit del form per aggiornare i dati
  const handleFinish = async (values: any) => {
    setLoading(true);
    const id = params?.id;
    try {
      let url = '';
      let method: 'POST' | 'PUT' = 'POST';
      let successMsg = '';
      if (id) {
        url = `${process.env.NEXT_PUBLIC_API_HOST}/api/packages/${id}`;
        method = 'PUT';
        successMsg = 'Pacchetto aggiornato!';
      } else {
        url = `${process.env.NEXT_PUBLIC_API_HOST}/api/packages/add`;
        method = 'POST';
        successMsg = 'Pacchetto aggiunto!';
      }
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        const data = await res.json();
        setDetails(data);
        setMessage({ type: 'success', message: successMsg });
        await fetchPackages();
      } else {
        setMessage({ type: 'error', message: 'Errore durante la richiesta' });
      }
    } catch (error) {
      setMessage({ type: 'error', message: 'Errore durante la richiesta' });
    } finally {
      setLoading(false);
    }
  };

  // Sincronizza i valori del form con details ogni volta che details cambia
  useEffect(() => {
    // Ogni volta che details cambia (es. da onValuesChange), aggiorna il form
    if (details) {
      form.setFieldsValue({
        name: details.name,
        type: details.type === 'Sala' ? 'SALA' : details.type === 'Desk' ? 'DESK' : details.type,
      });
    }
  }, [details, form]);

  return (
    <Form
      layout="vertical"
      style={{ width: '100%', borderRadius: 8 }}
      form={form}
      requiredMark={false}
      validateTrigger="onSubmit"
      onValuesChange={(_, allValues) => {
        if (!details) return;
        setDetails({
          ...details,
          ...allValues,
          type: allValues.type ? (allValues.type as 'Sala' | 'Desk') : details.type,
        });
      }}
      onFinish={handleFinish}
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
              rules={[{ required: true, message: 'Specifica la Tipologia' }]}
              label="Tipologia"
              style={{ marginTop: 10 }}
            >
              <Select
                style={{ width: '100%', height: 32 }}
                options={[
                  { value: 'SALA', label: 'Sala' },
                  { value: 'DESK', label: 'Desk' },
                ]}
                onChange={value => {
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
        <Form.Item
          name="description"
          label="Descrizione"
          rules={[{ required: true, message: 'Inserisci una descrizione' }]}
        >
          <Input.TextArea style={{ height: 32, width: '100%', minHeight: 100 }} />
        </Form.Item>
        <Form.Item name="services" label="Servizi">
          <Select mode="tags" style={{ height: 28, width: '100%' }} />
        </Form.Item>

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
                label="Metri Quadrati (m²)"
                rules={[{ required: true, message: 'Inserisci i metri quadrati' }]}
              >
                <Input type="number" min={1} style={{ width: 100 }} />
              </Form.Item>
            </Col>
          </Row>
        )}

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
                form.resetFields();
                form.setFieldsValue(details);
              }}
              disabled={loading}
            >
              Annulla
            </Button>
            <PrimaryButton type="primary" htmlType="submit" disabled={loading} loading={loading}>
              Salva
            </PrimaryButton>
          </Space>
        </Form.Item>
      </Card>
    </Form>
  );
};
