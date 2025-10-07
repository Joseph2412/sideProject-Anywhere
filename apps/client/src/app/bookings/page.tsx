"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar/Navbar";
import { Footer } from "@/components/Footer/Footer";
import { ProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute";
import { useAuthFetch } from "@/hooks/useAuthFetch";
import { Booking } from "@/types";
import styles from "./bookings.module.css";

function BookingsContent() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { get, delete: deleteBooking } = useAuthFetch();

  useEffect(() => {
    fetchBookings();
  }, []);

const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await get<{ bookings: Booking[] }>('/api/bookings/venues/bookings');
      setBookings(data.bookings || []);
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
      // Aggiorna l'endpoint per la cancellazione
      await deleteBooking(`/api/bookings/booking/${bookingId}`);
      alert("Prenotazione cancellata con successo");
      fetchBookings();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Errore nella cancellazione della prenotazione");
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
      <main className={styles.bookingsPageContainer}>
        <div className={styles.bookingsPageHeader}>
          <h1 className={styles.bookingsPageTitle}>Le Mie Prenotazioni</h1>
          <p className={styles.bookingsPageSubtitle}>
            Gestisci le tue prenotazioni attive e passate
          </p>
        </div>

        {loading && (
          <div className={styles.bookingsPageLoading}>
            <p>Caricamento prenotazioni...</p>
          </div>
        )}

        {error && (
          <div className={styles.bookingsPageError}>
            <p>{error}</p>
            <p className={styles.bookingsPageAuthMessage}>
              Effettua il login per vedere le tue prenotazioni
            </p>
          </div>
        )}

        {!loading && !error && bookings.length === 0 && (
          <div className={styles.bookingsPageEmpty}>
            <p>Non hai ancora effettuato nessuna prenotazione</p>
            <a href="/venues" className={styles.bookingsPageCta}>
              Esplora gli spazi disponibili
            </a>
          </div>
        )}

        {!loading && bookings.length > 0 && (
          <div className={styles.bookingsPageList}>
            {bookings.map((booking) => (
              <div key={booking.id} className={styles.bookingCard}>
                <div className={styles.bookingCardHeader}>
                  <h3 className={styles.bookingCardId}>Prenotazione #{booking.id}</h3>
                  <span className={`${styles.bookingCardStatus} ${styles[`bookingCardStatus${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}`]}`}>
                    {booking.status}
                  </span>
                </div>

                <div className={styles.bookingCardDetails}>
                  <div className={styles.bookingCardDetail}>
                    <span className={styles.bookingCardDetailLabel}>📅 Inizio:</span>
                    <span>{formatDate(booking.start)}</span>
                  </div>
                  <div className={styles.bookingCardDetail}>
                    <span className={styles.bookingCardDetailLabel}>📅 Fine:</span>
                    <span>{formatDate(booking.end)}</span>
                  </div>
                  <div className={styles.bookingCardDetail}>
                    <span className={styles.bookingCardDetailLabel}>👥 Persone:</span>
                    <span>{booking.people}</span>
                  </div>
                </div>

                <div className={styles.bookingCardActions}>
                  <button
                    className={`${styles.bookingCardButton} ${styles.bookingCardButtonSecondary}`}
                    onClick={() => window.location.href = `/venues/${booking.venueId}`}
                  >
                    Vedi Venue
                  </button>
                  {booking.status === "confirmed" && (
                    <button
                      className={`${styles.bookingCardButton} ${styles.bookingCardButtonDanger}`}
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
    </>
  );
}

export default function BookingsPage() {
  return (
    <ProtectedRoute>
      <BookingsContent />
    </ProtectedRoute>
  );
}
