'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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

const clientCreateFormSchema = z
  .object({
    clientType: z.enum(['Private', 'Business Client']),
    firstName: z.string().min(1, { message: 'First Name is required' }).max(255).optional(),
    lastName: z.string().min(1, { message: 'Last Name is required' }).max(255).optional(),
    companyName: z.string().min(1, { message: 'Company Name is required' }).max(255).optional(),
    address: z.string().min(1, { message: 'Address is required' }).max(255).optional(),
    businessAddress: z.string().min(1, { message: 'Business Address is required' }).max(255).optional(),
    houseNumber: z.string().min(1, { message: 'House Number is required' }).max(255).optional(),
    cocNumber: z.string().min(1, { message: 'Chamber of Commerce Number is required' }).max(255).optional(),
    vatTaxNumber: z.string().min(1, { message: 'VAT Tax Number is required' }).max(255).optional(),
    extraAddressInfo: z.string().min(1, { message: 'Extra Address Info is required' }).max(255).optional(),
    extraBusinessAddressInfo: z
      .string()
      .min(1, { message: 'Extra Business Address Info is required' })
      .max(255)
      .optional(),
    postalCode: z.string().min(1, { message: 'Postal Code is required' }).max(255),
    city: z.string().min(1, { message: 'City is required' }).max(255),
    country: z.string().min(1, { message: 'Country is required' }).max(255),
    email: z.string().email({ message: 'Invalid email address' }),
    telephone1: z.string().min(1, { message: 'Telephone1 is required' }).max(255),
    telephone2: z.string().min(1, { message: 'Telephone2 is required' }).max(255),
  })
  .superRefine((data, ctx) => {
    if (data.clientType === 'Private') {
      if (!data.firstName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'First Name is required for Private clients',
          path: ['firstName'],
        });
      }
      if (!data.lastName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Last Name is required for Private clients',
          path: ['lastName'],
        });
      }
      if (!data.address) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Address is required for Private clients',
          path: ['address'],
        });
      }
      if (!data.houseNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'House Number is required for Private clients',
          path: ['houseNumber'],
        });
      }
      if (!data.extraAddressInfo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Extra Address Info is required for Private clients',
          path: ['extraAddressInfo'],
        });
      }
    } else if (data.clientType === 'Business Client') {
      if (!data.companyName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Company Name is required for Business clients',
          path: ['companyName'],
        });
      }
      if (!data.businessAddress) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Business Address is required for Business clients',
          path: ['businessAddress'],
        });
      }
      if (!data.cocNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Chamber of Commerce Number is required for Business clients',
          path: ['cocNumber'],
        });
      }
      if (!data.vatTaxNumber) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'VAT Tax Number is required for Business clients',
          path: ['vatTaxNumber'],
        });
      }
      if (!data.extraBusinessAddressInfo) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Extra Business Address Info is required for Business clients',
          path: ['extraBusinessAddressInfo'],
        });
      }
    }
  });

export default function Home() {
  const form = useForm<z.infer<typeof clientCreateFormSchema>>({
    resolver: zodResolver(clientCreateFormSchema),
    defaultValues: {
      clientType: 'Private',
      country: 'netherlands',
    },
  });

  const onInvalid = (errors: any) => {
    console.log(form.getValues());
    console.error(errors);
  };

  function onSubmit(values: z.infer<typeof clientCreateFormSchema>) {
    console.log(values);
  }

  const activeType = useWatch({
    control: form.control,
    name: 'clientType',
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className={'bg-bgLightGreen w-full h-full p-5'}>
        <div className={'w-[655px] max-w-[90%] h-full flex flex-col gap-y-6'}>
          <div className={'flex justify-end'}>
            <CreateButton type={'submit'}>Save</CreateButton>
          </div>
          <div className={'flex flex-col bg-white border border-borderBlack10 p-6 rounded-lg gap-y-4'}>
            <ClientTypeGetter activeType={activeType} form={form} />
            {activeType === 'Private' ? (
              <PrivateTypeClientGetters form={form} />
            ) : (
              <BusinessTypeClientGetters form={form} />
            )}
            <div className={'grid grid-cols-2 gap-x-4'}>
              <ClientPostalCodeGetter form={form} />
              <ClientCityGetter form={form} />
            </div>
            <div className={'grid grid-cols-2 gap-x-4'}>
              <ClientCountryGetter form={form} />
              <ClientEmailGetter form={form} />
            </div>
            <div className={'grid grid-cols-2 gap-x-4'}>
              <ClientTelephoneGetter form={form} name={'telephone1'} label={'Telephone 1'} />
              <ClientTelephoneGetter form={form} name={'telephone2'} label={'Telephone 2'} />
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
