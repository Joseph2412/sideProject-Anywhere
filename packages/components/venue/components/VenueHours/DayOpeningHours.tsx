import { Checkbox, TimePicker, Typography, Row, Col, Space, Button } from 'antd';
import dayjs from 'dayjs';
import React, { useEffect } from 'react';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';

type OpeningDayData = {
  id?: number;
  isClosed: boolean;
  periods: {
    id?: number;
    start: string | null;
    end: string | null;
  }[];
};

type Props = {
  day: string;
  dayKey: string;
  openingDayData: OpeningDayData;
  onUpdateDay: (dayKey: string, data: OpeningDayData) => void;
};

export const DayOpeningHours: React.FC<Props> = ({ day, dayKey, openingDayData, onUpdateDay }) => {
  const { isClosed = true, periods = [] } = openingDayData || {};

  const dayjsPeriods = periods.map(period => {
    if (!period.start || !period.end) {
      return [null, null];
    }
    return [dayjs(period.start, 'HH:mm'), dayjs(period.end, 'HH:mm')];
  });

  const isPeriodEmpty = (index: number) => {
    const period = periods[index];
    return !period || !period.start || !period.end;
  };

  const handleRemove = (index: number) => {
    const updatedPeriods = [...periods];
    updatedPeriods.splice(index, 1);

    onUpdateDay(dayKey, {
      ...openingDayData,
      periods: updatedPeriods,
    });
  };

  const handleChange = (index: number, value: [dayjs.Dayjs, dayjs.Dayjs] | null) => {
    if (!value) return;

    const updatedPeriods = [...periods];
    updatedPeriods[index] = {
      ...updatedPeriods[index],
      start: value[0].format('HH:mm'),
      end: value[1].format('HH:mm'),
    };

    onUpdateDay(dayKey, {
      ...openingDayData,
      periods: updatedPeriods,
    });
  };

  const handleToggleClosed = (e: CheckboxChangeEvent) => {
    const isChecked = e.target.checked;

    onUpdateDay(dayKey, {
      ...openingDayData,
      isClosed: isChecked,
      periods: isChecked ? [] : periods,
    });
  };

  useEffect(() => {
    if (!isClosed && periods.length === 0) {
      onUpdateDay(dayKey, {
        ...openingDayData,
        periods: [{ start: null, end: null }],
      });
    }
  }, [isClosed, periods.length, onUpdateDay, dayKey, openingDayData]);

  return (
    <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
      <Col>
        <div style={{ marginBottom: 6 }}>
          <Typography.Text strong>{day}</Typography.Text>
        </div>

        {!isClosed && (
          <Space direction="vertical" size="middle">
            {dayjsPeriods.map((dayjsPeriod, index) => (
              <Space key={index} direction="vertical" size="small">
                <Typography.Text>Dalle - Alle</Typography.Text>
                <Space align="center">
                  <TimePicker.RangePicker
                    format="HH:mm"
                    value={
                      dayjsPeriod[0] && dayjsPeriod[1] ? [dayjsPeriod[0], dayjsPeriod[1]] : null
                    }
                    onChange={value => {
                      if (value && value[0] && value[1]) {
                        handleChange(index, [value[0], value[1]]);
                      } else {
                        handleChange(index, null);
                      }
                    }}
                  />

                  {isPeriodEmpty(index) ? (
                    <Button
                      onClick={() => {
                        handleChange(index, [dayjs('09:00', 'HH:mm'), dayjs('18:00', 'HH:mm')]);
                      }}
                    >
                      Aggiungi periodo
                    </Button>
                  ) : (
                    <Button onClick={() => handleRemove(index)}>Rimuovi</Button>
                  )}
                </Space>
              </Space>
            ))}

            {/* ✅ Nuova logica: se ci sono periodi compilati, mostra TimePicker vuoto */}
            {periods.some(period => period.start && period.end) && (
              <Space direction="vertical" size="small">
                <Typography.Text>Dalle - Alle</Typography.Text>
                <Space align="center">
                  <TimePicker.RangePicker
                    format="HH:mm"
                    value={null}
                    onChange={value => {
                      if (value && value[0] && value[1]) {
                        // Aggiungi nuovo periodo direttamente
                        const newPeriod = {
                          start: value[0].format('HH:mm'),
                          end: value[1].format('HH:mm'),
                        };

                        onUpdateDay(dayKey, {
                          ...openingDayData,
                          periods: [...periods, newPeriod],
                        });
                      }
                    }}
                  />

                  <Button
                    onClick={() => {
                      // Aggiungi periodo con orari default
                      const newPeriod = {
                        start: '09:00',
                        end: '18:00',
                      };

                      onUpdateDay(dayKey, {
                        ...openingDayData,
                        periods: [...periods, newPeriod],
                      });
                    }}
                  >
                    Aggiungi periodo
                  </Button>
                </Space>
              </Space>
            )}
          </Space>
        )}
      </Col>

      <Col>
        <Checkbox checked={isClosed} onChange={handleToggleClosed}>
          Chiuso
        </Checkbox>
      </Col>
    </Row>
  );
};
