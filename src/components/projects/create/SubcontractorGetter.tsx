'use client';

import { SubcontractorSelect } from '@/components/custom/SubcontractorSelect';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Subcontractor } from '@/types';

interface SubcontractorGetterProps {
  form: any;
  subcontractors: Subcontractor[];
}

export default function SubcontractorGetter({ form, subcontractors }: SubcontractorGetterProps) {
  return (
    <FormField
      control={form.control}
      name={'subcontractor'}
      render={({ field }) => (
        <FormItem className={'flex flex-col gap-y-[0.875rem]'}>
          <FormLabel className={'font-normal text-textBlack80 text-sm'}>
            Assigned subcontractor <span className="text-textBlack40">(Optional)</span>
          </FormLabel>
          <FormControl></FormControl>
          <SubcontractorSelect
            itemActiveClassName="bg-bgLightGreenHover font-semibold"
            triggerClassName="!m-0 h-auto w-full !ring-transparent !outline-transparent py-3 px-5 border border-borderGray rounded-lg text-sm text-textBlack"
            contentClassName="bg-white"
            itemClassName="text-sm text-textBlack hover:bg-bgLightGreenHover"
            data={subcontractors}
            setValue={(value) => {
              form.setValue('preferredLanguage', value);
            }}
            value={field.value ?? ''}
            placeholder="Assign subcontractors"
          />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
