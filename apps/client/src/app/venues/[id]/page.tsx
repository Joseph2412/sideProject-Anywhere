"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Venue, BookingFormData } from "@/types";
import { PackageCard } from "@/components/PackageCard";
import { BookingForm } from "@/components/BookingForm";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function VenueDetailPage() {
  const params = useParams();
  const venueId = params?.id as string;
  
  const [venue, setVenue] = useState<Venue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    if (venueId) {
      fetchVenueDetails();
    }
  }, [venueId]);

  const fetchVenueDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/public/venues/${venueId}`);
      
      if (!response.ok) {
        throw new Error("Impossibile caricare i dettagli del venue");
      }
      
      const data = await response.json();
      setVenue(data.venue);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nel caricamento");
    } finally {
      setLoading(false);
    }
  };

  const handleBookPackage = (packageId: number) => {
    setSelectedPackage(packageId);
    setShowBookingForm(true);
  };

  const handleBookingSubmit = async (bookingData: BookingFormData) => {
    try {
      const response = await fetch(`${API_URL}/booking/${venue?.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error("Errore nella creazione della prenotazione");
      }

      alert("Prenotazione effettuata con successo!");
      setShowBookingForm(false);
      setSelectedPackage(null);
    } catch (err) {
      throw err;
    }
  };

  const getDayName = (day: number) => {
    const days = ["Domenica", "Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"];
    return days[day];
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="venue-detail-loading">
          <p>Caricamento...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !venue) {
    return (
      <>
        <Navbar />
        <div className="venue-detail-error">
          <p>{error || "Venue non trovato"}</p>
        </div>
        <Footer />
      </>
    );
  }

  const selectedPkg = venue.packages?.find(pkg => pkg.id === selectedPackage);

  return (
    <>
      <Navbar />
      <main className="venue-detail-container">
        {/* Hero Section */}
        <section className="venue-detail-hero">
          {venue.logoURL && (
            <img 
              src={venue.logoURL} 
              alt={venue.name} 
              className="venue-detail-logo"
            />
          )}
          <h1 className="venue-detail-name">{venue.name}</h1>
          <p className="venue-detail-address">📍 {venue.address}</p>
        </section>

        {/* Gallery */}
        {venue.photos && venue.photos.length > 0 && (
          <section className="venue-detail-gallery">
            <div className="venue-detail-gallery-grid">
              {venue.photos.slice(0, 4).map((photo, index) => (
                <img 
                  key={index}
                  src={photo} 
                  alt={`${venue.name} - foto ${index + 1}`}
                  className="venue-detail-gallery-image"
                />
              ))}
            </div>
          </section>
        )}

        {/* Description */}
        {venue.description && (
          <section className="venue-detail-section">
            <h2 className="venue-detail-section-title">Descrizione</h2>
            <p className="venue-detail-description">{venue.description}</p>
          </section>
        )}

        {/* Services */}
        {venue.services && venue.services.length > 0 && (
          <section className="venue-detail-section">
            <h2 className="venue-detail-section-title">Servizi</h2>
            <div className="venue-detail-services">
              {venue.services.map((service, index) => (
                <span key={index} className="venue-detail-service-tag">
                  ✓ {service}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Opening Hours */}
        {venue.openingDays && venue.openingDays.length > 0 && (
          <section className="venue-detail-section">
            <h2 className="venue-detail-section-title">Orari di Apertura</h2>
            <div className="venue-detail-hours">
              {venue.openingDays.map((dayInfo) => (
                <div key={dayInfo.day} className="venue-detail-hour-row">
                  <span className="venue-detail-day">{getDayName(dayInfo.day)}</span>
                  <span className="venue-detail-hour-value">
                    {dayInfo.isClosed 
                      ? "Chiuso" 
                      : dayInfo.periods.map((period, idx) => (
                          <span key={idx}>
                            {period.open} - {period.close}
                            {idx < dayInfo.periods.length - 1 && ", "}
                          </span>
                        ))
                    }
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Packages */}
        {venue.packages && venue.packages.length > 0 && (
          <section className="venue-detail-section">
            <h2 className="venue-detail-section-title">Spazi Disponibili</h2>
            <div className="venue-detail-packages">
              {venue.packages.map((pkg) => (
                <PackageCard 
                  key={pkg.id} 
                  package={pkg}
                  onBook={handleBookPackage}
                />
              ))}
            </div>
          </section>
        )}

        {/* Booking Form Modal */}
        {showBookingForm && selectedPkg && (
          <div className="booking-modal-overlay" onClick={() => setShowBookingForm(false)}>
            <div className="booking-modal-content" onClick={(e) => e.stopPropagation()}>
              <BookingForm
                venueId={venue.id}
                packageId={selectedPkg.id}
                packageName={selectedPkg.name}
                onSubmit={handleBookingSubmit}
                onCancel={() => {
                  setShowBookingForm(false);
                  setSelectedPackage(null);
                }}
              />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
