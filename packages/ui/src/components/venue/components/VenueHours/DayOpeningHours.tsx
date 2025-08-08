import { Checkbox, TimePicker, Typography, Row, Col, Space, Button } from 'antd';
import dayjs from 'dayjs';
import React from 'react';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import { DayOpeningState, OpeningPeriod } from './openingHours.types';

type Props = {
  day: string;
  dayKey: string;
  isClosed: boolean;
  periods: OpeningPeriod[];
  onToggleClosed: (e: CheckboxChangeEvent) => void;
  setOpeningHoursState: React.Dispatch<React.SetStateAction<Record<string, DayOpeningState>>>;
};

export const DayOpeningHours: React.FC<Props> = ({
  day,
  dayKey,
  isClosed,
  periods,
  onToggleClosed,
  setOpeningHoursState,
}) => {
  const isPeriodEmpty = (period: OpeningPeriod) => !period[0] || !period[1];

  const handleAdd = (index: number) => {
    const updated = [...periods];
    updated[index] = [dayjs('09:00', 'HH:mm'), dayjs('18:00', 'HH:mm')];
    setOpeningHoursState(prev => ({
      ...prev,
      [dayKey]: { ...prev[dayKey]!, periods: updated },
    }));
  };

  const handleRemove = (index: number) => {
    const updated = [...periods];
    updated.splice(index, 1);
    setOpeningHoursState(prev => ({
      ...prev,
      [dayKey]: { ...prev[dayKey]!, periods: updated },
    }));
  };

  const handleChange = (index: number, value: OpeningPeriod) => {
    const updated = [...periods];
    updated[index] = value;
    setOpeningHoursState(prev => ({
      ...prev,
      [dayKey]: { ...prev[dayKey]!, periods: updated },
    }));
  };

  return (
    <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
      <Col>
        <div style={{ marginBottom: 6 }}>
          <Typography.Text strong>{day}</Typography.Text>
        </div>

        {!isClosed && (
          <Space direction="vertical" size="middle">
            {periods.map((period, index) => (
              <Space key={index} direction="vertical" size="small">
                <Typography.Text>Dalle - Alle</Typography.Text>
                <Space align="center">
                  <TimePicker.RangePicker
                    format="HH:mm"
                    value={period[0] && period[1] ? period : null}
                    onChange={value => {
                      if (!value) return;
                      handleChange(index, value);
                    }}
                  />
                  {isPeriodEmpty(period) ? (
                    <Button
                      style={{
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 12px',
                      }}
                      onClick={() => handleAdd(index)}
                    >
                      Aggiungi Periodo
                    </Button>
                  ) : (
                    <Button
                      style={{
                        height: 32,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0 12px',
                      }}
                      onClick={() => handleRemove(index)}
                    >
                      Rimuovi
                    </Button>
                  )}
                </Space>
              </Space>
            ))}
            <Button
              style={{
                height: 32,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 12px',
              }}
              onClick={() => {
                setOpeningHoursState(prev => ({
                  ...prev,
                  [dayKey]: {
                    ...prev[dayKey]!,
                    periods: [...prev[dayKey]!.periods, [null, null]],
                  },
                }));
              }}
            >
              Aggiungi Periodo
            </Button>
          </Space>
        )}
      </Col>

      <Col>
        <Checkbox checked={isClosed} onChange={onToggleClosed}>
          Chiuso
        </Checkbox>
      </Col>
    </Row>
  );
};
