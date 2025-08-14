import React, { useEffect, useRef, useState } from 'react';
import { Switch, Button, DatePicker, Form, Row, Col, Divider, Card } from 'antd';
import { PrimaryButton } from '../../../buttons/PrimaryButton';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useSetAtom } from 'jotai';
import { messageToast } from '@repo/ui/store/ToastStore';

type ClosingPeriod = {
  id: number;
  isClosed: boolean;
  dates?: [Dayjs, Dayjs];
};

type FormValues = {
  periods: ClosingPeriod[];
};

export const VenueClosingDays: React.FC = () => {
  const [originalPeriods, setOriginalPeriods] = useState<ClosingPeriod[]>([]);
  const [form] = Form.useForm<FormValues>();
  const { RangePicker } = DatePicker;
  const addRef = useRef<((payload?: ClosingPeriod) => void) | null>(null);

  // Hook per impostare i messaggi toast
  const setMessageToast = useSetAtom(messageToast);

  useEffect(() => {
    fetch('http://localhost:3001/api/venues/closing-periods', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        const formatted = data.closingPeriods.map((p: any) => ({
          isClosed: p.isClosed,
          dates: [dayjs(p.start), dayjs(p.end)],
        }));
        form.setFieldsValue({ periods: formatted });
        setOriginalPeriods(formatted);
      })
      .catch((err: Error) => {
        console.error('Errore durante il fetch:', err);
      });
  }, [form]);

  const handleSave = async () => {
    const values = form.getFieldsValue();

    const closingPeriods = values.periods
      .filter((p: ClosingPeriod) => p.dates)
      .map((p: ClosingPeriod) => ({
        id: p.id,
        isClosed: p.isClosed,
        start: p.dates![0].toISOString(),
        end: p.dates![1].toISOString(),
      }));

    const originalPeriodsMapped = originalPeriods.map(p => ({
      id: p.id,
      isClosed: p.isClosed,
      start: p.dates![0].toISOString(),
      end: p.dates![1].toISOString(),
    }));

    console.log('Request body:', {
      closingPeriods,
      originalPeriods: originalPeriodsMapped,
    });

    try {
      await fetch('http://localhost:3001/api/venues/closing-periods', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          closingPeriods,
          originalPeriods: originalPeriodsMapped,
        }),
      });

      setMessageToast({
        type: 'success',
        message: 'Successo',
        description: 'Periodi di chiusura salvati con successo.',
        duration: 3,
        placement: 'bottomRight',
      });

      setOriginalPeriods(values.periods);
    } catch (err) {
      setMessageToast({
        type: 'error',
        message: 'Errore',
        description: 'Errore durante il salvataggio dei periodi di chiusura.',
        duration: 3,
        placement: 'bottomRight',
      });
    }
  };

  const handleCancel = () => {
    form.setFieldsValue({ periods: originalPeriods });
  };

  return (
    <Form form={form} layout="vertical" onFinish={handleSave}>
      <Card>
        <Row>
          <PrimaryButton style={{ width: 'auto' }}>Importa Festività Nazionali</PrimaryButton>
        </Row>
        <Divider />
        <Col>
          <Form.List name="periods">
            {(fields, { add, remove }) => {
              addRef.current = (payload?: ClosingPeriod) => add(payload);

              return (
                <div>
                  {fields.map(({ key, name, ...restField }) => (
                    <Form.Item key={key} label="Periodo Dal - Al" style={{ marginBottom: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Form.Item
                          {...restField}
                          name={[name, 'isClosed']}
                          valuePropName="checked"
                          initialValue={false}
                        >
                          <Switch />
                        </Form.Item>
                        <Form.Item noStyle dependencies={[['periods', name, 'isClosed']]}>
                          {({ getFieldValue }) => {
                            const enabled = getFieldValue(['periods', name, 'isClosed']);
                            return (
                              <Form.Item
                                {...restField}
                                name={[name, 'dates']}
                                rules={
                                  enabled
                                    ? [
                                        {
                                          required: true,
                                          message: 'Seleziona un intervallo di date',
                                        },
                                      ]
                                    : []
                                }
                              >
                                <RangePicker disabled={!enabled} />
                              </Form.Item>
                            );
                          }}
                        </Form.Item>
                        <Button onClick={() => remove(name)}>Rimuovi</Button>
                      </div>
                    </Form.Item>
                  ))}
                </div>
              );
            }}
          </Form.List>

          <Row
            style={{
              marginTop: 15,
              gap: 15,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', gap: 15 }}>
              <Button onClick={handleCancel}>Annulla</Button>
              <PrimaryButton htmlType="submit">Salva</PrimaryButton>
            </div>
            <Col>
              <Button onClick={() => addRef.current?.({ id: Date.now(), isClosed: true })}>
                Aggiungi
              </Button>
            </Col>
          </Row>
        </Col>
      </Card>
    </Form>
  );
};

export default VenueClosingDays;
