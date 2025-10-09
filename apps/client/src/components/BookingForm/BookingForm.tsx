"use client";

import { useState } from "react";
import { BookingFormData } from "@/types";

interface BookingFormProps {
  venueId: number;
  packageId: number;
  packageName: string;
  onSubmit: (data: BookingFormData) => Promise<void>;
  onCancel?: () => void;
}

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const bookingData: BookingFormData = {
        venueId: venueId.toString(),
        packageId: packageId.toString(),
        start: new Date(formData.start).toISOString(),
        end: new Date(formData.end).toISOString(),
        people: formData.people,
        userId: 1,
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || undefined,
        }
      };

      await onSubmit(bookingData);
      
      setFormData({
        start: "",
        end: "",
        people: 1,
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nella prenotazione");
    } finally {
      setLoading(false);
    }
  };

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
        <div className="booking-form-error">
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
              Telefono
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

