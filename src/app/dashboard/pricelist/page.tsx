'use client';

import { useRouter } from 'next/navigation';

import CreateButton from '@/components/custom/CreateButton';
import ServicesList from '@/components/pricing/ServicesList';
import { servicesData } from '@/mockDatas/pricingDatas';

export default function Home() {
  const router = useRouter(); // Important to use router from next/router

  const handleClick = () => {
    router.push('/dashboard/pricelist/create/addService');
  };
  return (
    <div className={'size-full bg-bgLightGreen p-5 '}>
      <div className="flex justify-end mb-7">
        <CreateButton onClick={handleClick}>Create Service</CreateButton>
      </div>
      <div>
        <ServicesList servicesData={servicesData} />
      </div>
    </div>
  );
}
