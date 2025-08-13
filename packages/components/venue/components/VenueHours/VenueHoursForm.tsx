import React, { useEffect, useState } from 'react';
import { Form, Divider, Button, Space, Spin } from 'antd';
import { OpeningDayData, weekDays } from './openingHours.types';
import { DayOpeningHours } from './DayOpeningHours';
import { useAtom } from 'jotai';
import { messageToast } from '@repo/ui/store/ToastStore';

export const VenueHoursForm: React.FC = () => {
  const [openingDaysState, setOpeningDaysState] = useState<Record<string, OpeningDayData>>({});
  const [initialOpeningDaysState, setInitialOpeningDaysState] = useState<
    Record<string, OpeningDayData>
  >({});
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [, setToastMessage] = useAtom(messageToast);

  useEffect(() => {
    const fetchOpeningDays = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3001/api/venues/opening-days', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!res.ok) {
          throw new Error('Errore nel recupero degli orari di apertura');
        }

        const data = await res.json();
        console.log('Dati ricevuti dal backend:', data);

        // Mappa direttamente i dati con boolean e array stringhe
        const formattedData = weekDays.reduce(
          (acc, day) => {
            const foundDay = data.openingDays?.find((hour: any) => hour.day === day.value);
            acc[day.value] = {
              day: day.value,
              isClosed: foundDay?.isClosed ?? true, // Boolean diretto
              periods: foundDay?.periods || [], // Array stringhe diretto
            };
            return acc;
          },
          {} as Record<string, OpeningDayData>
        );

        setOpeningDaysState(formattedData);
        setInitialOpeningDaysState(JSON.parse(JSON.stringify(formattedData)));
      } catch (error) {
        console.error('Errore nel fetch degli orari:', error);
        setToastMessage({
          type: 'error',
          message: 'Errore nel recupero degli orari di apertura',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOpeningDays();
  }, [setToastMessage]);

  const handleSave = async () => {
    setSaving(true);
    try {
      console.log('Dati da inviare al backend:', openingDaysState);

      // Trasforma in array per il backend - 🎯 INVIA sempre tutti i periodi
      const formattedOpeningDays = Object.values(openingDaysState).map(dayData => ({
        day: dayData.day,
        isClosed: dayData.isClosed, // Boolean diretto
        periods: dayData.periods.filter(p => p.includes('-')), // 🎯 TUTTI i periodi validi
      }));

      console.log('Dati formattati per il backend:', formattedOpeningDays);

      const res = await fetch('http://localhost:3001/api/venues/opening-days', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ openingDays: formattedOpeningDays }),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || 'Errore durante il salvataggio');
      }

      // Usa messageToast come nel resto del codebase
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

  if (loading) {
    return <Spin tip="Caricamento orari di apertura..." />;
  }

  return (
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
          <Divider />
        </div>
      ))}

      <Space style={{ marginTop: 24 }}>
        <Button onClick={handleReset} disabled={saving}>
          Annulla
        </Button>
        <Button type="primary" onClick={handleSave} loading={saving}>
          Salva
        </Button>
      </Space>
    </Form>
  );
};
