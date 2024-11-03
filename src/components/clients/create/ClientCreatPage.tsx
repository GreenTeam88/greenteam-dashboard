'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import BusinessTypeClientGetters from '@/components/clients/create/BusinessTypeClientGetters';
import ClientCityGetter from '@/components/clients/create/ClientCityGetter';
import ClientCountryGetter from '@/components/clients/create/ClientCountryGetter';
import ClientEmailGetter from '@/components/clients/create/ClientEmailGetter';
import ClientPostalCodeGetter from '@/components/clients/create/ClientPostalCodeGetter';
import ClientTelephoneGetter from '@/components/clients/create/ClientTelephoneGetter';
import ClientTypeGetter from '@/components/clients/create/ClientTypeGetter';
import PrivateTypeClientGetters from '@/components/clients/create/PrivateTypeClientGetters';
import CreateButton from '@/components/custom/CreateButton';
import { Form } from '@/components/ui/form';
import { cities, countries } from '@/mockDatas/clientCreateDatas';
import { clientCreateFormSchema } from '@/schemas/clientCreateFormSchema';

export default function ClientCreateForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof clientCreateFormSchema>>({
    resolver: zodResolver(clientCreateFormSchema),
    defaultValues: { clientType: 'Private', country: 'netherlands' },
  });

  const [selectedCountry, setSelectedCountry] = useState<keyof typeof cities>('netherlands');
  const filteredCities = cities[selectedCountry] || [];

  const activeType = useWatch({ control: form.control, name: 'clientType' });

  const handleCountryChange = (value: string) => {
    setSelectedCountry(value as keyof typeof cities); // Ensure value is typed correctly
    form.setValue('country', value);
    form.setValue('city', ''); // Reset city when country changes
  };

  const onSubmit = (values: z.infer<typeof clientCreateFormSchema>) => {
    // Filter the form values to only include filled fields
    const filteredValues = Object.fromEntries(Object.entries(values).filter(([, v]) => v !== '' && v !== undefined));

    const clientData = {
      clientType: values.clientType,
      ...(values.clientType === 'Private'
        ? {
            firstName: filteredValues.firstName,
            lastName: filteredValues.lastName,
            address: filteredValues.address,
            houseNumber: filteredValues.houseNumber,
            extraAddressInfo: filteredValues.extraAddressInfo,
            postalCode: filteredValues.postalCode,
            city: filteredValues.city,
            country: filteredValues.country,
            preferredLanguage: filteredValues.preferredLanguage,
            email: filteredValues.email,
            telephone1: filteredValues.telephone1,
            telephone2: filteredValues.telephone2,
          }
        : {
            companyName: filteredValues.companyName,
            cocNumber: filteredValues.cocNumber,
            firstName: filteredValues.firstName,
            lastName: filteredValues.lastName,
            vatTaxNumber: filteredValues.vatTaxNumber,
            businessAddress: filteredValues.businessAddress,
            houseNumber: filteredValues.houseNumber,
            extraBusinessAddressInfo: filteredValues.extraBusinessAddressInfo,
            postalCode: filteredValues.postalCode,
            city: filteredValues.city,
            country: filteredValues.country,
            preferredLanguage: filteredValues.preferredLanguage,
            email: filteredValues.email,
            telephone1: filteredValues.telephone1,
            telephone2: filteredValues.telephone2,
          }),
    };

    console.log('Client Data:', clientData);

    router.push('/dashboard/clients');
  };

  const onInvalid = (errors: any) => {
    console.error(errors);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="bg-bgLightGreen w-full h-full p-5">
        <div className="w-[655px] max-w-[90%] h-full flex flex-col gap-y-6">
          <div className="flex justify-end">
            <CreateButton type="submit">Save</CreateButton>
          </div>
          <div className="flex flex-col bg-white border border-borderBlack10 p-6 rounded-lg gap-y-4">
            <ClientTypeGetter activeType={activeType} form={form} />
            {activeType === 'Private' ? (
              <PrivateTypeClientGetters form={form} />
            ) : (
              <BusinessTypeClientGetters form={form} />
            )}
            <div className="grid grid-cols-2 gap-x-4">
              <ClientPostalCodeGetter form={form} />
              <ClientCityGetter form={form} cities={filteredCities} />
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              <ClientCountryGetter form={form} countries={countries} onCountryChange={handleCountryChange} />
              <ClientEmailGetter form={form} />
            </div>
            <div className="grid grid-cols-2 gap-x-4">
              <ClientTelephoneGetter form={form} name="telephone1" label="Telephone 1" />
              <ClientTelephoneGetter form={form} name="telephone2" label="Telephone 2" />
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
