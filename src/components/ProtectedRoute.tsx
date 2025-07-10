'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  //if we don't have a user (i.e. no valid user is logged in) AND we're not loading in...
  useEffect(() => {
    if (!loading && !user) {
      //... then send user back to the auth page
      router.push('/auth');
    }
  }, [user, loading, router]);

  //if we're loading, then display a loading message
  if (loading) {
    return <div className="text-center mt-20 text-lg">Loading...</div>;
  }

  //if none of the above has already occured, then its safe to load the protected content
  return <>{children}</>;
}
