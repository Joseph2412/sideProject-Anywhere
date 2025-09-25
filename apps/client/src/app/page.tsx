"use client";

import { CoworkingCard } from "@/components/CoworkingCard";
import { featuredSpaces } from "@/data/featuredSpaces";

export default function HomePage() {
  return (
    <main className="main-container">
      <header className="header">
        <h1 className="title">Anywhere</h1>
        <p className="subtitle">
          Trova e prenota il tuo prossimo spazio di lavoro, ovunque.
        </p>
      </header>

      <div className="search-bar">
        <input
          className="search-input"
          type="text"
          placeholder="Cerca una città, es. Torino"
        />
        <button className="search-button">Cerca</button>
      </div>

      <section className="featured-section">
        <h2 className="featured-title">Spazi in Evidenza</h2>
        <div className="card-grid">
          {featuredSpaces.map((space) => (
            <CoworkingCard key={space.name} {...space} />
          ))}
        </div>
      </section>
    </main>
  );
}
