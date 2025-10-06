"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          Anywhere
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          <Link href="/" className="navbar-link">
            Home
          </Link>
          <Link href="/venues" className="navbar-link">
            Esplora
          </Link>
          <Link href="/bookings" className="navbar-link">
            Le mie prenotazioni
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="navbar-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${mobileMenuOpen ? "open" : ""}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-menu">
          <Link href="/" className="navbar-mobile-link" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
          <Link href="/venues" className="navbar-mobile-link" onClick={() => setMobileMenuOpen(false)}>
            Esplora
          </Link>
          <Link href="/bookings" className="navbar-mobile-link" onClick={() => setMobileMenuOpen(false)}>
            Le mie prenotazioni
          </Link>
        </div>
      )}
    </nav>
  );
}
