import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/src/config/firebase';
import { getUserProfile } from '@/src/services/authService';
import { useAuthStore } from '@/src/store/authStore';

export function useAuthBootstrap() {
  const { setLoading, setUser, setProfile, clearAuth } = useAuthStore();

  useEffect(() => {
    if (!auth) {
      clearAuth();
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        clearAuth();
        return;
      }

      setUser(firebaseUser);

      try {
        const profile = await getUserProfile(firebaseUser.uid);
        setProfile(
          profile ?? {
            id: firebaseUser.uid,
            email: firebaseUser.email ?? '',
            displayName: firebaseUser.displayName ?? 'Student',
            role: 'student',
          }
        );
      } catch {
        setProfile({
          id: firebaseUser.uid,
          email: firebaseUser.email ?? '',
          displayName: firebaseUser.displayName ?? 'Student',
          role: 'student',
        });
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, [clearAuth, setLoading, setProfile, setUser]);
}
