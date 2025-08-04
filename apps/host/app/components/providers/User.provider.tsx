'use client';
import { useEffect, useState } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { useRouter } from 'next/navigation';
import { authUserAtom, userProfileAtom } from '@repo/ui/store/LayoutStore';
import { useLogout } from '../../hooks/useLogout';

type Props = {
  children: React.ReactNode;
};

export const UserProvider = ({ children }: Props) => {
  const authUser = useAtomValue(authUserAtom);
  const userProfile = useAtomValue(userProfileAtom);

  const setUser = useSetAtom(authUserAtom);
  const setUserProfile = useSetAtom(userProfileAtom);

  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const logout = useLogout();

  useEffect(() => {
    const token = localStorage.getItem('token'); //FIX ToDo: Token non in localStorage ma in Cookie

    if (!token) {
      setLoading(false);
      return;
    }

    if (authUser && userProfile) {
      //Se abbiamo già in memoria gli Atomi dell'utente e del suo Profilo, no Ricarica
      setLoading(false);
      return;
    }

    fetch('http://localhost:3001/user/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async res => {
        if (!res.ok) throw new Error('Unauthorized');
        const data = await res.json();

        setUser(data.user); //Atomo per Autenticazione Utente
        setUserProfile(data.profile); //Atomo per Sezione Profilo
      })
      .catch(() => {
        logout();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router, setUser, logout, authUser, userProfile, setUserProfile]);

  if (loading) return <div>Caricamento profilo...</div>;

  return <>{children}</>;
};
