// src/hooks/useAuth.ts
'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useState } from 'react';

export function useAuth() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  
  const loginWithCredentials = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password
      });
      return result;
    } finally {
      setLoading(false);
    }
  };
  
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } finally {
      setLoading(false);
    }
  };
  
  const logout = async () => {
    setLoading(true);
    try {
      await signOut({ callbackUrl: '/' });
    } finally {
      setLoading(false);
    }
  };
  
  return {
    user: session?.user,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading' || loading,
    loginWithCredentials,
    loginWithGoogle,
    logout
  };
}