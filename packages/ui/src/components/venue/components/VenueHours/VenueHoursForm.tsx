import React, { useEffect, useState } from 'react';
import { Form, Divider, Button, Space } from 'antd';
import { OpeningHourData, weekDays } from './openingHours.types';
import { DayOpeningHours } from './DayOpeningHours';

// ✅ Usa il nuovo tipo invece di DayOpeningState
export const VenueHoursForm: React.FC = () => {
  const [openingHoursState, setOpeningHoursState] = useState<Record<string, OpeningHourData>>({});
  const [initialOpeningHoursState, setInitialOpeningHoursState] = useState<
    Record<string, OpeningHourData>
  >({});

  useEffect(() => {
    const dataFromDb: Record<string, OpeningHourData> = weekDays.reduce(
      (acc, day) => {
        acc[day.value] = {
          isClosed: false,
          periods: [],
        };
        return acc;
      },
      {} as Record<string, OpeningHourData>
    );

    setOpeningHoursState(dataFromDb);
    setInitialOpeningHoursState(dataFromDb);
  }, []);

  const handleUpdateDay = (dayKey: string, data: OpeningHourData) => {
    setOpeningHoursState(prev => ({
      ...prev,
      [dayKey]: data,
    }));
  };

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
        <Button
          type="primary"
          onClick={() => {
            console.log('Da salvare:', openingHoursState);
            // TODO: chiama API
          }}
        >
          Salva
        </Button>
      </Space>
    </Form>
  );
};
