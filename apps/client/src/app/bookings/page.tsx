"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Booking } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      // TODO: Implementare autenticazione e ottenere token
      // Per ora mostra messaggio che richiede autenticazione
      setError("Funzionalità disponibile dopo il login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nel caricamento");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (!confirm("Sei sicuro di voler cancellare questa prenotazione?")) {
      return;
    }

    try {
      // TODO: Implementare cancellazione con token
      alert("Prenotazione cancellata con successo");
      fetchBookings();
    } catch (err) {
      alert("Errore nella cancellazione della prenotazione");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("it-IT", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Navbar />
      <main className="bookings-page-container">
        <div className="bookings-page-header">
          <h1 className="bookings-page-title">Le Mie Prenotazioni</h1>
          <p className="bookings-page-subtitle">
            Gestisci le tue prenotazioni attive e passate
          </p>
        </div>

        {loading && (
          <div className="bookings-page-loading">
            <p>Caricamento prenotazioni...</p>
          </div>
        )}

        {error && (
          <div className="bookings-page-error">
            <p>{error}</p>
            <p className="bookings-page-auth-message">
              Effettua il login per vedere le tue prenotazioni
            </p>
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className="bookings-page-empty">
            <p>Non hai ancora effettuato nessuna prenotazione</p>
            <a href="/venues" className="bookings-page-cta">
              Esplora gli spazi disponibili
            </a>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className="bookings-page-list">
            {bookings.map((booking) => (
              <div key={booking.id} className="booking-card">
                <div className="booking-card-header">
                  <h3 className="booking-card-id">Prenotazione #{booking.id}</h3>
                  <span className={`booking-card-status booking-card-status-${booking.status}`}>
                    {booking.status}
                  </span>
                </div>

                <div className="booking-card-details">
                  <div className="booking-card-detail">
                    <span className="booking-card-detail-label">📅 Inizio:</span>
                    <span>{formatDate(booking.start)}</span>
                  </div>
                  <div className="booking-card-detail">
                    <span className="booking-card-detail-label">📅 Fine:</span>
                    <span>{formatDate(booking.end)}</span>
                  </div>
                  <div className="booking-card-detail">
                    <span className="booking-card-detail-label">👥 Persone:</span>
                    <span>{booking.people}</span>
                  </div>
                </div>

                <div className="booking-card-actions">
                  <button
                    className="booking-card-button booking-card-button-secondary"
                    onClick={() => window.location.href = `/venues/${booking.venueId}`}
                  >
                    Vedi Venue
                  </button>
                  {booking.status === "confirmed" && (
                    <button
                      className="booking-card-button booking-card-button-danger"
                      onClick={() => handleCancelBooking(booking.id)}
                    >
                      Cancella
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />

      <style jsx>{`
        .bookings-page-container {
          max-width: 1200px;
          margin: 2rem auto;
          padding: 0 1.5rem;
          min-height: calc(100vh - 300px);
        }

        .bookings-page-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .bookings-page-title {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
        }

        .bookings-page-subtitle {
          font-size: 1.2rem;
          opacity: 0.7;
        }

        .bookings-page-loading,
        .bookings-page-error,
        .bookings-page-empty {
          text-align: center;
          padding: 3rem 1rem;
          font-size: 1.2rem;
        }

        .bookings-page-auth-message {
          margin-top: 1rem;
          font-size: 1rem;
          opacity: 0.7;
        }

        .bookings-page-cta {
          display: inline-block;
          margin-top: 1.5rem;
          padding: 0.8rem 1.5rem;
          background: var(--primary);
          color: white;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .bookings-page-cta:hover {
          background: var(--primary-hover);
        }

        .bookings-page-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .booking-card {
          background: var(--background);
          border: 1px solid rgba(128, 128, 128, 0.2);
          border-radius: 8px;
          padding: 1.5rem;
        }

        .booking-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(128, 128, 128, 0.2);
        }

        .booking-card-id {
          font-size: 1.3rem;
        }

        .booking-card-status {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: bold;
        }

        .booking-card-status-confirmed {
          background: #d4edda;
          color: #155724;
        }

        .booking-card-status-pending {
          background: #fff3cd;
          color: #856404;
        }

        .booking-card-status-cancelled {
          background: #f8d7da;
          color: #721c24;
        }

        .booking-card-details {
          display: grid;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .booking-card-detail {
          display: flex;
          gap: 0.5rem;
        }

        .booking-card-detail-label {
          font-weight: 500;
        }

        .booking-card-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        .booking-card-button {
          padding: 0.8rem 1.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .booking-card-button-secondary {
          background: transparent;
          color: var(--foreground);
          border: 1px solid rgba(128, 128, 128, 0.3);
        }

        .booking-card-button-secondary:hover {
          background: rgba(128, 128, 128, 0.1);
        }

        .booking-card-button-danger {
          background: #dc3545;
          color: white;
        }

        .booking-card-button-danger:hover {
          background: #c82333;
        }

        @media (max-width: 768px) {
          .bookings-page-title {
            font-size: 1.8rem;
          }

          .booking-card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .booking-card-actions {
            flex-direction: column;
            width: 100%;
          }

          .booking-card-button {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
}
