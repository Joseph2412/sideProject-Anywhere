import React, { useEffect, useState } from 'react';
import { Form, Divider, Button, Space, message, Spin } from 'antd';
import { OpeningDayData, weekDays } from './openingHours.types';
import { DayOpeningHours } from './DayOpeningHours';

export const VenueHoursForm: React.FC = () => {
  const [openingDaysState, setOpeningDaysState] = useState<Record<string, OpeningDayData>>({});
  const [initialOpeningDaysState, setInitialOpeningDaysState] = useState<
    Record<string, OpeningDayData>
  >({});

  const [loading, setLoading] = useState<boolean>(true);

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
        const formattedData = weekDays.reduce(
          (acc, day) => {
            acc[day.value] = data.openingDays.find((hour: any) => hour.day === day.value) || {
              isClosed: true,
              periods: [],
            };
            return acc;
          },
          {} as Record<string, OpeningDayData>
        );
        setOpeningDaysState(formattedData);
        setInitialOpeningDaysState(formattedData);
      } catch (error) {
        console.error(error);
        message.error('Errore nel recupero degli orari di apertura');
      } finally {
        setLoading(false);
      }
    };
    fetchOpeningDays();
  }, []);

  const handleSave = async () => {
    try {
      console.log('Dati inviati al backend:', openingDaysState);

      // Trasforma i dati per includere la proprietà 'day'
      const formattedOpeningDays = Object.entries(openingDaysState).map(([dayKey, data]) => ({
        day: dayKey,
        ...data,
      }));

      console.log('Dati formattati per il backend:', formattedOpeningDays);

      const res = await fetch('http://localhost:3001/api/venues/opening-hours', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ openingDays: formattedOpeningDays }),
      });

      const data = await res.json();
      console.log('Dati Inviati', data);

      if (!res.ok) {
        throw new Error('Errore durante il salvataggio degli orari di apertura');
      }

      message.success('Orari di apertura salvati con successo!');
      setInitialOpeningDaysState(openingDaysState);
    } catch (error) {
      console.error(error);
      message.error('Errore durante il salvataggio degli orari di apertura.');
    }
  };

  const handleUpdateDay = (dayKey: string, data: OpeningDayData) => {
    setOpeningDaysState(prev => ({
      ...prev,
      [dayKey]: data,
    }));
  };

  if (loading) {
    return <Spin tip="Caricamento in corso..." />;
  }

  return (
    <Form layout="vertical">
      {weekDays.map(day => (
        <div key={day.value}>
          <DayOpeningHours
            day={day.label}
            dayKey={day.value}
            openingDayData={
              openingDaysState[day.value] || {
                isClosed: true,
                periods: [],
              }
            }
            onUpdateDay={handleUpdateDay}
          />
          <Divider />
        </div>
      ))}

      <Space style={{ marginTop: 24 }}>
        <Button onClick={() => setOpeningDaysState(initialOpeningDaysState)}>Annulla</Button>
        <Button type="primary" onClick={handleSave}>
          Salva
        </Button>
      </Space>
    </Form>
  );
};
