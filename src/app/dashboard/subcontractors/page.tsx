import Link from 'next/link';

import CreateButton from '@/components/custom/CreateButton';
import SubcontractorsDataTable from '@/components/subcontractors/SubcontractorsDataTable';

export default function Home() {
  return (
    <div className={'size-full bg-bgLightGreen p-5'}>
      <div className={'flex justify-end'}>
        <CreateButton asChild={true}>
          <Link href={'/dashboard/subcontractors/create'}>Create Subcontractor</Link>
        </CreateButton>
      </div>
      <SubcontractorsDataTable />
    </div>
  );
}
