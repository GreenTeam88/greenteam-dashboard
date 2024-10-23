'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';

import CreateButton from '@/components/custom/CreateButton';
import CustomInput from '@/components/custom/CustomInput';
import { CustomSelect } from '@/components/custom/CustomSelect';
import { Button } from '@/components/ui/button';
import { Subservice } from '@/types';

export default function CreateService() {
  const [subServices, setSubServices] = useState<Subservice[]>([]);
  const [serviceName, setServiceName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAddSubService = () => {
    if (subServices.length >= 30) {
      setError('You cannot add more than 8 subservices.');
      return;
    }
    setSubServices((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: '',
        price: 0,
        unit: 'm2',
      },
    ]);
    setError(null); // Clear error if new subservice is added successfully
  };

  const handleDeleteSubService = (id: string) => {
    setSubServices((prev) => prev.filter((service) => service.id !== id));
  };

  const handleChange = (id: string, field: keyof Subservice, value: string | number) => {
    setSubServices((prev) =>
      prev.map((service) =>
        service.id === id
          ? {
              ...service,
              [field]: value,
            }
          : service
      )
    );
  };

  const validateSubServices = () => {
    if (!serviceName) {
      setError('Service name is required.');
      return false;
    }
    for (const service of subServices) {
      if (!service.name || service.price <= 0 || !service.unit) {
        return false; // Validation failed
      }
    }
    return true; // Validation passed
  };

  const handleNextPage = () => {
    if (!validateSubServices()) {
      setError('Please fill out all fields for subservices before proceeding.');
      return;
    }
    setError(null); // Clear the error if validation passes

    // Passing subServices to the next page using router.push query params
    const subServicesQuery = encodeURIComponent(JSON.stringify(subServices));
    router.push(`/dashboard/pricelist/create/addSubcontractor?subServices=${subServicesQuery}`);
  };

  return (
    <div className=" w-full mx-auto">
      <div>
        <div className="flex  justify-between items-center mb-7">
          <h3 className="text-xl font-semibold flex  text-gray-900">Create Service</h3>
          <CreateButton onClick={handleNextPage}>Next</CreateButton>
        </div>
      </div>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="p-5 bg-white rounded-lg border border-gray-200">
        <div className="mb-4">
          <label htmlFor="serviceName" className="block text-sm font-medium text-gray-700 mb-2">
            Service name
          </label>
          <CustomInput
            name="serviceName"
            type="text"
            className="mt-1 block w-full border border-gray-300 rounded-md p-3"
            placeholder="Input extra business information"
            onChange={(value) => {
              if (typeof value === 'string') {
                setServiceName(value); // Only set if it's a string
              }
            }}
          />
        </div>

        <div className="space-y-4 mb-6">
          {subServices.map((service) => (
            <div
              key={service.id}
              className="grid grid-cols-1 md:grid-cols-34 lg-custom:grid-cols-12  gap-4 p-0 bg-white rounded-lg  items-center"
            >
              <div className="md:col-span-24 lg-custom:col-span-12">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sub service</label>
                <CustomInput
                  type="text"
                  value={service.name}
                  placeholder="Input sub service name"
                  className="w-full border border-gray-300 rounded-md p-3"
                  onChange={(value) => handleChange(service.id, 'name', value)}
                />
              </div>
              <div className="md:col-span-2  lg-custom:col-span-5 ">
                <label className="block text-sm font-medium text-gray-700 mb-2">Basic price</label>
                <CustomInput
                  type="number"
                  value={service.price}
                  placeholder="Basic price"
                  className="w-full border border-gray-300 rounded-md p-3"
                  onChange={(value) => handleChange(service.id, 'price', Number(value))}
                />
              </div>
              <div className="md:col-span-2  lg-custom:col-span-5 ">
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <CustomSelect
                  value={service.unit}
                  className="w-full border border-gray-300 rounded-md p-3 "
                  data={[
                    { value: 'm2', label: 'm2' },
                    { value: 'm3', label: 'm3' },
                  ]}
                  setValue={(val: string) => handleChange(service.id, 'unit', val)}
                />
              </div>
              <div className="md:col-span-1 flex items center justify-center  md:mt-10 lg-custom:col-span-2">
                <button
                  type="button"
                  onClick={() => handleDeleteSubService(service.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-0">
          <Button
            type="button"
            onClick={handleAddSubService}
            className="text-sm text-orange-500 border border-orange-500 py-3 px-6 rounded-md hover:bg-orange-50 w-44"
          >
            + Add sub service
          </Button>
        </div>
      </div>
    </div>
  );
}
