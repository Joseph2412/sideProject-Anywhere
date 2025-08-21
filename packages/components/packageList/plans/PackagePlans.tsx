//Componente per la gestione dei piani di Abbonamento
//Ora, Giornaliero, Settimanale, Mensile, Annuale

import React, { useState, useEffect } from 'react';
import { Form, Divider, InputNumber, Switch, Row, Col, Typography, Card, Button } from 'antd';
import { useAtom, useSetAtom } from 'jotai';
import { messageToast } from '@repo/ui/store/ToastStore';
import { PackagesDetails } from './packagePlans.types';
import { PrimaryButton } from './../../buttons/PrimaryButton';
import { usePackages } from '@repo/hooks/src/usePackages';

export const PackagePlans = () => {
  const [setToastMessage] = useAtom(messageToast);
  // const [saving, setSaving] = useState<boolean>(false);

  // const [form] = Form.useForm();
  // const setMessage = useSetAtom(messageToast);

  // const data = { packages: [] };
  // const isLoading = false;
  // const [packagesDetails, setPackagesDetails] = useState<any>();

  //Ricontrolla: Sei stanco e questi forse dovevano andare su PackagesList

  // Stato di attivazione/disattivazione piano
  const [enabledPlan, setEnabledPlan] = useState<Record<string, boolean>>(() =>
    PlansRate.reduce(
      (acc, plan) => {
        acc[plan.value] = false;
        return acc;
      },
      {} as Record<string, boolean>
    )
  );

  //useEffect per richiamare i dati già presenti in Database
  // useEffect(() => {
  //   if (data && data.packages) {
  //     form.setFieldsValue({
  //       ...data.packages,
  //     });
  //     setPackagesDetails(data.packages);
  //   }
  // }, [data, form]); Sbagliati: Devi Richiamare Plans

  // Gestione attivazione/disattivazione piano
  const handleTogglePlan = (planValue: string, checked: boolean) => {
    setEnabledPlan(prev => ({
      ...prev,
      [planValue]: checked,
    }));
  };

  // Funzione per resettare il valore del prezzo e disabilitare il piano
  const resetFormValue = (planValue: string) => {
    setEnabledPlan(prev => ({ ...prev, [planValue]: false }));
  };

  //Funzione per inviare Update a Database // POTREBBE ANDARE BENE Ma usa Plan non Packages
  // const onFinish = async (values: typeof packagesDetails) => {
  //   setSaving(true);
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
  //       setPackagesDetails(data);
  //       setToastMessage({
  //         type: 'success',
  //         message: 'Piani aggiornati con successo',
  //       });
  //     }
  //   } catch (error) {
  //     console.error('Error updating plans:', error);
  //     setToastMessage({
  //       type: 'error',
  //       message: "Errore durante l'aggiornamento dei piani",
  //     });
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  return (
    <Form layout="vertical">
      {PlansRate.map(plan => (
        <Card key={plan.value} style={{ marginBottom: 16 }}>
          <Row align="middle" style={{ marginBottom: 0, marginTop: 0 }}>
            <Col flex="auto">
              <Form.Item style={{ marginBottom: 0, marginTop: 0 }}>
                <span style={{ fontWeight: 'bold' }}>{plan.name}</span>
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                name={[plan.value, 'isEnabled']}
                valuePropName="checked"
                style={{ marginBottom: 0, marginTop: 0 }}
              >
                <Switch
                  checked={enabledPlan[plan.value]}
                  onChange={checked => handleTogglePlan(plan.value, checked)}
                />
              </Form.Item>
            </Col>
          </Row>
          {enabledPlan[plan.value] && (
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
                <PrimaryButton htmlType="submit">Salva</PrimaryButton>
              </div>
            </Row>
          )}
        </Card>
      ))}
    </Form>
  );
};
