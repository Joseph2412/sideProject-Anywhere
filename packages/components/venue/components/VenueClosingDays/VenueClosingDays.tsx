import React, { useEffect, useRef, useState } from 'react';
import { useVenueClosingPeriods } from '@repo/hooks';
import {
  Switch,
  Button,
  DatePicker,
  Form,
  Row,
  Col,
  Divider,
  Card,
  Modal,
  Select,
  Space,
} from 'antd';
import { PrimaryButton } from '../../../buttons/PrimaryButton';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useSetAtom } from 'jotai';
import { messageToast } from '@repo/ui/store/ToastStore';

import type { FormListFieldData } from 'antd/es/form/FormList';
import { FormInstance } from 'antd/lib';

// Tipi per periodi di chiusura e festività

type ClosingPeriod = {
  id?: number;
  dates?: [Dayjs, Dayjs];
  singleDate?: Dayjs;
  isRange?: boolean;
};

type ClosingPeriodRaw = {
  id?: number;
  start: string;
  end: string;
};

type FormValues = {
  periods: ClosingPeriod[];
};

type Holiday = {
  date: string;
  localName: string;
  name: string;
  countryCode: string;
};

// Hook per gestire il toggle tra singolo giorno e range giorni
const useDatePickerToggle = (
  form: FormInstance<FormValues>,
  fieldName: (string | number)[],
  initialIsRange: boolean
) => {
  const [isRange, setIsRange] = useState(initialIsRange);
  const handleSwitchChange = (checked: boolean) => {
    setIsRange(checked);
    if (checked) {
      form.setFieldsValue({ [fieldName.concat('singleDate').join('.')]: undefined });
      form.setFieldsValue({ [fieldName.concat('isRange').join('.')]: true });
    } else {
      form.setFieldsValue({ [fieldName.concat('dates').join('.')]: undefined });
      form.setFieldsValue({ [fieldName.concat('isRange').join('.')]: false });
    }
  };
  return { isRange, handleSwitchChange };
};

// Lista dei paesi supportati
const COUNTRIES = [
  { value: 'IT', label: 'Italia' },
  { value: 'FR', label: 'Francia' },
  { value: 'DE', label: 'Germania' },
  { value: 'ES', label: 'Spagna' },
  { value: 'GB', label: 'Regno Unito' },
  { value: 'AT', label: 'Austria' },
  { value: 'BE', label: 'Belgio' },
  { value: 'CH', label: 'Svizzera' },
  { value: 'NL', label: 'Paesi Bassi' },
  { value: 'PT', label: 'Portogallo' },
];

