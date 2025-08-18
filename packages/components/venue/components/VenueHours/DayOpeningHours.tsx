import React, { useState } from "react";
import {
  Checkbox,
  TimePicker,
  Button,
  Space,
  Typography,
  Row,
  Col,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import dayjs from "dayjs";
import { parsePeriodString, formatPeriodString } from "./openingHours.types";
import { PrimaryButton } from "./../../../buttons/PrimaryButton";

interface DayOpeningHoursProps {
  day: string;
  dayKey: string;
  openingDayData: {
    isClosed: boolean;
    periods: string[];
  };
  onUpdateDay: (
    dayKey: string,
    data: { isClosed: boolean; periods: string[] },
  ) => void;
}

export const DayOpeningHours: React.FC<DayOpeningHoursProps> = ({
  day,
  dayKey,
  openingDayData,
  onUpdateDay,
}) => {
  const { isClosed, periods } = openingDayData;

  // Stato per il periodo in corso di modifica (non ancora confermato)
  const [pendingPeriod, setPendingPeriod] = useState<string | null>(null);

  const handleToggleClosed = (e: CheckboxChangeEvent) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      // Se chiude, rimuovi anche il periodo pendente
      setPendingPeriod(null);
      onUpdateDay(dayKey, {
        isClosed: true,
        periods: [],
      });
    } else {
      // Da chiuso ad aperto: crea subito un periodo pendente (non salvato)
      setTimeout(() => {
        setPendingPeriod("08:00-18:00");
      }, 0);
      onUpdateDay(dayKey, {
        isClosed: false,
        periods: [], // Reset periodi quando riapri
      });
    }
  };

  // Inizia un nuovo periodo (non ancora confermato)
  const handleAddPeriod = () => {
    setPendingPeriod("12:00-18:00");
  };

  // Conferma il periodo pendente
  const handleConfirmPeriod = () => {
    if (pendingPeriod) {
      const newPeriods = [...periods, pendingPeriod];
      onUpdateDay(dayKey, {
        isClosed: false,
        periods: newPeriods,
      });
      // Dopo la conferma, riapri subito un nuovo periodo pending
      setPendingPeriod("08:00-18:00");
    }
  };

  const handleRemovePeriod = (index: number) => {
    const newPeriods = periods.filter((_, i) => i !== index);
    onUpdateDay(dayKey, {
      isClosed,
      periods: newPeriods,
    });
  };

  const handlePeriodChange = (
    index: number,
    timeStrings: [string, string] | null,
  ) => {
    if (!timeStrings || !timeStrings[0] || !timeStrings[1]) return;

    const newPeriods = [...periods];
    newPeriods[index] = formatPeriodString(timeStrings[0], timeStrings[1]);

    onUpdateDay(dayKey, {
      isClosed,
      periods: newPeriods,
    });
  };

  // Gestisci cambio del periodo pendente
  const handlePendingPeriodChange = (timeStrings: [string, string] | null) => {
    if (timeStrings && timeStrings[0] && timeStrings[1]) {
      setPendingPeriod(formatPeriodString(timeStrings[0], timeStrings[1]));
    }
  };

  return (
    <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
      <Col flex="auto">
        <div style={{ marginBottom: 6 }}>
          <Typography.Text strong>{day}</Typography.Text>
        </div>

        {!isClosed && (
          <Space direction="vertical">
            {/* Periodi confermati */}
            {periods.map((period, index) => {
              const parsed = parsePeriodString(period);
              const timeRange: [dayjs.Dayjs | null, dayjs.Dayjs | null] = parsed
                ? [dayjs(parsed.start, "HH:mm"), dayjs(parsed.end, "HH:mm")]
                : [null, null];

              return (
                <div key={index}>
                  <Typography.Text
                    style={{
                      fontSize: "12px",
                      display: "block",
                      marginBottom: "4px",
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
                          handlePeriodChange(
                            index,
                            timeStrings as [string, string],
                          )
                        }
                      />
                    </Col>
                    <Col>
                      {/* Mostra "Rimuovi" solo dal secondo periodo in poi */}
                      {index > 0 && (
                        <Button onClick={() => handleRemovePeriod(index)}>
                          Rimuovi
                        </Button>
                      )}
                    </Col>
                  </Row>
                </div>
              );
            })}

            {/* Range picker per aggiungere nuovo periodo (sempre in fondo se non pendingPeriod null) */}
            {!isClosed && (
              <Space direction="vertical">
                {pendingPeriod ? (
                  <div>
                    <Typography.Text
                      style={{
                        fontSize: "12px",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Dalle - Alle
                    </Typography.Text>
                    <Row gutter={8} align="middle">
                      <Col>
                        <TimePicker.RangePicker
                          format="HH:mm"
                          value={(() => {
                            const parsed = parsePeriodString(pendingPeriod);
                            return parsed
                              ? [
                                  dayjs(parsed.start, "HH:mm"),
                                  dayjs(parsed.end, "HH:mm"),
                                ]
                              : [
                                  dayjs("08:00", "HH:mm"),
                                  dayjs("18:00", "HH:mm"),
                                ];
                          })()}
                          onChange={(_, timeStrings) =>
                            handlePendingPeriodChange(
                              timeStrings as [string, string],
                            )
                          }
                        />
                      </Col>
                      <Col>
                        <PrimaryButton
                          type="primary"
                          onClick={handleConfirmPeriod}
                        >
                          Aggiungi periodo
                        </PrimaryButton>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  // Mostra SEMPRE il timepicker pending se non c'è, precompilato
                  <div>
                    <Typography.Text
                      style={{
                        fontSize: "12px",
                        display: "block",
                        marginBottom: "4px",
                      }}
                    >
                      Dalle - Alle
                    </Typography.Text>
                    <Row gutter={8} align="middle">
                      <Col>
                        <TimePicker.RangePicker
                          format="HH:mm"
                          value={[
                            dayjs("08:00", "HH:mm"),
                            dayjs("18:00", "HH:mm"),
                          ]}
                          onChange={(_, timeStrings) =>
                            setPendingPeriod(
                              formatPeriodString(
                                timeStrings[0],
                                timeStrings[1],
                              ),
                            )
                          }
                        />
                      </Col>
                      <Col>
                        <Button
                          type="primary"
                          onClick={() => {
                            // Conferma direttamente se l'utente ha già selezionato un orario
                            setPendingPeriod("08:00-18:00");
                            handleConfirmPeriod();
                          }}
                        >
                          Aggiungi periodo
                        </Button>
                      </Col>
                    </Row>
                  </div>
                )}
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
