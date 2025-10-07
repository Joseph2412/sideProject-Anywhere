"use client";

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login, error, clearError, isLoading } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    // Validazione base
    if (!email || !password) {
      setLocalError('Inserisci email e password');
      return;
    }

    try {
      await login(email, password);
      // Redirect dopo login riuscito (gestito nel context)
    } catch (err) {
      // L'errore è già gestito nel context
      console.error('Login error:', err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Accedi</h1>
          <p>Benvenuto! Inserisci le tue credenziali per continuare.</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tua@email.com"
              disabled={isLoading}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={isLoading}
              autoComplete="current-password"
              required
            />
          </div>

          {(error || localError) && (
            <div className="auth-error">
              {error || localError}
            </div>
          )}

          <button 
            type="submit" 
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Accesso in corso...' : 'Accedi'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Non hai un account?{' '}
            <Link href="/register" className="auth-link">
              Registrati
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
