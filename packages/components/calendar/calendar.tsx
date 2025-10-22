import React, { useState } from "react";
import type { CalendarProps } from "antd";
import { Calendar, Spin, Empty } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useVenues } from "@repo/hooks/useVenues";
import { useCalendarEvents } from "@repo/hooks/useCalendarBookings";

const CalendarComponent: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
  const today = dayjs();

  // Ottieni il venue dell'utente loggato
  const { data: venueData, isLoading: venueLoading } = useVenues();
  const venueId = venueData?.venues?.venue?.id;

  // Ottieni gli eventi del calendario
  const { eventsByDate, isLoading: eventsLoading } = useCalendarEvents(
    venueId,
    currentMonth
  );

  // Funzione per generare dati placeholder
  const getPlaceholderData = (date: number) => {
    let listData: Array<{
      type: "success" | "warning" | "error" | "processing";
      content: string;
    }> = [];

    switch (date) {
      case 8:
        listData = [
          {
            type: "warning",
            content: "14:00-16:00 - Placeholder - Sala Riunioni - Mario Rossi",
          },
          {
            type: "success",
            content: "09:00-18:00 - Placeholder - Desk Privato - Anna Verdi",
          },
        ];
        break;
      case 10:
        listData = [
          {
            type: "warning",
            content: "10:00-12:00 - Placeholder - Meeting Room - Tech Corp",
          },
          {
            type: "success",
            content: "13:00-15:00 - Placeholder - Desk Condiviso - Luca Bianchi",
          },
          {
            type: "error",
            content: "16:00-18:00 - Placeholder - Sala Conferenze - CANCELLATO",
          },
        ];
        break;
      case 15:
        listData = [
          {
            type: "warning",
            content: "09:00-10:00 - Placeholder - Desk Premium - Giulia Neri",
          },
          {
            type: "success",
            content: "10:00-18:00 - Placeholder - Postazione Fissa - Startup Innovation SRL",
          },
          {
            type: "error",
            content: "14:00-15:00 - Placeholder - Sala Meeting - CANCELLATO",
          },
          {
            type: "error",
            content: "15:00-16:00 - Placeholder - Desk Privato - CANCELLATO",
          },
          {
            type: "processing",
            content: "16:00-17:00 - Placeholder - Podcast Studio - IN ATTESA",
          },
          {
            type: "success",
            content: "17:00-19:00 - Placeholder - Sala Grande - Evento Networking",
          },
        ];
        break;
      case 25:
        listData = [
          {
            type: "processing",
            content: "10:00-12:00 - Placeholder - Desk Premium - IN ATTESA",
          },
        ];
        break;
      default:
        listData = [];
    }

    return listData;
  };

  const dateCellRender = (value: Dayjs) => {
    const dateKey = value.format("YYYY-MM-DD");
    const events = eventsByDate[dateKey] || [];

    // ✅ Se non ci sono eventi reali, usa i placeholder
    const displayEvents =
      events.length > 0
        ? events
        : getPlaceholderData(value.date()).map((item, idx) => ({
            type: item.type,
            content: item.content,
            booking: {
              id: idx,
              costumerEmail: "placeholder@example.com",
              people: 1,
            },
          }));

    if (displayEvents.length === 0) return null;

    return (
      <ul className="calendar-events-list">
        {displayEvents.map((event, index) => (
          <li
            key={`${event.booking.id}-${index}`}
            className={`calendar-event calendar-event-${event.type}`}
            title={`${event.content}\nEmail: ${event.booking.costumerEmail}\nPersone: ${event.booking.people}`}
          >
            {event.content}
          </li>
        ))}
      </ul>
    );
  };

  const cellRender: CalendarProps<Dayjs>["cellRender"] = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    return info.originNode;
  };

  const onPanelChange = (value: Dayjs) => {
    setCurrentMonth(value);
  };

  // ✅ Render personalizzato per gestire l'evidenziazione di "oggi"
  const fullCellRender: CalendarProps<Dayjs>["fullCellRender"] = (current) => {
    const isToday =
      current.isSame(today, "day") && current.isSame(currentMonth, "month");
    const isCurrentMonth = current.month() === currentMonth.month();

    return (
      <div
        className={`ant-picker-cell-inner ant-picker-calendar-date ${
          isToday ? "ant-picker-cell-today" : ""
        } ${!isCurrentMonth ? "ant-picker-cell-disabled" : ""}`}
        style={{
          padding: "4px 8px",
          minHeight: "80px",
        }}
      >
        <div className="ant-picker-calendar-date-value">{current.date()}</div>
        <div className="ant-picker-calendar-date-content">
          {dateCellRender(current)}
        </div>
      </div>
    );
  };

  if (venueLoading || eventsLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "400px",
        }}
      >
        <Spin size="large" tip="Caricamento calendario..." />
      </div>
    );
  }

  if (!venueId) {
    return (
      <Empty
        description="Nessun venue associato al tuo account"
        style={{ marginTop: "50px" }}
      />
    );
  }

  return (
    <div style={{ padding: "1rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Calendario Prenotazioni</h2>
      <Calendar
        fullCellRender={fullCellRender}
        onPanelChange={onPanelChange}
        value={currentMonth}
        style={{ border: "1px solid #e0e0e0", borderRadius: "8px" }}
      />
    </div>
  );
};

export default CalendarComponent;
