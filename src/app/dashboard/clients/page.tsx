'use client';

import Link from 'next/link';
import { useState } from 'react';

import ClientsDataTable from '@/components/clients/ClientsDataTable';
import CreateButton from '@/components/custom/CreateButton';

export default function Home() {
  const [filterType, setFilterType] = useState('All');
  return (
    <div className={'bg-bgLightGreen w-full h-full p-5'}>
      <div className={'flex justify-end'}>
        <CreateButton asChild={true}>
          <Link href={'/dashboard/clients/create'}>Create Client</Link>
        </CreateButton>
      </div>
      <div className="py-5">
        <ClientsDataTable activeFilter={filterType} setActiveFilter={setFilterType} />
      </div>
    </div>
  );
}
