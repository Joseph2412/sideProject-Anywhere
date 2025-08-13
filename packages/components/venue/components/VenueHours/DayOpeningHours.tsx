import React from 'react';
import { Checkbox, TimePicker, Button, Space, Typography, Row, Col } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import dayjs from 'dayjs';
import { parsePeriodString, formatPeriodString } from './openingHours.types';

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

  // 🎯 Pattern del checkbox che NASCONDE ma non elimina
  const handleToggleClosed = (e: CheckboxChangeEvent) => {
    const isChecked = e.target.checked;

    onUpdateDay(dayKey, {
      isClosed: isChecked,
      periods: periods, // 🎯 MANTIENI sempre i periodi esistenti
    });
  };

  const handleAddPeriod = () => {
    const newPeriods = [...periods, '09:00-18:00'];
    onUpdateDay(dayKey, {
      isClosed: false, // 🎯 Quando aggiungi un periodo, apri automaticamente
      periods: newPeriods,
    });
  };

  const handleRemovePeriod = (index: number) => {
    const newPeriods = periods.filter((_, i) => i !== index);
    onUpdateDay(dayKey, {
      isClosed,
      periods: newPeriods,
    });
  };

  const handlePeriodChange = (index: number, timeStrings: [string, string] | null) => {
    if (!timeStrings || !timeStrings[0] || !timeStrings[1]) return;

    const newPeriods = [...periods];
    newPeriods[index] = formatPeriodString(timeStrings[0], timeStrings[1]);

    onUpdateDay(dayKey, {
      isClosed,
      periods: newPeriods,
    });
  };

  return (
    <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
      <Col flex="auto">
        <div style={{ marginBottom: 6 }}>
          <Typography.Text strong>{day}</Typography.Text>
        </div>

        {/* 🎯 Mostra i periodi SOLO se NON è chiuso */}
        {!isClosed && (
          <Space direction="vertical" size="middle">
            {periods.map((period, index) => {
              const parsed = parsePeriodString(period);
              const timeRange = parsed ? [parsed.start, parsed.end] : null;

              return (
                <div key={index} style={{ width: '100%' }}>
                  {/* 🎯 Label sopra il TimePicker */}
                  <Typography.Text
                    style={{
                      fontSize: '12px',
                      display: 'block',
                      marginBottom: '4px',
                    }}
                  >
                    Dalle - Alle
                  </Typography.Text>
                  <Space key={index} align="center">
                    <TimePicker.RangePicker
                      format="HH:mm"
                      value={
                        timeRange
                          ? [dayjs(timeRange[0], 'HH:mm'), dayjs(timeRange[1], 'HH:mm')]
                          : null
                      }
                      onChange={(_, timeStrings) =>
                        handlePeriodChange(index, timeStrings as [string, string])
                      }
                    />
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleRemovePeriod(index)}
                    />
                  </Space>
                </div>
              );
            })}

            <Button
              type="dashed"
              onClick={handleAddPeriod}
              icon={<PlusOutlined />}
              style={{ width: '100%' }}
            >
              Aggiungi periodo
            </Button>
          </Space>
        )}
      </Col>

      <Col>
        {/* Stesso pattern checkbox del tuo codebase */}
        <Checkbox checked={isClosed} onChange={handleToggleClosed}>
          Chiuso
        </Checkbox>
      </Col>
    </Row>
  );
};
