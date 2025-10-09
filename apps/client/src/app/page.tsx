"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/Navbar";
import { SearchBar } from "@/components/SearchBar";
import { VenueCard } from "@/components/VenueCard";
import { Footer } from "@/components/Footer";
import { Venue } from "@/types";
import { filterVenuesWithPlans } from "@/lib/venueFilters";

const API_URL = process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001";

export default function HomePage() {
  const [featuredVenues, setFeaturedVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedVenues();
  }, []);

  const fetchFeaturedVenues = async () => {
    try {
      console.log('Fetching from:', `${API_URL}/public/venues`); // Debug
      const response = await fetch(`${API_URL}/public/venues`);

      console.log('Response status:', response.status); // Debug

      if (response.ok) {
        const data = await response.json();
        console.log('Data received:', data); // Debug
        
        // ✅ FILTRA solo venues con piani disponibili
        const venuesWithPlans = filterVenuesWithPlans(data.venues || []);
        console.log('Venues with plans:', venuesWithPlans.length); // Debug
        
        // Mostra solo i primi 6 venues featured con piani disponibili
        setFeaturedVenues(venuesWithPlans.slice(0, 6));
      }
    } catch (error) {
      console.error("Errore nel caricamento dei venues:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="main-container">
        <header className="header">
          <h1 className="title">Anywhere</h1>
          <p className="subtitle">
            Trova e prenota il tuo prossimo spazio di lavoro, ovunque.
          </p>
        </header>

        <SearchBar />

        <section className="featured-section">
          <h2 className="featured-title">Spazi in Evidenza</h2>
          
          {loading ? (
            <p>Caricamento spazi...</p>
          ) : featuredVenues.length > 0 ? (
            <div className="card-grid">
              {featuredVenues.map((venue) => (
                <VenueCard key={venue.id} venue={venue} />
              ))}
            </div>
          ) : (
            <p>Nessuno spazio disponibile al momento</p>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
