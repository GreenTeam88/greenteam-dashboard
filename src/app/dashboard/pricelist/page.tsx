import CreateButton from '@/components/custom/CreateButton';
import ServicesList from '@/components/pricing/ServicesList';
import { servicesData } from '@/mockDatas/pricingDatas';

export default function Home() {
  return (
    <div className={'size-full bg-bgLightGreen p-5 '}>
      <div className="flex justify-end mb-7">
        <CreateButton type={'submit'}>Create Service</CreateButton>
      </div>
      <div>
        <ServicesList servicesData={servicesData} />
      </div>
    </div>
  );
}
