'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import CreateButton from '@/components/custom/CreateButton';
import FormComboboxGetter from '@/components/custom/FormComboboxGetter';
import FormInputDataGetter from '@/components/custom/FormInputDataGetter';
import UploadGetter from '@/components/projects/create/UploadGetter';
import { Form } from '@/components/ui/form';

const subcontractorCreateFormSchema = z.object({
  subcontractorNumber: z.string(),
  speciality: z.string(),
  commerceNumber: z.string().max(10),
  vatTaxNumber: z.string(),
  businessAddress: z.string(),
  houseNumber: z.string(),
  extraBusinessAddressInfo: z.string(),
  postalCode: z.string(),
  city: z.string(),
  country: z.string(),
  email: z.string().email(),
  telephone1: z.string().max(10),
  telephone2: z.string().max(10),
  files: z.any(),
});

export default function Home() {
  const form = useForm<z.infer<typeof subcontractorCreateFormSchema>>({
    resolver: zodResolver(subcontractorCreateFormSchema),
    defaultValues: {},
  });
  const onInvalid = (errors: any) => console.error(errors);
  const onSubmit = (data: z.infer<typeof subcontractorCreateFormSchema>) => {
    console.log(data);
  };
  return (
    <div className={'size-full bg-bgLightGreen p-5'}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className={'w-[655px] max-w-[90%] flex flex-col gap-y-6'}
        >
          <div className={'flex justify-end'}>
            <CreateButton type={'submit'}>Save</CreateButton>
          </div>
          <div className={'bg-white border border-borderBlack10 rounded-lg p-6 flex flex-col gap-y-4'}>
            <div className={'flex flex-col gap-y-4'}>
              <div className={'grid grid-cols-2 gap-x-4 items-center'}>
                <FormInputDataGetter
                  form={form}
                  label={'Subcontractor number'}
                  placeholder={'Input subcontractor number'}
                  name={'subcontractorNumber'}
                />
                <FormInputDataGetter
                  form={form}
                  label={'Specialty'}
                  placeholder={'Input specialty'}
                  name={'speciality'}
                />
              </div>
              <div className={'grid grid-cols-2 gap-x-4 items-center'}>
                <FormInputDataGetter
                  form={form}
                  label={'Chamber of commerce number'}
                  placeholder={'Input coc number'}
                  name={'commerceNumber'}
                />
                <FormInputDataGetter
                  form={form}
                  label={'VAT tax number'}
                  placeholder={'Input VAT tax number'}
                  name={'vatTaxNumber'}
                />
              </div>
              <div className={'grid grid-cols-2 gap-x-4 items-center'}>
                <FormInputDataGetter
                  form={form}
                  label={'Business address'}
                  placeholder={'Input business address'}
                  name={'businessAddress'}
                />
                <FormInputDataGetter
                  form={form}
                  label={'House number'}
                  placeholder={'Input house number'}
                  name={'houseNumber'}
                />
              </div>
              <FormInputDataGetter
                form={form}
                label={'Extra business address information'}
                placeholder={'Input extra business information'}
                name={'extraBusinessAddressInfo'}
              />
              <div className={'grid grid-cols-2 gap-x-4 items-center'}>
                <FormComboboxGetter
                  form={form}
                  label={'Postal code'}
                  placeholder={'Input postal code'}
                  name={'postalCode'}
                />
                <FormComboboxGetter form={form} label={'City'} placeholder={'Input city'} name={'city'} />
              </div>
              <div className={'grid grid-cols-2 gap-x-4 items-center'}>
                <FormComboboxGetter form={form} label={'Country'} placeholder={'Input country'} name={'country'} />
                <FormInputDataGetter
                  type={'email'}
                  form={form}
                  label={'Email'}
                  placeholder={'Input email'}
                  name={'email'}
                />
              </div>
              <div className={'grid grid-cols-2 gap-x-4 items-center'}>
                <FormInputDataGetter
                  type={'tel'}
                  form={form}
                  label={'Telephone 1'}
                  placeholder={'Input tel number'}
                  name={'telephone1'}
                />
                <FormInputDataGetter
                  type={'tel'}
                  form={form}
                  label={'Telephone 2'}
                  placeholder={'Input tel number'}
                  name={'telephone2'}
                />
              </div>
            </div>
            <UploadGetter form={form} />
          </div>
        </form>
      </Form>
    </div>
  );
}
