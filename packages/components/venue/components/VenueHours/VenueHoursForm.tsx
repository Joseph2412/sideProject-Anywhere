import React, { useEffect, useState } from 'react';
import { Form, Divider, Button, Space, Spin, Card } from 'antd';
import { OpeningDayData, weekDays } from './openingHours.types';
import { DayOpeningHours } from './DayOpeningHours';
import { useAtom } from 'jotai';
import { messageToast } from '@repo/ui/store/ToastStore';
import { useVenueOpeningDays, useUpdateVenueOpeningDays } from '@repo/hooks';
import { PrimaryButton } from './../../../buttons/PrimaryButton';

export const VenueHoursForm: React.FC = () => {
  const [openingDaysState, setOpeningDaysState] = useState<Record<string, OpeningDayData>>({});
  const [initialOpeningDaysState, setInitialOpeningDaysState] = useState<
    Record<string, OpeningDayData>
  >({});
  const [, setToastMessage] = useAtom(messageToast);
  const { data, isLoading } = useVenueOpeningDays();
  const updateOpeningDays = useUpdateVenueOpeningDays();
  const [saving, setSaving] = useState<boolean>(false);

  /**
   * useEffect per caricamento orari di apertura venue
   * Pattern: fetch → reduce per normalizzazione → deep copy per stato iniziale
   * Normalizzazione: combina weekDays template con dati backend
   * Deep copy: JSON.parse(JSON.stringify()) per stato iniziale immutabile
   */
  useEffect(() => {
    if (data && data.openingDays) {
      const formattedData = weekDays.reduce(
        (acc, day) => {
          const foundDay = data.openingDays?.find((hour: OpeningDayData) => hour.day === day.value);
          acc[day.value] = {
            day: day.value,
            isClosed: foundDay?.isClosed ?? true,
            periods: foundDay?.periods || [],
          };
          return acc;
        },
        {} as Record<string, OpeningDayData>
      );
      setOpeningDaysState(formattedData);
      setInitialOpeningDaysState(JSON.parse(JSON.stringify(formattedData)));
    }
  }, [data]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const formattedOpeningDays = Object.values(openingDaysState).map(dayData => ({
        day: dayData.day,
        isClosed: dayData.isClosed,
        periods: dayData.periods.filter(p => p.includes('-')),
      }));
      await updateOpeningDays.mutateAsync(formattedOpeningDays);
      setToastMessage({
        type: 'success',
        message: 'Orari di apertura salvati con successo!',
      });
      setInitialOpeningDaysState(JSON.parse(JSON.stringify(openingDaysState)));
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      setToastMessage({
        type: 'error',
        message: error instanceof Error ? error.message : 'Errore durante il salvataggio',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateDay = (dayKey: string, data: { isClosed: boolean; periods: string[] }) => {
    setOpeningDaysState(prev => ({
      ...prev,
      [dayKey]: {
        day: dayKey,
        ...data,
      },
    }));
  };

  const handleReset = () => {
    setOpeningDaysState(JSON.parse(JSON.stringify(initialOpeningDaysState)));
  };

  if (isLoading) {
    return (
      <Spin tip="Caricamento orari di apertura...">
        <div style={{ minHeight: 80 }} />
      </Spin>
    );
  }

  return (
    <Card style={{ marginRight: 16 }}>
      <Form layout="vertical">
        {weekDays.map(day => (
          <div key={day.value}>
            <DayOpeningHours
              day={day.label}
              dayKey={day.value}
              openingDayData={{
                isClosed: openingDaysState[day.value]?.isClosed ?? true,
                periods: openingDaysState[day.value]?.periods || [],
              }}
              onUpdateDay={handleUpdateDay}
            />
            <Divider style={{ marginTop: '16px' }} />
          </div>
        ))}

        <Space>
          <Button onClick={handleReset} disabled={saving} style={{ borderColor: '#D9D9D9' }}>
            Annulla
          </Button>
          <PrimaryButton type="primary" onClick={handleSave} loading={saving}>
            Salva
          </PrimaryButton>
        </Space>
      </Form>
    </Card>
  );
};
