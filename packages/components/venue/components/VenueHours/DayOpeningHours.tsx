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

  // 🎯 Quando il checkbox cambia da chiuso ad aperto, crea default con orario 08:00-18:00
  const handleToggleClosed = (e: CheckboxChangeEvent) => {
    const isChecked = e.target.checked;

    if (!isChecked && isClosed && periods.length === 0) {
      // Da chiuso ad aperto senza periodi: crea periodo default
      onUpdateDay(dayKey, {
        isClosed: false,
        periods: ['08:00-18:00'], // Periodo precompilato
      });
    } else {
      onUpdateDay(dayKey, {
        isClosed: isChecked,
        periods: periods, // Mantieni i periodi esistenti
      });
    }
  };

  // 🎯 Aggiungi periodo con orario precompilato 08:00-18:00
  const handleAddPeriod = () => {
    const newPeriods = [...periods, '08:00-18:00'];
    onUpdateDay(dayKey, {
      isClosed: false, // Quando aggiungi un periodo, apri automaticamente
      periods: newPeriods,
    });
  };

  // 🎯 Rimuovi periodo: solo quelli successivi al primo
  const handleRemovePeriod = (index: number) => {
    if (index === 0) return; // Non permettere rimozione del primo periodo

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

  // 🎯 Determina quale pulsante mostrare per ogni periodo
  const getButtonForPeriod = (index: number) => {
    const isLastPeriod = index === periods.length - 1;
    const isFirstPeriod = index === 0;

    if (isLastPeriod) {
      // L'ultimo periodo mostra sempre "Aggiungi periodo"
      return <Button onClick={handleAddPeriod}>Aggiungi periodo</Button>;
    } else if (!isFirstPeriod) {
      // I periodi intermedi (non primo, non ultimo) mostrano "Rimuovi"
      return <Button onClick={() => handleRemovePeriod(index)}>Rimuovi</Button>;
    }

    // Il primo periodo non ha pulsante quando ci sono altri periodi
    return null;
  };

  return (
    <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
      <Col flex="auto">
        <div style={{ marginBottom: 6 }}>
          <Typography.Text strong>{day}</Typography.Text>
        </div>

        {/* Mostra i periodi SOLO se NON è chiuso */}
        {!isClosed && (
          <Space direction="vertical">
            {periods.map((period, index) => {
              const parsed = parsePeriodString(period);
              const timeRange = parsed ? [parsed.start, parsed.end] : null;

              return (
                <div key={index}>
                  {/*Label sopra il TimePicker */}
                  <Typography.Text
                    style={{
                      fontSize: '12px',
                      display: 'block',
                      marginBottom: '4px',
                    }}
                  >
                    Dalle - Alle
                  </Typography.Text>

                  {/* 🎯 Row per mantenere TimePicker e Button sulla stessa linea */}
                  <Row gutter={8} align="middle">
                    <Col>
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
                    </Col>
                    <Col>{getButtonForPeriod(index)}</Col>
                  </Row>
                </div>
              );
            })}
          </Space>
        )}
      </Col>

      <Col>
        {/* Checkbox per chiuso/aperto */}
        <Checkbox checked={isClosed} onChange={handleToggleClosed}>
          Chiuso
        </Checkbox>
      </Col>
    </Row>
  );
};
