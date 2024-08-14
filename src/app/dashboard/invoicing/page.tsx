'use client';

import Link from 'next/link';
import { useState } from 'react';

import CreateButton from '@/components/custom/CreateButton';
import InvoicingDataTable from '@/components/invoicing/InvoicingDataTable';
import InvoicingExportSidebar from '@/components/invoicing/InvoicingExportSidebar';
import SortBy from '@/components/SortBy';
import { Button } from '@/components/ui/button';
import useModalStore from '@/store/ModalStore';

export type InvoicingFilterTypes = 'All' | 'Received' | 'Project paid' | 'Subcontractor paid';

export default function Home() {
  const { openModal } = useModalStore();
  const [activeFilter, setActiveFilter] = useState<InvoicingFilterTypes>('All');
  return (
    <div className={'size-full bg-bgLightGreen p-5'}>
      <div className={'flex items-center justify-between'}>
        <SortBy />
        <div className={'flex items-center gap-x-4'}>
          <Button
            onClick={() => {
              openModal(<InvoicingExportSidebar />);
            }}
            className={'py-2.5 px-5 border rounded-lg border-borderSecondaryOrange text-textSecondaryOrange h-auto'}
          >
            Export
          </Button>
          <CreateButton asChild={true}>
            <Link href={'/dashboard/invoicing/create'}>Create Invoice</Link>
          </CreateButton>
        </div>
      </div>
      <InvoicingDataTable activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
    </div>
  );
}