export const VenueClosingDays: React.FC = () => {
  const [originalPeriods, setOriginalPeriods] = useState<ClosingPeriod[]>([]);

  const [form] = Form.useForm<FormValues>();
  const { RangePicker } = DatePicker;

  const addRef = useRef<((payload?: ClosingPeriod) => void) | null>(null);

  // Stati per il modal di importazione festività
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('IT');
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [loadingHolidays, setLoadingHolidays] = useState(false);

  // Hook per impostare i messaggi toast
  const setMessageToast = useSetAtom(messageToast);
  const { data, isLoading } = useVenueClosingPeriods();
  useEffect(() => {
    if (data && data.closingPeriods) {
      const formatted = (data.closingPeriods as ClosingPeriodRaw[]).map(p => {
        const startDate = dayjs(p.start);
        const endDate = dayjs(p.end);
        const isSameDay = startDate.isSame(endDate, 'day');
        return {
          id: p.id,
          isRange: !isSameDay,
          ...(isSameDay
            ? { singleDate: startDate }
            : { dates: [startDate, endDate] as [Dayjs, Dayjs] }),
        };
      });
      form.setFieldsValue({ periods: formatted });
      setOriginalPeriods(formatted);
    }
  }, [data, form]);

  // Componente per ogni periodo
  const PeriodRow: React.FC<{
    name: number;
    restField: FormListFieldData;
    remove: (name: number) => void;
  }> = ({ name, restField, remove }) => {
    // Ottieni il valore isRange dal form per questo campo specifico
    const fieldValue = form.getFieldValue(['periods', name]);
    const initialIsRange = fieldValue?.isRange ?? false;

    const { isRange, handleSwitchChange } = useDatePickerToggle(
      form,
      ['periods', name],
      initialIsRange
    );

    return (
      <Form.Item
        key={name}
        style={{ marginBottom: 15 }}
        label={isRange ? 'Periodo Dal - Al' : 'Periodo Giorno'}
      >
        <Row gutter={16} align="top">
          <Col flex="0 0 auto">
            <Switch onChange={handleSwitchChange} checked={isRange} style={{ marginTop: 0 }} />
          </Col>
          <Col flex="0 0 auto">
            <Space.Compact size="middle">
              {isRange ? (
                <Form.Item
                  {...restField}
                  name={[name, 'dates']}
                  style={{
                    marginBottom: 0,
                    marginRight: 10,
                  }}
                  rules={[
                    {
                      required: true,
                      message: 'Seleziona un intervallo di date',
                    },
                  ]}
                >
                  <RangePicker
                    style={{
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                    }}
                  />
                </Form.Item>
              ) : (
                <Form.Item
                  {...restField}
                  name={[name, 'singleDate']}
                  style={{
                    marginBottom: 0,
                    marginRight: 10,
                    borderTopRightRadius: 5,
                    borderBottomRightRadius: 5,
                  }}
                  rules={[
                    {
                      required: true,
                      message: 'Seleziona una data',
                    },
                  ]}
                >
                  <DatePicker
                    style={{
                      borderTopRightRadius: 5,
                      borderBottomRightRadius: 5,
                    }}
                  />
                </Form.Item>
              )}
              <Button
                onClick={() => remove(name)}
                style={{
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5,
                  marginTop: 0,
                  borderColor: '#D9D9D9',
                }}
              >
                Rimuovi
              </Button>
            </Space.Compact>
          </Col>
        </Row>
      </Form.Item>
    );
  };

  // Funzione per importare le festività
  const importHolidays = async () => {
    setLoadingHolidays(true);
    try {
      const response = await fetch(
        `https://date.nager.at/api/v3/PublicHolidays/${selectedYear}/${selectedCountry}`
      );

      if (!response.ok) {
        throw new Error('Errore nel recupero delle festività');
      }

      const holidays: Holiday[] = await response.json();

      // Converte le festività da API esterna in formato ClosingPeriod
      const holidayPeriods: ClosingPeriod[] = holidays.map((holiday, index) => {
        const holidayDate = dayjs(holiday.date);
        return {
          id: Date.now() + index,
          isRange: false,
          singleDate: holidayDate,
        };
      });

      // Ottieni i periodi esistenti dal form
      const currentPeriods = form.getFieldValue('periods') || [];

      // Aggiungi le festività ai periodi esistenti
      const updatedPeriods = [...currentPeriods, ...holidayPeriods];

      // Aggiorna il form
      form.setFieldsValue({ periods: updatedPeriods });

      setMessageToast({
        type: 'success',
        message: 'Festività importate',
        description: `${holidays.length} festività nazionali aggiunte per ${selectedCountry} ${selectedYear}`,
        duration: 3,
        placement: 'bottomRight',
      });

      setIsModalVisible(false);
    } catch (error) {
      console.error("Errore durante l'importazione:", error);
      setMessageToast({
        type: 'error',
        message: 'Errore',
        description: "Errore durante l'importazione delle festività nazionali.",
        duration: 3,
        placement: 'bottomRight',
      });
    } finally {
      setLoadingHolidays(false);
    }
  };

  const handleSave = async () => {
    const values = form.getFieldsValue();

    const closingPeriods = values.periods
      .filter((period: ClosingPeriod) => period.dates || period.singleDate)
      .map((period: ClosingPeriod) => ({
        id: period.id,
        start: period.singleDate ? period.singleDate.toISOString() : period.dates![0].toISOString(),
        end: period.singleDate ? period.singleDate.toISOString() : period.dates![1].toISOString(),
      }));

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/venues/closing-periods`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ closingPeriods }),
        }
      );

      if (!response.ok) {
        throw new Error('Errore durante il salvataggio');
      }

      setMessageToast({
        type: 'success',
        message: 'Successo',
        description: 'Periodi di chiusura salvati con successo.',
        duration: 3,
        placement: 'bottomRight',
      });

      // Ricarica i dati dopo il salvataggio
      const updatedResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/venues/closing-periods`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (updatedResponse.ok) {
        const updatedData = await updatedResponse.json();
        const formatted = (updatedData.closingPeriods as ClosingPeriodRaw[]).map(p => {
          const startDate = dayjs(p.start);
          const endDate = dayjs(p.end);
          const isSameDay = startDate.isSame(endDate, 'day');

          return {
            id: p.id,
            isRange: !isSameDay,
            ...(isSameDay
              ? { singleDate: startDate }
              : { dates: [startDate, endDate] as [Dayjs, Dayjs] }),
          };
        });

        form.setFieldsValue({ periods: formatted });
        setOriginalPeriods(formatted);
      }
    } catch (err) {
      console.error('Errore durante il salvataggio:', err);
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

  // Genera gli anni disponibili (anno corrente ± 5 anni)
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 11 }, (_, i) => {
    const year = currentYear - 5 + i;
    return { value: year, label: year.toString() };
  });

  if (isLoading) {
    return <div>Caricamento periodi di chiusura...</div>;
  }

  return (
    <>
      <Form form={form} layout="vertical" onFinish={handleSave}>
        <Card>
          <Row>
            <PrimaryButton
              style={{ width: 'auto', fontWeight: '500' }}
              onClick={() => setIsModalVisible(true)}
            >
              Importa festività nazionali
            </PrimaryButton>
          </Row>
          <Divider />
          <Col>
            <Form.List name="periods">
              {(fields, { add, remove }) => {
                addRef.current = add;
                return (
                  <div>
                    {fields.map(field => (
                      <PeriodRow
                        key={field.key}
                        name={field.name}
                        restField={field}
                        remove={remove}
                      />
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
                <Button onClick={handleCancel} style={{ borderColor: '#D9D9D9' }}>
                  Annulla
                </Button>
                <PrimaryButton htmlType="submit">Salva</PrimaryButton>
              </div>
              <Col>
                <Button onClick={() => addRef.current?.({ id: Date.now(), isRange: false })}>
                  Aggiungi
                </Button>
              </Col>
            </Row>
          </Col>
        </Card>
      </Form>

      {/* Modal per importazione festività */}
      <Modal
        title="Importa festività nazionali"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={
          <Space>
            <Button key="cancel" onClick={() => setIsModalVisible(false)}>
              Annulla
            </Button>
            <PrimaryButton
              key="import"
              type="primary"
              loading={loadingHolidays}
              onClick={importHolidays}
              style={{ color: 'white' }}
            >
              Importa
            </PrimaryButton>
          </Space>
        }
      >
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', marginBottom: 8 }}>Paese</label>
          <Select
            style={{ width: '100%' }}
            value={selectedCountry}
            onChange={setSelectedCountry}
            options={COUNTRIES}
          />
        </div>
        <div>
          <label style={{ display: 'block', marginBottom: 8 }}>Anno</label>
          <Select
            style={{ width: '100%' }}
            value={selectedYear}
            onChange={setSelectedYear}
            options={yearOptions}
          />
        </div>
      </Modal>
    </>
  );
};

export default VenueClosingDays;
