import { useEffect, useState } from 'react';
import { FiTrash2 } from 'react-icons/fi';

import CreateButton from '@/components/custom/CreateButton';
import CustomInput from '@/components/custom/CustomInput';
import { CustomSelect } from '@/components/custom/CustomSelect';
import { Button } from '@/components/ui/button';
import { SubcontractorPrice, Subservice } from '@/types';

export default function AddSubcontractors({ subservicesData }: { subservicesData: Subservice[] }) {
  const [subServices, setSubServices] = useState<Subservice[]>([]);
  const [subcontractors, setSubcontractors] = useState<SubcontractorPrice[]>([]);

  useEffect(() => {
    if (subservicesData) {
      setSubServices(subservicesData);
    }
  }, [subservicesData]);

  const handleAddSubcontractor = () => {
    setSubcontractors((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        name: '',
        prices: subServices.map(() => 0),
      },
    ]);
  };

  const handleDeleteSubcontractor = (id: string) => {
    setSubcontractors((prev) => prev.filter((subcontractor) => subcontractor.id !== id));
  };

  const handleSubcontractorChange = (
    id: string,
    field: keyof SubcontractorPrice,
    value: string | number,
    priceIndex?: number
  ) => {
    setSubcontractors((prev) =>
      prev.map((subcontractor) =>
        subcontractor.id === id
          ? {
              ...subcontractor,
              [field]:
                field === 'prices' && typeof priceIndex === 'number'
                  ? subcontractor.prices.map((price, index) => (index === priceIndex ? Number(value) : price))
                  : value,
            }
          : subcontractor
      )
    );
  };

  const handleSave = () => {
    const dataToSave = subServices.map((subService) => ({
      name: subService.name,
      subservices: [
        {
          name: subService.name,
          price: subService.price,
          unit: subService.unit,
        },
      ],
      subcontractors: subcontractors.map((subcontractor) => ({
        name: subcontractor.name,
        prices: subcontractor.prices,
      })),
    }));

    console.log('Data to be saved:', dataToSave);
    console.log('Subservices:', subServices);
    console.log('Subcontractors:', subcontractors);
  };

  return (
    <div className="w-full mx-auto p-5 ">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-900">Add Subcontractors</h3>
        <CreateButton onClick={handleSave}>Save</CreateButton>
      </div>

      <div className=" bg-white rounded-lg shadow-md border border-gray-200 overflow-x-scroll scroll whitespace-nowrap scroll-smooth pr-8">
        <div className=" ">
          <div className="flex flex-nowrap gap-4 p-5 ">
            <div className="shrink-0 font-semibold text-sm w-52">Subcontractors</div>

            {subServices.map((subService, index) => (
              <div key={index} className="shrink-0 font-semibold text-sm w-28">
                {subService.name.length > 10 ? `${subService.name.substring(0, 14)}...` : subService.name}
              </div>
            ))}
          </div>
          <div className="flex flex-nowrap gap-4 p-5 bg-orange-50 min-w-max ">
            <div className="shrink-0 font-semibold text-sm w-52">Basic Price</div>

            {subServices.map((subService, index) => (
              <div key={index} className="shrink-0 font-semibold text-gray-700 text-sm w-28">
                €{subService.price.toFixed(2)}/{subService.unit}
              </div>
            ))}
          </div>

          {subcontractors.map((subcontractor) => (
            <div key={subcontractor.id} className="flex flex-nowrap gap-4 p-5 ">
              <div className="shrink-0 w-52">
                <CustomSelect
                  value={subcontractor.name}
                  className="w-full border border-gray-300 rounded-md p-3"
                  data={[
                    { value: 'B.Demir', label: 'B.Demir' },
                    { value: 'Naim', label: 'Naim' },
                    { value: 'Parketherstel', label: 'Parketherstel' },
                  ]}
                  setValue={(val: string) => handleSubcontractorChange(subcontractor.id, 'name', val)}
                />
              </div>
              {subServices.map((_, index) => (
                <div key={index} className="shrink-0 w-28">
                  <CustomInput
                    type="number"
                    value={subcontractor.prices[index]}
                    placeholder="0"
                    className="w-full border border-gray-300 rounded-md p-3 text-center"
                    onChange={(value) => handleSubcontractorChange(subcontractor.id, 'prices', value, index)}
                  />
                </div>
              ))}
              <div className="shrink-0 flex justify-center">
                <button
                  type="button"
                  onClick={() => handleDeleteSubcontractor(subcontractor.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 size={20} className="mr-5" />
                </button>
              </div>
            </div>
          ))}
          <div className="px-7 mb-3 mt-4">
            <Button
              type="button"
              onClick={handleAddSubcontractor}
              className="text-sm text-orange-500 border border-orange-500 py-3 px-6 rounded-md hover:bg-orange-50 w-44"
            >
              + Add subcontractor
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
