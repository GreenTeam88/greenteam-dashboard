'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useContext, useEffect } from 'react';

import LoadingPageWithSpinner from '@/components/ui/LoadingPageWithSpinner';
import { useAuth } from '@/queryHooks/auth';

interface SessionContextType {
  isAuthenticated: boolean;
  loading: boolean;
}

const SessionContext = createContext<SessionContextType | null>(null);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { checkAuthClient } = useAuth();
  const { data: isAuthenticated, isLoading } = checkAuthClient;

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth/login');
    }
  }, [isLoading, isAuthenticated, router]);
  if (isLoading) {
    return <LoadingPageWithSpinner message="Loading ! Please wait..." minLoadingTime={3500} />;
  }

  return (
    <SessionContext.Provider value={{ isAuthenticated: !!isAuthenticated, loading: isLoading }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
