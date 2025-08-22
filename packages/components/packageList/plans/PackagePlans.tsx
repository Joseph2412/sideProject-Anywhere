//Componente per la gestione dei piani di Abbonamento
//Ora, Giornaliero, Settimanale, Mensile, Annuale

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Form, Divider, InputNumber, Switch, Row, Col, Typography, Card, Button } from 'antd';
import { useSetAtom } from 'jotai';
import { messageToast } from '@repo/ui/store/ToastStore';
import { PrimaryButton } from './../../buttons/PrimaryButton';
import { usePackages } from '@repo/hooks/src/usePackages';

export const PackagePlans = () => {
  const params = useParams();
  const packageId = params?.id;
  const setToastMessage = useSetAtom(messageToast);
  const [saving, setSaving] = useState<boolean>(false);
  const [packagesDetails, setPackagesDetails] = useState<any>();

  // Define plans array
  const plans = [
    { value: 'hourly', name: 'Orario', label: 'ora' },
    { value: 'daily', name: 'Giornaliero', label: 'giorno' },
    { value: 'weekly', name: 'Settimanale', label: 'settimana' },
    { value: 'monthly', name: 'Mensile', label: 'mese' },
    { value: 'yearly', name: 'Annuale', label: 'anno' },
  ];

  // Stato di attivazione/disattivazione dei piani
  const [enabledPlan, setEnabledPlan] = useState<Record<string, boolean>>(() =>
    plans.reduce(
      (acc, plan) => {
        acc[plan.value] = false;
        return acc;
      },
      {} as Record<string, boolean>
    )
  );

  const [initialPlanValues, setInitialPlanValues] = useState<
    Record<string, { isEnabled: boolean; price?: number }>
  >(() =>
    plans.reduce(
      (acc, plan) => {
        acc[plan.value] = { isEnabled: false, price: undefined };
        return acc;
      },
      {} as Record<string, { isEnabled: boolean; price?: number }>
    )
  );

  // Serve il form instance per resettare i valori
  const [form] = Form.useForm();

  // Gestione attivazione/disattivazione piano
  const handleTogglePlan = (planValue: string, checked: boolean) => {
    setEnabledPlan(prev => ({
      ...prev,
      [planValue]: checked,
    }));
    form.setFieldsValue({ [planValue]: { ...form.getFieldValue(planValue), isEnabled: checked } });
  };

  // Funzione per resettare il valore del prezzo e disabilitare il piano
  const resetFormValue = (planValue: string) => {
    handleTogglePlan(planValue, false);
    form.setFieldsValue({ [planValue]: { isEnabled: false, price: undefined } });
  };

  // Funzione per inviare Update/Aggiunta a Database
  const onFinish = async (values: any) => {
    setSaving(true);

    const plansArray = Object.entries(values)
      .filter(([_, v]) => (v as { isEnabled: boolean }).isEnabled)
      .map(([type, v]) => {
        const planMeta = plans.find(plan => plan.value === type);
        // Recupera l'id se lo hai nei dettagli caricati, altrimenti null
        const planId = packagesDetails?.find((p: any) => p.rate === type)?.id ?? null;
        return {
          id: planId,
          name: planMeta?.name,
          rate: type,
          isEnabled: (v as { isEnabled: boolean }).isEnabled,
          price: (v as { price: number }).price,
        };
      });

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/packages/${packageId}/plans`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(plansArray),
        }
      );
      if (res.ok) {
        const data = await res.json();
        setPackagesDetails(data);
        setToastMessage({
          type: 'success',
          message: 'Piani aggiornati con successo',
        });
      } else {
        setToastMessage({
          type: 'error',
          message: "Errore durante l'aggiornamento dei piani",
        });
      }
    } catch (error) {
      console.error('Error updating plans:', error);
      setToastMessage({
        type: 'error',
        message: "Errore durante l'aggiornamento dei piani",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Form layout="vertical" form={form} onFinish={onFinish}>
      {plans.map(plan => (
        <Card key={plan.value} style={{ marginBottom: 16 }}>
          <Row align="middle" style={{ marginBottom: 0, marginTop: 0 }}>
            <Col flex="auto">
              <span style={{ fontWeight: 'bold' }}>{plan.name}</span>
            </Col>
            <Col>
              <Form.Item
                name={[plan.value, 'isEnabled']}
                valuePropName="checked"
                style={{ marginBottom: 0, marginTop: 0 }}
              >
                <Switch
                  checked={form.getFieldValue([plan.value, 'isEnabled']) ?? enabledPlan[plan.value]}
                  onChange={checked => handleTogglePlan(plan.value, checked)}
                />
              </Form.Item>
            </Col>
          </Row>
          {(form.getFieldValue([plan.value, 'isEnabled']) ?? enabledPlan[plan.value]) && (
            <Row>
              <Col span={24}>
                <Form.Item
                  label={<span style={{ fontWeight: 400 }}>Prezzo / {plan.label}</span>}
                  name={[plan.value, 'price']}
                  style={{ marginBottom: 4, marginTop: 0 }}
                >
                  <InputNumber
                    min={0}
                    precision={2}
                    decimalSeparator=","
                    step={0.01}
                    stringMode
                    style={{ width: 120 }}
                  />
                </Form.Item>
                <Typography.Text type="secondary" style={{ fontSize: 12 }}>
                  Inserisci il prezzo iva inclusa.
                </Typography.Text>
              </Col>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginTop: 16,
                  gap: 12,
                }}
              >
                <Button onClick={() => resetFormValue(plan.value)}>Annulla</Button>
                <PrimaryButton htmlType="submit" loading={saving}>
                  Prova
                </PrimaryButton>
              </div>
            </Row>
          )}
        </Card>
      ))}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}></div>
    </Form>
  );
};

// ...
