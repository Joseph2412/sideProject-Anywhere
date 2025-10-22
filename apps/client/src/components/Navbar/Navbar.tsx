"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileIcon } from "@repo/components";

export function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
    router.push('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link href="/" className="navbar-logo">
          Anywhere
        </Link>

        {/* Desktop Navigation */}
        <div className="navbar-links">
          <Link href="/venues" className="navbar-link">
            Esplora
          </Link>
          {isAuthenticated && (
            <Link href="/bookings" className="navbar-link">
              Le mie prenotazioni
            </Link>
          )}
        </div>

        {/* Auth Section - Desktop */}
        <div className="navbar-auth">
          {isAuthenticated ? (
            <div className="navbar-user-menu">
              <button 
                className="navbar-user-button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              >
                <span className="navbar-user-name">Ciao {user?.firstName}!</span>
                <span className="navbar-user-icon">
                  <ProfileIcon width={20} height={20} stroke="currentColor" />
                </span>
              </button>
              
              {userMenuOpen && (
                <div className="navbar-user-dropdown">
                  <div className="navbar-user-info">
                    <p className="navbar-user-email">{user?.email}</p>
                    <p className="navbar-user-role">
                      {user?.role === 'USER' ? 'Cliente' : 'Host'}
                    </p>
                  </div>
                  <div className="navbar-dropdown-divider"></div>
                  <Link 
                    href="/bookings" 
                    className="navbar-dropdown-link"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Le mie prenotazioni
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="navbar-dropdown-link navbar-logout-button"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="navbar-auth-buttons">
              <span className="navbar-user-name">Benvenuto!</span>
                <span className="navbar-user-icon">
                  <ProfileIcon width={20} height={20} stroke="currentColor" />
                </span>
              <Link href="/login" className="navbar-auth-link">
                Accedi
              </Link>
              <Link href="/register" className="navbar-auth-button">
                Registrati
              </Link>
            </div>
          )}
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
          
          {isAuthenticated ? (
            <>
              <Link href="/bookings" className="navbar-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                Le mie prenotazioni
              </Link>
              <div className="navbar-mobile-user">
                <p className="navbar-mobile-user-name">{user?.firstName}</p>
                <p className="navbar-mobile-user-email">{user?.email}</p>
              </div>
              <button 
                onClick={handleLogout}
                className="navbar-mobile-link navbar-mobile-logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="navbar-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                Accedi
              </Link>
              <Link href="/register" className="navbar-mobile-link navbar-mobile-register" onClick={() => setMobileMenuOpen(false)}>
                Registrati
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
