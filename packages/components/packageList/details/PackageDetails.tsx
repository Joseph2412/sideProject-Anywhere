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
import { fetchPackagesAtom, packageFormAtom } from '@repo/ui/store/PackageFormStore';

export const PackageDetails = () => {
  const [details, setDetails] = useAtom(packageFormAtom);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const setMessage = useSetAtom(messageToast);
  const fetchPackages = useSetAtom(fetchPackagesAtom);

  // Carica i dati precedenti dal database all'avvio
  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/packages`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setDetails(data);
          form.setFieldsValue(data);
        }
      } catch (error) {
        setMessage({ type: 'error', message: 'Errore nel caricamento dettagli pacchetto' });
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setDetails, setMessage]);

  // Calcola direttamente il tipo selezionato dall'atomo
  const selectedType = details?.type ? (details.type.toLowerCase() as 'sala' | 'desk') : undefined;

  // Gestione submit del form per aggiornare i dati
  const handleFinish = async (values: any) => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/packages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        const data = await res.json();
        setDetails(data);
        setMessage({ type: 'success', message: 'Pacchetto aggiunto!' });
        await fetchPackages();
      } else {
        setMessage({ type: 'error', message: 'Errore durante aggiunta pacchetto' });
      }
    } catch (error) {
      setMessage({ type: 'error', message: 'Errore durante aggiunta pacchetto' });
    } finally {
      setLoading(false);
    }
  };

  // Sincronizza i valori del form con details ogni volta che details cambia
  useEffect(() => {
    if (details) {
      form.setFieldsValue(details);
    }
  }, [details, form]);

  return (
    <Form
      layout="vertical"
      style={{ width: '100%', borderRadius: 8 }}
      form={form}
      requiredMark={false}
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
                name="title"
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
        <Form.Item name="description" label="Descrizione">
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
