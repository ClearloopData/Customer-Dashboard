'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

//define the type
type AuthContextType = {
  user: User | null;
  loading: boolean;
};

//make AuthContext, which will share info (current user and whether page is loading) 
// across the app globally
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  
  //states for user, loading
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  //some interaction with Firebase authentication, but I'm not sure
  // exactly what it does
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
