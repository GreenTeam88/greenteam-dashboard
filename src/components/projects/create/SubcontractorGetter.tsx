'use client';

import CustomCombobox from '@/components/custom/CustomCombobox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Option } from '@/types';

interface SubcontractorGetterProps {
  form: any;
  subcontractorData: Option[];
}

export default function SubcontractorGetter({ form, subcontractorData }: SubcontractorGetterProps) {
  return (
    <FormField
      control={form.control}
      name={'subcontractor'}
      render={({ field }) => (
        <FormItem className={'flex flex-col gap-y-[0.875rem]'}>
          <FormLabel className={'font-normal text-textBlack80 text-sm'}>Assigned subcontractor (optional)</FormLabel>
          <FormControl>
            <CustomCombobox
              value={field.value}
              setValue={(value) => {
                form.setValue('subcontractor', value);
              }}
              placeholder={'Assign subcontractor'}
              notFoundText={'Subcontractor not found.'}
              data={subcontractorData}
              popoverBtnClassName={
                '!m-0 w-full text-sm text-textBlack font-[400] border-borderGray rounded-lg py-3 px-5 h-auto'
              }
              popoverContentClassName={'w-[300px]'}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
