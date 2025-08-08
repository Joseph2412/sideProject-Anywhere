import { Dayjs } from 'dayjs';

export type OpeningPeriod = [Dayjs | null, Dayjs | null];

export type DayOpeningState = {
  isClosed: boolean;
  periods: OpeningPeriod[];
};

export const weekDays = [
  { label: 'Lunedì', value: 'MONDAY' },
  { label: 'Martedì', value: 'TUESDAY' },
  { label: 'Mercoledì', value: 'WEDNESDAY' },
  { label: 'Giovedì', value: 'THURSDAY' },
  { label: 'Venerdì', value: 'FRIDAY' },
  { label: 'Sabato', value: 'SATURDAY' },
  { label: 'Domenica', value: 'SUNDAY' },
] as const;

export type WeekDay = (typeof weekDays)[number]['value'];
