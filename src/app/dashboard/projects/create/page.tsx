'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

import CreateButton from '@/components/custom/CreateButton';
import CustomDropzone from '@/components/custom/CustomDropzone';
import CategoryInfoGetter from '@/components/projects/create/CategoryInfoGetter';
import ClientInfoGetter from '@/components/projects/create/ClientInfoGetter';
import ClientPreferenceGetter from '@/components/projects/create/ClientPreferenceGetter';
import DateGetter from '@/components/projects/create/DateGetter';
import DetailsGetter from '@/components/projects/create/DetailsGetter';
import FloorNumberGetter from '@/components/projects/create/FloorNumberGetter';
import HousePartsGetter from '@/components/projects/create/HousePartsGetter';
import ProjectNameGetter from '@/components/projects/create/ProjectNameGetter';
import SubcontractorGetter from '@/components/projects/create/SubcontractorGetter';
import UploadGetter from '@/components/projects/create/UploadGetter';
import { Form } from '@/components/ui/form';
import {
  categoriesData,
  clientsData,
  floorNumberData,
  housePartsData,
  subcontractorData,
} from '@/mockDatas/projectCreateFormDatas';

const projectCreateFormSchema = z.object({
  client: z.string({ message: 'Client is required' }).min(1, { message: 'Client is required' }),
  category: z.string({ message: 'Category is required' }).min(1, { message: 'Category is required' }),
  projectName: z.string({ message: 'Project name is required' }).min(1, { message: 'Project name is required' }),
  clientPreferences: z
    .string({ message: 'Client preference is required' })
    .min(1, { message: 'Client preference is required' }),
  houseParts: z.string().array().nonempty({ message: 'House parts is required' }),
  floorNumber: z
    .number({ message: 'Floor number is required' })
    .positive({ message: 'Floor number should be a positive number' }),
  projectDate: z.date({ message: 'Date is required' }),
  subcontractor: z.string().optional(),
  details: z.string({ message: 'Details is required' }).min(1, { message: 'Details is required' }),
  files: z.any(),
});

export default function Home() {
  const form = useForm<z.infer<typeof projectCreateFormSchema>>({
    resolver: zodResolver(projectCreateFormSchema),
    defaultValues: {
      client: '',
      category: '',
      projectName: '',
      clientPreferences: '',
      houseParts: [],
      floorNumber: 1,
      projectDate: undefined,
      subcontractor: '',
      details: '',
      files: undefined,
    },
  });
  const onInvalid = (errors: any) => console.error(errors);
  function onSubmit(values: z.infer<typeof projectCreateFormSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className={'bg-bgLightGreen w-full h-full p-5'}>
        <div className={'w-[655px] max-w-[90%] h-full flex flex-col gap-y-6'}>
          <div className={'flex justify-between items-center'}>
            <div className={'flex items-center gap-x-1'}>
              <h5 className={'text-textBlack text-sm'}>Created by</h5>
              <h3 className={'font-semibold text-base leading-5'}>John Doe</h3>
            </div>
            <CreateButton type={'submit'}>Save</CreateButton>
          </div>
          <div className={'flex flex-col bg-white border border-borderBlack10 p-6 rounded-lg gap-y-4'}>
            <h4 className={'text-xl leading-6 text-textBlack font-medium'}>Project information</h4>
            <div className={'flex flex-col gap-y-4'}>
              <ClientInfoGetter clientsData={clientsData} form={form} />
              <div className={'grid grid-cols-2 gap-x-6'}>
                <CategoryInfoGetter form={form} categoryData={categoriesData} />
              </div>
              <div className={'w-full grid grid-cols-2 gap-x-6'}>
                <ProjectNameGetter form={form} />
                <ClientPreferenceGetter form={form} />
              </div>
              <div className={'w-full grid grid-cols-2 gap-x-6'}>
                <HousePartsGetter form={form} housePartData={housePartsData} />
                <FloorNumberGetter form={form} floorNumberData={floorNumberData} />
              </div>
              <div className={'w-full grid grid-cols-2 gap-x-6'}>
                <DateGetter form={form} />
                <SubcontractorGetter form={form} subcontractorData={subcontractorData} />
              </div>
              <DetailsGetter form={form} />
              <UploadGetter form={form} />
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
