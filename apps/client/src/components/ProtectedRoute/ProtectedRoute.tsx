"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({ 
  children, 
  fallback = null,
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isLoading, isAuthenticated, router, redirectTo]);

  // Mostra loading mentre verifica autenticazione
  if (isLoading) {
    return (
      <div className="protected-route-loading">
        <div className="loading-spinner"></div>
        <p>Verifica autenticazione...</p>
      </div>
    );
  }

  // Se non autenticato, mostra fallback o null
  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  // Se autenticato, mostra il contenuto
  return <>{children}</>;
}
