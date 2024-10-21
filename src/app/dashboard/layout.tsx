'use client';

import { useRouter } from 'next/navigation'; // removed redirect
import React, { useEffect } from 'react';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useAuth } from '@/queryHooks/auth';

// import { useUserStore } from '@/store/UserStore';  make sure to delete the unused components :)

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // const { isAuthenticated } = useUserStore();
  const router = useRouter();
  const { checkAuthClient } = useAuth();
  const { data: session, isSuccess } = checkAuthClient;
  useEffect(() => {
    if (isSuccess && !session) {
      router.replace('/auth/login');
    }
  }, [isSuccess, session, router]);
  return (
    <div className={'flex w-full h-full'}>
      <Sidebar />
      <main className={'flex-1 flex flex-col'}>
        <Navbar />
        <section className={'flex-1'}>{children}</section>
      </main>
    </div>
  );
}
