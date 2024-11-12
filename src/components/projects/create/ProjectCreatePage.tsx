'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import CreateButton from '@/components/custom/CreateButton';
import CategoryInfoGetter from '@/components/projects/create/CategoryInfoGetter';
import ClientPreferenceGetter from '@/components/projects/create/ClientPreferenceGetter';
import DateRangeGetter from '@/components/projects/create/DateGetter'; // Modified for date range
import DetailsGetter from '@/components/projects/create/DetailsGetter';
import HousePartsGetter from '@/components/projects/create/HousePartsGetter';
import SubcontractorGetter from '@/components/projects/create/SubcontractorGetter';
import ToDateGetter from '@/components/projects/create/ToDateGetter';
import UploadGetter from '@/components/projects/create/UploadGetter';
import { Form } from '@/components/ui/form';
import {
  categoriesData,
  housePartsData,
  mockFloorData,
  quotations,
  subcontractors,
} from '@/mockDatas/projectCreateFormDatas';
import { projectCreateFormSchema } from '@/schemas/projectCreateFromSchema';
import FloorNumberGetter from './FloorNumberGetter';
import ProjectNameGetter from './ProjectNameGetter';
import ProjectNumberGetter from './ProjectNumberGetter';
import { QuotationGetter } from './QotationGetter';

export default function ProjectCreateForm() {
  const form = useForm<z.infer<typeof projectCreateFormSchema>>({
    resolver: zodResolver(projectCreateFormSchema),
    defaultValues: {
      quotation: '',
      projectNumber: '',
      client: '',
      category: '',
      projectName: '',
      clientPreferences: '',
      houseParts: [],
      floorNumber: 1,
      projectDateStart: undefined,
      projectDateEnd: undefined,
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
              <div className={'grid grid-cols-2 gap-x-6'}>
                <QuotationGetter quotations={quotations} form={form} />
                <ProjectNumberGetter form={form} />
              </div>
              <div className={'grid grid-cols-2 gap-x-6'}>
                <CategoryInfoGetter form={form} categories={categoriesData} />
                <SubcontractorGetter form={form} subcontractors={subcontractors} />
              </div>
              <div className="grid grid-cols-2 gap-x-6">
                <ProjectNameGetter form={form} />
                <ClientPreferenceGetter form={form} />
              </div>

              <div className={'grid grid-cols-2 gap-x-6'}>
                <HousePartsGetter form={form} housePartData={housePartsData} />

                <FloorNumberGetter form={form} floorNumberData={mockFloorData} />
              </div>
              <div className={'grid grid-cols-2 gap-x-6'}>
                <DateRangeGetter form={form} />
                <ToDateGetter form={form} />
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
