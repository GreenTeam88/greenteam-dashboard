'use client';

import Link from 'next/link';
import { useState } from 'react';

import CreateButton from '@/components/custom/CreateButton';
import ProjectsDataTable from '@/components/projects/ProjectsDataTable';

// import SortBy from '@/components/SortBy';

export default function Home() {
  const [filterType, setFilterType] = useState('All');
  return (
    <div className={'bg-bgLightGreen w-full h-full p-5'}>
      <div className={'flex justify-end '}>
        <CreateButton asChild={true}>
          <Link href={'/dashboard/projects/create'}>Create Project</Link>
        </CreateButton>
      </div>
      <div className="py-5">
        <ProjectsDataTable activeFilter={filterType} setActiveFilter={setFilterType} />
      </div>
    </div>
  );
}
