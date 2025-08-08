import React, { useEffect, useState } from 'react';
import { Form, Divider, Button, Space } from 'antd';
import { DayOpeningState, weekDays } from './openingHours.types';
import { DayOpeningHours } from './DayOpeningHours';

export const VenueHoursForm: React.FC = () => {
  const [openingHoursState, setOpeningHoursState] = useState<Record<string, DayOpeningState>>({});
  const [initialOpeningHoursState, setInitialOpeningHoursState] = useState<
    Record<string, DayOpeningState>
  >({});

  useEffect(() => {
    const dataFromDb: Record<string, DayOpeningState> = weekDays.reduce(
      (acc, day) => {
        acc[day.value] = {
          isClosed: false,
          periods: [],
        };
        return acc;
      },
      {} as Record<string, DayOpeningState>
    );

    setOpeningHoursState(dataFromDb);
    setInitialOpeningHoursState(dataFromDb);
  }, []);

  return (
    <Form layout="vertical">
      {weekDays.map(day => (
        <div key={day.value}>
          <DayOpeningHours
            day={day.label}
            dayKey={day.value}
            isClosed={openingHoursState[day.value]?.isClosed ?? false}
            periods={openingHoursState[day.value]?.periods ?? []}
            setOpeningHoursState={setOpeningHoursState}
            onToggleClosed={() => {
              setOpeningHoursState(prev => ({
                ...prev,
                [day.value]: {
                  isClosed: !prev[day.value]?.isClosed,
                  periods: prev[day.value]?.periods ?? [],
                },
              }));
            }}
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
