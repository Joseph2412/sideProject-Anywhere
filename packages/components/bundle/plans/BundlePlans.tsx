import React, { useState } from 'react';
import { Form, Divider, InputNumber, Switch, Row, Col, Typography } from 'antd';
import { useAtom } from 'jotai';
import { messageToast } from '@repo/ui/store/ToastStore';
import { PlansRate } from './bundlePlans.types';

export const BundlePlans = () => {
  const [setToastMessage] = useAtom(messageToast);
  const [saving, setSaving] = useState<boolean>(false);

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

  // Gestione attivazione/disattivazione piano
  const handleTogglePlan = (planValue: string, checked: boolean) => {
    setEnabledPlan(prev => ({
      ...prev,
      [planValue]: checked,
    }));
  };

  return (
    <Form layout="vertical">
      {PlansRate.map((plan, idx) => (
        <React.Fragment key={plan.value}>
          {/* Prima row: nome piano e switch */}
          <Row align="middle" style={{ background: '#fff' }}>
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
          {/* Seconda row: dettagli piano se attivo */}
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
            </Row>
          )}
          {idx < PlansRate.length - 1 && <Divider style={{ margin: '16px 0' }} />}
        </React.Fragment>
      ))}
    </Form>
  );
};
