import { Service } from '@/types';
import ServiceTable from './ServiceTable';

interface ServicesListProps {
  servicesData: Service[];
}

export default function ServicesList({ servicesData }: ServicesListProps) {
  return (
    <div>
      {servicesData.map((service, index) => (
        <ServiceTable key={index} service={service} />
      ))}
    </div>
  );
}
