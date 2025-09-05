//Componente per la gestione dei piani di Abbonamento
//Ora, Giornaliero, Settimanale, Mensile, Annuale

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Form, InputNumber, Switch, Row, Col, Typography, Card, Button } from 'antd';
import { useSetAtom } from 'jotai';
import { messageToast } from '@repo/ui/store/ToastStore';
import { PrimaryButton } from './../../buttons/PrimaryButton';
import type { PlanRateData } from './packagePlans.types';
import { PlansRate } from './packagePlans.types';

import { useMutation, useQueryClient } from '@tanstack/react-query'; //Serve per lo switch

export const PackagePlans = () => {
  const params = useParams();
  const packageId = params?.id;
  const setToastMessage = useSetAtom(messageToast);
  const [saving, setSaving] = useState<boolean>(false);

  // Mappa ausiliaria per id dei piani
  const [planIdMap, setPlanIdMap] = useState<Record<string, number | null>>({});

  // Define plans array
  // Usa la costante PlansRate dal file dei tipi, ma in lowercase per il frontend
  const plans = PlansRate.map(p => ({ ...p, value: p.value.toLowerCase() }));

  // Serve il form instance per resettare i valori
  const [form] = Form.useForm();

  const queryClient = useQueryClient();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/packages/${packageId}/plans`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        const plansData: PlanRateData[] = Array.isArray(data) ? data : [];
        const formValues: Record<
          string,
          { isEnabled: boolean; price: number | string | undefined }
        > = {};
        // Costruisci la mappa ausiliaria degli id
        const idMap: Record<string, number | null> = {};
        plansData.forEach(plan => {
          // Normalizza la chiave in lowercase per compatibilità frontend-backend
          const rateKey = typeof plan.rate === 'string' ? plan.rate.toLowerCase() : '';
          formValues[rateKey] = {
            isEnabled: !!plan.isEnabled,
            price: plan.price ?? undefined,
          };
          idMap[rateKey] = plan.id ?? null;
        });
        setPlanIdMap(idMap);
        form.setFieldsValue(formValues);
        setEnabledPlan(prev => ({
          ...prev,
          ...Object.fromEntries(
            plansData.map(plan => [plan.rate?.toLowerCase?.() ?? '', !!plan.isEnabled])
          ),
        }));
      })
      .catch(() => {
        setEnabledPlan(prev => ({ ...prev }));
      });
  }, [packageId, form]);

  const updatePlans = useMutation({
    mutationFn: async (plansToUpdate: PlanRateData[]) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/packages/${packageId}/plans`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(plansToUpdate),
        }
      );
      if (!res.ok) throw new Error('Errore aggiornamento piano');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      setToastMessage({
        type: 'success',
        message: 'Piano aggiornato con successo',
        placement: 'bottomRight',
      });
    },
    onError: () => {
      setToastMessage({
        type: 'error',
        message: "Errore durante l'aggiornamento del piano",
        placement: 'bottomRight',
      });
    },
  });

  // Stato di attivazione/disattivazione dei piani (default: tutti disabilitati)
  const [enabledPlan, setEnabledPlan] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(plans.map(plan => [plan.value, false]))
  );

  // Gestione attivazione/disattivazione piano + Salvataggio RUNTIME
  const handleTogglePlan = (planValue: string, checked: boolean) => {
    setEnabledPlan(prev => ({
      ...prev,
      [planValue]: checked,
    }));
    form.setFieldsValue({ [planValue]: { ...form.getFieldValue(planValue), isEnabled: checked } });

    if (planIdMap[planValue]) {
      // Prepara il piano da aggiornare
      const planData = form.getFieldValue(planValue) || {};
      const plan = plans.find(p => p.value === planValue);
      updatePlans.mutate([
        {
          id: planIdMap[planValue]!,
          name: plan?.name ?? '',
          rate: planValue.toUpperCase(),
          isEnabled: checked,
          price: planData.price ?? 0,
        },
      ]);
    }
  };

  // Funzione per resettare il valore del prezzo e disabilitare il piano
  const resetFormValue = (planValue: string) => {
    handleTogglePlan(planValue, false);
    form.setFieldsValue({ [planValue]: { isEnabled: false, price: undefined } });
  };

  // Funzione per inviare Update/Aggiunta a Database
  const onFinish = async (
    values: Record<string, { isEnabled: boolean; price: number | string | undefined }>
  ) => {
    setSaving(true);

    // Normalizza: imposta isEnabled a false se undefined
    plans.forEach(plan => {
      if (typeof values[plan.value]?.isEnabled === 'undefined') {
        values[plan.value] = { isEnabled: false, price: undefined };
      }
    });

    // Prepara l'array dei piani da inviare
    const plansArray: PlanRateData[] = plans.map(plan => {
      const v = values[plan.value] || { isEnabled: false, price: undefined };
      // Se non esiste id, passo undefined (mai null)
      const planId = planIdMap[plan.value.toLowerCase()];
      let priceValue = v.price;
      if (typeof priceValue === 'string') {
        priceValue = priceValue.replace(',', '.');
        priceValue = priceValue === '' ? 0 : Number(priceValue);
      }
      return {
        id: typeof planId === 'number' ? planId : undefined,
        name: plan.name,
        rate: plan.value.toUpperCase(), // backend expects uppercase
        isEnabled: !!v.isEnabled,
        price:
          !!v.isEnabled && typeof priceValue === 'number' && !isNaN(priceValue) ? priceValue : 0,
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
        <Card
          key={plan.value}
          style={{
            marginBottom: 16,
          }}
        >
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
                    required
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
                  Salva
                </PrimaryButton>
              </div>
            </Row>
          )}
        </Card>
      ))}
    </Form>
  );
};
