import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import type { User } from 'firebase/auth';

export const auth = getAuth();

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setUser(user);
    });
  }, []);

  return { user };
}