'use client';
import { useEffect, useState } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { authUserAtom } from '@repo/ui/store/LayoutStore';
import { useUserProfile } from '@repo/hooks';
import { useLogout } from '../../hooks/useLogout';

type Props = {
  children: React.ReactNode;
};

export const UserProvider = ({ children }: Props) => {
  const authUser = useAtomValue(authUserAtom);

  const setUser = useSetAtom(authUserAtom);

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const logout = useLogout();
  const reloadProfile = useUserProfile();

  /**
   * useEffect per gestire l'autenticazione automatica al caricamento del provider
   * Controlla la presenza del token, evita ricaricamenti inutili se i dati sono già presenti,
   * e gestisce il logout automatico in caso di errore nel caricamento del profilo
   * Dependencies: router, setUser, logout, authUser, reloadProfile
   */
  useEffect(() => {
    const token = localStorage.getItem('token'); //FIX ToDo: Token non in localStorage ma in Cookie

    if (!token) {
      setLoading(false);
      return;
    }

    if (authUser) {
      //Se abbiamo già in memoria gli Atomi dell'utente e del suo Profilo, no Ricarica
      setLoading(false);
      return;
    }

    reloadProfile
      .refetch()
      .catch(() => {
        logout();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router, setUser, logout, authUser, reloadProfile]);

  if (loading) return <div>Caricamento profilo...</div>;

  return <>{children}</>;
};
