import React, { useRef } from 'react';
import { Switch, Button, DatePicker, Form, Row, Col, Divider, Card } from 'antd';
import { PrimaryButton } from '../../../buttons/PrimaryButton';
import type { Dayjs } from 'dayjs';

type ClosingPeriod = {
  isEnabled: boolean;
  dates?: [Dayjs, Dayjs]; // il RangePicker produce una tupla di Dayjs
};

// type ClosedDaysState = {
//   isClosed: boolean;
//   periods: ClosingPeriod[];
// };

type FormValues = {
  periods: ClosingPeriod[];
};

// type Props = {
//   day: string;
//   dayKey: string;
//   periods: ClosingPeriod[];
//   onToggleDisabled: (e: SwitchChangeEventHandler) => void;
//   setClosedDaysState: React.Dispatch<React.SetStateAction<Record<string, ClosedDaysState>>>;
// };

// const handleAdd = (index: number) => {
//   const updated = [...periods]; //Ripesca i precedenti periodi di chiusura
//   updated[index] = [dayjs('09:00', 'HH:mm'), dayjs('18:00', 'HH:mm')];
//   setClosingDaysState(prev: => ({
//     ...prev, //Dati Precedenti
//     [dayKey]: { ...prev[dayKey]!, periods: updated },
//   }));
// };

// const handleRemove = (index: number) => {
//   //hook per levare periodi di chiusura
//   const updated = [...periods];
//   updated.splice(index, 1);
//   setClosingDaysState(prev => ({
//     ...prev,
//     [dayKey]: { ...prev[dayKey]!, periods: updated },
//   }));
// };

export const VenueClosingDays: React.FC = () => {
  const [form] = Form.useForm<FormValues>();
  const { RangePicker } = DatePicker;
  const addRef = useRef<((payload?: ClosingPeriod) => void) | null>(null);

  return (
    <Form form={form} layout="vertical">
      <Card>
        <Row>
          <PrimaryButton style={{ width: 'auto' }}>Importa Festività Nazionali</PrimaryButton>
        </Row>
        <Divider></Divider>
        <Col>
          <Form.List name="periods">
            {(fields, { add, remove }) => {
              addRef.current = (payload?: ClosingPeriod) => add(payload);

              return (
                <div>
                  {fields.map(({ key, name, ...restField }) => (
                    <Form.Item key={key} label="Periodo Dal-Al" style={{ marginBottom: 0 }}>
                      <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Form.Item
                          {...restField}
                          name={[name, 'isEnabled']}
                          valuePropName="checked"
                          initialValue={false}
                        >
                          <Switch />
                        </Form.Item>
                        <Form.Item
                          noStyle
                          dependencies={[['periods', name, 'isEnabled']]} // osserva solo questo campo
                        >
                          {({ getFieldValue }) => {
                            const enabled = getFieldValue(['periods', name, 'isEnabled']);

                            return (
                              <Form.Item
                                {...restField}
                                name={[name, 'dates']}
                                rules={
                                  enabled ? [{ required: true, message: 'Seleziona una Data' }] : []
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
              <Button onClick={() => form.resetFields()}>Annulla</Button>
              <PrimaryButton htmlType="submit">Salva</PrimaryButton>
            </div>
            <Col>
              <Button onClick={() => addRef.current?.({ isEnabled: false })}>Aggiungi</Button>
            </Col>
          </Row>
        </Col>
      </Card>
    </Form>
  );
};

export default VenueClosingDays;
