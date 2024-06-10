import React from 'react';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
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
