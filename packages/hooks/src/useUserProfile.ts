import type { AuthUser, UserProfile } from './types';

// These atoms will be passed as parameters to avoid circular dependency
export const useUserProfile = (
  setUser: (user: AuthUser) => void,
  setProfile: (profile: UserProfile) => void
) => {
  return async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Token di autenticazione non trovato');
      }

      const res = await fetch('http://localhost:3001/user/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`Errore ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();

      if (data.user) {
        setUser(data.user);
      }
      if (data.profile) {
        setProfile(data.profile);
      }
    } catch (error) {
      console.error('Errore nel caricamento del profilo:', error);
      throw new Error('Impossibile ricaricare il profilo utente');
    }
  };
};
