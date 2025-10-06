"use client";

import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">Anywhere</h3>
          <p className="footer-description">
            La piattaforma per trovare e prenotare spazi di lavoro in tutta Italia.
          </p>
        </div>

        <div className="footer-section">
          <h4 className="footer-section-title">Link Utili</h4>
          <ul className="footer-links">
            <li>
              <Link href="/" className="footer-link">Home</Link>
            </li>
            <li>
              <Link href="/venues" className="footer-link">Esplora Spazi</Link>
            </li>
            <li>
              <Link href="/bookings" className="footer-link">Le mie prenotazioni</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-section-title">Informazioni</h4>
          <ul className="footer-links">
            <li>
              <Link href="/about" className="footer-link">Chi siamo</Link>
            </li>
            <li>
              <Link href="/contact" className="footer-link">Contatti</Link>
            </li>
            <li>
              <Link href="/privacy" className="footer-link">Privacy Policy</Link>
            </li>
            <li>
              <Link href="/terms" className="footer-link">Termini e Condizioni</Link>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h4 className="footer-section-title">Contatti</h4>
          <ul className="footer-contact">
            <li className="footer-contact-item">
              📧 info@anywhere.com
            </li>
            <li className="footer-contact-item">
              📞 +39 02 1234 5678
            </li>
            <li className="footer-contact-item">
              📍 Milano, Italia
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="footer-copyright">
          © {currentYear} Anywhere. Tutti i diritti riservati.
        </p>
      </div>
    </footer>
  );
}
