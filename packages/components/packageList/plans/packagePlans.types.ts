export interface PlanRateData {
  id?: number;
  name: string;
  rate: string; // "HOURLY", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"
  isEnabled: boolean; // Indica se il piano è attivo
  price: number; // Prezzo del piano
}

export const PlansRate = [
  { value: "HOURLY", name: "Orario", label: "ora" },
  { value: "DAILY", name: "Giornaliero", label: "giorno" },
  { value: "WEEKLY", name: "Settimanale", label: "settimana" },
  { value: "MONTHLY", name: "Mensile", label: "mese" },
  { value: "YEARLY", name: "Annuale", label: "anno" },
];
