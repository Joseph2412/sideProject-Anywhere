import React, { useEffect, useState } from 'react';
import { Form, Divider, Button, Space, message, Spin } from 'antd';
import { OpeningHourData, weekDays } from './openingHours.types';
import { DayOpeningHours } from './DayOpeningHours';

export const VenueHoursForm: React.FC = () => {
  const [openingHoursState, setOpeningHoursState] = useState<Record<string, OpeningHourData>>({});
  const [initialOpeningHoursState, setInitialOpeningHoursState] = useState<
    Record<string, OpeningHourData>
  >({});

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchOpeningHours = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3001/api/venues/opening-hours', {
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
            acc[day.value] = data.openingHours.find((hour: any) => hour.day === day.value) || {
              isClosed: true,
              periods: [],
            };
            return acc;
          },
          {} as Record<string, OpeningHourData>
        );
        setOpeningHoursState(formattedData);
        setInitialOpeningHoursState(formattedData);
      } catch (error) {
        console.error(error);
        message.error('Errore nel recupero degli orari di apertura');
      } finally {
        setLoading(false);
      }
    };
    fetchOpeningHours();
  }, []);

  const handleSave = async () => {
    try {
      console.log('Dati inviati al backend:', openingHoursState);

      // Trasforma i dati per includere la proprietà 'day'
      const formattedOpeningHours = Object.entries(openingHoursState).map(([dayKey, data]) => ({
        day: dayKey,
        ...data,
      }));

      console.log('Dati formattati per il backend:', formattedOpeningHours);

      const res = await fetch('http://localhost:3001/api/venues/opening-hours', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ openingHours: formattedOpeningHours }),
      });

      const data = await res.json();
      console.log('Dati Inviati', data);

      if (!res.ok) {
        throw new Error('Errore durante il salvataggio degli orari di apertura');
      }

      message.success('Orari di apertura salvati con successo!');
      setInitialOpeningHoursState(openingHoursState);
    } catch (error) {
      console.error(error);
      message.error('Errore durante il salvataggio degli orari di apertura.');
    }
  };

  const handleUpdateDay = (dayKey: string, data: OpeningHourData) => {
    setOpeningHoursState(prev => ({
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
            openingHourData={
              openingHoursState[day.value] || {
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
        <Button onClick={() => setOpeningHoursState(initialOpeningHoursState)}>Annulla</Button>
        <Button type="primary" onClick={handleSave}>
          Salva
        </Button>
      </Space>
    </Form>
  );
};
