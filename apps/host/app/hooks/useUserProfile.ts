import { useSetAtom } from 'jotai';
import { authUserAtom, userProfileAtom } from '@repo/ui/store/LayoutStore';

export const useUserProfile = () => {
  const setUser = useSetAtom(authUserAtom);
  const setProfile = useSetAtom(userProfileAtom);

  return async () => {
    const res = await fetch('http://localhost:3001/user/profile', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    if (!res.ok) {
      throw new Error('Impossibile Ricaricare il Profilo');
    }

    const data = await res.json();
    if (data.user) {
      setUser(data.user);
    }
    if (data.profile) {
      setProfile(data.profile);
    }
  };
};
