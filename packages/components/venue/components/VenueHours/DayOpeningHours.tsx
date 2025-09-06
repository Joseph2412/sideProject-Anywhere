import React from 'react';
import { Checkbox, TimePicker, Button, Space, Typography, Row, Col } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import dayjs from 'dayjs';
import { parsePeriodString, formatPeriodString } from './openingHours.types';
import { useUpdateVenueOpeningDays } from '@repo/hooks';

interface DayOpeningHoursProps {
  day: string;
  dayKey: string;
  openingDayData: {
    isClosed: boolean;
    periods: string[];
  };
  onUpdateDay: (dayKey: string, data: { isClosed: boolean; periods: string[] }) => void;
}

export const DayOpeningHours: React.FC<DayOpeningHoursProps> = ({
  day,
  dayKey,
  openingDayData,
  onUpdateDay,
}) => {
  const { isClosed, periods } = openingDayData;
  const updateOpeningDays = useUpdateVenueOpeningDays();

  // Quando flaggo la checkbox, aggiunge periodo 08:00-18:00 e salva
  const handleToggleClosed = async (e: CheckboxChangeEvent) => {
    const isChecked = e.target.checked;
    if (isChecked) {
      // Chiuso: nessun periodo
      onUpdateDay(dayKey, {
        isClosed: true,
        periods: [],
      });
      await updateOpeningDays.mutateAsync([
        {
          day: dayKey,
          isClosed: true,
          periods: [],
        },
      ]);
    } else {
      // Aperto: aggiungi periodo 08:00-18:00
      const defaultPeriod = formatPeriodString('08:00', '18:00');
      onUpdateDay(dayKey, {
        isClosed: false,
        periods: [defaultPeriod],
      });
      await updateOpeningDays.mutateAsync([
        {
          day: dayKey,
          isClosed: false,
          periods: [defaultPeriod],
        },
      ]);
    }
  };

  // Modifica periodo esistente
  const handlePeriodChange = async (index: number, timeStrings: [string, string] | null) => {
    if (!timeStrings || !timeStrings[0] || !timeStrings[1]) return;
    const newPeriods = [...periods];
    newPeriods[index] = formatPeriodString(timeStrings[0], timeStrings[1]);
    onUpdateDay(dayKey, {
      isClosed,
      periods: newPeriods,
    });
    await updateOpeningDays.mutateAsync([
      {
        day: dayKey,
        isClosed,
        periods: newPeriods,
      },
    ]);
  };

  // Aggiungi periodo 08:00-18:00 e salva
  const handleAddPeriod = async () => {
    const defaultPeriod = formatPeriodString('08:00', '18:00');
    const updatedPeriods = [...periods, defaultPeriod];
    onUpdateDay(dayKey, {
      isClosed: false,
      periods: updatedPeriods,
    });
    await updateOpeningDays.mutateAsync([
      {
        day: dayKey,
        isClosed: false,
        periods: updatedPeriods,
      },
    ]);
  };

  // Rimuovi periodo
  const handleRemovePeriod = async (index: number) => {
    const newPeriods = periods.filter((_, i) => i !== index);
    onUpdateDay(dayKey, {
      isClosed,
      periods: newPeriods,
    });
    await updateOpeningDays.mutateAsync([
      {
        day: dayKey,
        isClosed,
        periods: newPeriods,
      },
    ]);
  };

  return (
    <Row justify="space-between" align="middle">
      <Col flex="auto">
        <div
          style={{
            marginBottom: 6,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            justifyContent: 'space-between',
          }}
        >
          <Typography.Text strong>{day}</Typography.Text>
          <Checkbox checked={isClosed} onChange={handleToggleClosed}>
            Chiuso
          </Checkbox>
        </div>
        <Space direction="vertical">
          {/* Periodi confermati */}
          {periods.map((period, index) => {
            const parsed = parsePeriodString(period);
            const timeRange: [dayjs.Dayjs | null, dayjs.Dayjs | null] = parsed
              ? [dayjs(parsed.start, 'HH:mm'), dayjs(parsed.end, 'HH:mm')]
              : [null, null];

            return (
              <div key={index}>
                <Typography.Text
                  style={{
                    fontSize: '12px',
                    display: 'block',
                    marginBottom: '4px',
                  }}
                >
                  Dalle - Alle
                </Typography.Text>
                <Row gutter={8} align="middle">
                  <Col>
                    <TimePicker.RangePicker
                      format="HH:mm"
                      value={timeRange}
                      onChange={(_, timeStrings) =>
                        handlePeriodChange(index, timeStrings as [string, string])
                      }
                      disabled={isClosed}
                    />
                  </Col>
                  {!isClosed && (
                    <Col>
                      {index === 0 ? (
                        <Button onClick={handleAddPeriod} style={{ borderColor: '#D9D9D9' }}>
                          Aggiungi periodo
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleRemovePeriod(index)}
                          style={{ borderColor: '#D9D9D9' }}
                        >
                          Rimuovi
                        </Button>
                      )}
                    </Col>
                  )}
                </Row>
              </div>
            );
          })}
        </Space>
      </Col>
    </Row>
  );
};
