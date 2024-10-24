'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import AddSubcontractors from '@/components/pricing/create/AddSubcontractors';

// import { subservicesData } from '@/mockDatas/subServicesDatas';

export default function CreateServicePage() {
  const searchParams = useSearchParams();
  const [subservicesData, setSubservicesData] = useState([]);

  useEffect(() => {
    const subServicesQuery = searchParams.get('subServices');
    if (subServicesQuery) {
      // Decode and parse the subservices data from the query string
      const parsedSubServices = JSON.parse(decodeURIComponent(subServicesQuery));
      setSubservicesData(parsedSubServices);
    }
  }, [searchParams]);

  console.log(subservicesData);

  return (
    <div className="flex justify-center items-center bg-bgLightGreen">
      <AddSubcontractors subservicesData={subservicesData} />
    </div>
  );
}
