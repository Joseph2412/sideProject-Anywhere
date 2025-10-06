"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Venue } from "@/types";
import { VenueCard } from "@/components/VenueCard";
import { SearchBar } from "@/components/SearchBar";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function VenuesPage() {
  const searchParams = useSearchParams();
  const cityParam = searchParams?.get("city");
  
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchCity, setSearchCity] = useState(cityParam || "");

  useEffect(() => {
    fetchVenues(cityParam || "");
  }, [cityParam]);

  const fetchVenues = async (city: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const url = city 
        ? `${API_URL}/public/venues?city=${encodeURIComponent(city)}`
        : `${API_URL}/public/venues`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Impossibile caricare i venue");
      }
      
      const data = await response.json();
      setVenues(data.venues || []);
      setSearchCity(city);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore nel caricamento");
      setVenues([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (city: string) => {
    fetchVenues(city);
  };

  return (
    <>
      <Navbar />
      <main className="venues-page-container">
        <div className="venues-page-header">
          <h1 className="venues-page-title">Esplora gli Spazi</h1>
          <p className="venues-page-subtitle">
            {searchCity 
              ? `Risultati per "${searchCity}"` 
              : "Scopri tutti gli spazi di coworking disponibili"}
          </p>
        </div>

        <div className="venues-page-search">
          <SearchBar onSearch={handleSearch} initialValue={searchCity} />
        </div>

        {loading && (
          <div className="venues-page-loading">
            <p>Caricamento spazi...</p>
          </div>
        )}

        {error && (
          <div className="venues-page-error">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && venues.length === 0 && (
          <div className="venues-page-empty">
            <p>
              {searchCity 
                ? `Nessuno spazio trovato per "${searchCity}"`
                : "Nessuno spazio disponibile al momento"}
            </p>
          </div>
        )}

        {!loading && venues.length > 0 && (
          <div className="venues-page-grid">
            {venues.map((venue) => (
              <VenueCard key={venue.id} venue={venue} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
