export interface OpeningDayData {
  day: string; // "MONDAY", "TUESDAY", etc.
  isClosed: boolean; // Boolean diretto dal checkbox
  periods: string[]; // ["09:00-12:00", "14:00-18:00"] - vuoto se isClosed = true
}

export const weekDays = [
  { value: 'MONDAY', label: 'Lunedì' },
  { value: 'TUESDAY', label: 'Martedì' },
  { value: 'WEDNESDAY', label: 'Mercoledì' },
  { value: 'THURSDAY', label: 'Giovedì' },
  { value: 'FRIDAY', label: 'Venerdì' },
  { value: 'SATURDAY', label: 'Sabato' },
  { value: 'SUNDAY', label: 'Domenica' },
];

// Utility per validazione
export const isValidTimePeriod = (period: string): boolean => {
  const regex = /^([01]?\d|2[0-3]):([0-5]\d)-([01]?\d|2[0-3]):([0-5]\d)$/;
  return regex.test(period);
};

// Utility per parsing
export const parsePeriodString = (period: string): { start: string; end: string } | null => {
  const [start, end] = period.split('-');
  if (start && end) {
    return { start, end };
  }
  return null;
};

// Utility per formattazione
export const formatPeriodString = (start: string, end: string): string => {
  return `${start}-${end}`;
};
