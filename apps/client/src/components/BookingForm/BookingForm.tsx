"use client";

import { useState } from "react";
// Assumiamo che le interfacce siano in un file types
import { BookingFormData, CustomerInfo } from "@/types";

interface BookingFormProps {
  venueId: number;
  packageId: number;
  packageName: string;
  onSubmit: (data: BookingFormData) => Promise<void>; // L'onSubmit riceve i dati senza userId
  onCancel?: () => void;
}

// Rimuovi userId da BookingFormData se non definita in @/types
// export interface CustomerInfo { ... }
// export interface BookingFormData { ... venueId: number; packageId: number; ... }


export function BookingForm({
  venueId,
  packageId,
  packageName,
  onSubmit,
  onCancel
}: BookingFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    start: "",
    end: "",
    people: 1,
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

   // Aggiungi log per debug iniziale
   console.log("🚀 BookingForm rendered with:", { venueId, packageId, packageName });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 1 : value // Default a 1 per 'people'
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validazione base date
    if (!formData.start || !formData.end) {
        setError("Per favore, inserisci data e ora di inizio e fine.");
        return;
    }
    const startDate = new Date(formData.start);
    const endDate = new Date(formData.end);
    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        setError("Formato data/ora non valido.");
        return;
    }
     if (startDate >= endDate) {
         setError("L'ora di fine deve essere successiva all'ora di inizio.");
         return;
     }
     // Optional: Check if start date is in the past? Depends on business logic.


    setLoading(true);

    try {
      // ✅ --- PAYLOAD CORRETTO (SENZA userId) ---
      const bookingData: BookingFormData = {
        venueId: venueId,       // number
        packageId: packageId,   // number
        start: startDate.toISOString(), // ISO 8601 UTC string
        end: endDate.toISOString(),     // ISO 8601 UTC string
        people: formData.people,
        // userId: 1, // RIMOSSO - Il backend userà l'utente autenticato
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || undefined, // Invia undefined se vuoto
        }
      };
      // --- FINE CORREZIONE ---

       // Log del payload prima dell'invio
       console.log("📤 Submitting booking:", bookingData);


      await onSubmit(bookingData);

      // Reset form on success (optional, potrebbe essere gestito dal parent)
      // setFormData({ ...initial state... });

    } catch (err) {
       console.error("❌ Form submission error:", err); // Logga l'errore completo
      setError(err instanceof Error ? err.message : "Errore sconosciuto nella prenotazione");
    } finally {
      setLoading(false);
    }
  };

  // ... resto del componente (JSX del form) invariato ...
   return (
    <div className="booking-form-container">
      <div className="booking-form-header">
        <h2 className="booking-form-title">Prenota: {packageName}</h2>
        {onCancel && (
          <button
            type="button"
            className="booking-form-close"
            onClick={onCancel}
            aria-label="Chiudi"
          >
            ✕
          </button>
        )}
      </div>

      {error && (
        <div className="booking-form-error" style={{ color: 'red', marginBottom: '1rem', padding: '0.5rem', border: '1px solid red', borderRadius: '4px', backgroundColor: '#ffeeee'}}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="booking-form">
        <div className="booking-form-section">
          <h3 className="booking-form-section-title">Dettagli Prenotazione</h3>

          <div className="booking-form-row">
            <div className="booking-form-field">
              <label htmlFor="start" className="booking-form-label">
                Data e ora inizio *
              </label>
              <input
                type="datetime-local"
                id="start"
                name="start"
                value={formData.start}
                onChange={handleChange}
                required
                className="booking-form-input"
                // Aggiungi step per minuti se vuoi (es. step="900" per 15 min)
              />
            </div>

            <div className="booking-form-field">
              <label htmlFor="end" className="booking-form-label">
                Data e ora fine *
              </label>
              <input
                type="datetime-local"
                id="end"
                name="end"
                value={formData.end}
                onChange={handleChange}
                required
                className="booking-form-input"
                min={formData.start} // Imposta minimo basato sull'inizio
              />
            </div>
          </div>

          <div className="booking-form-field">
            <label htmlFor="people" className="booking-form-label">
              Numero di persone *
            </label>
            <input
              type="number"
              id="people"
              name="people"
              min="1"
              value={formData.people}
              onChange={handleChange}
              required
              className="booking-form-input"
            />
          </div>
        </div>

        <div className="booking-form-section">
          <h3 className="booking-form-section-title">Informazioni Cliente</h3>

          <div className="booking-form-row">
            <div className="booking-form-field">
              <label htmlFor="firstName" className="booking-form-label">
                Nome *
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="booking-form-input"
              />
            </div>

            <div className="booking-form-field">
              <label htmlFor="lastName" className="booking-form-label">
                Cognome *
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="booking-form-input"
              />
            </div>
          </div>

          <div className="booking-form-field">
            <label htmlFor="email" className="booking-form-label">
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="booking-form-input"
            />
          </div>

          <div className="booking-form-field">
            <label htmlFor="phone" className="booking-form-label">
              Telefono (opzionale)
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="booking-form-input"
            />
          </div>
        </div>

        <div className="booking-form-actions">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="booking-form-button booking-form-button-secondary"
              disabled={loading}
            >
              Annulla
            </button>
          )}
          <button
            type="submit"
            className="booking-form-button booking-form-button-primary"
            disabled={loading}
          >
            {loading ? "Prenotazione in corso..." : "Conferma Prenotazione"}
          </button>
        </div>
      </form>
    </div>
  );
}

// Assicurati che l'interfaccia BookingFormData nel tuo file @/types non abbia più userId
// Esempio:
/*
export interface CustomerInfo {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface BookingFormData {
  venueId: number;
  packageId: number;
  start: string; // ISO String
  end: string;   // ISO String
  people: number;
  // userId: number; // RIMOSSO
  customerInfo: CustomerInfo;
}
*/
