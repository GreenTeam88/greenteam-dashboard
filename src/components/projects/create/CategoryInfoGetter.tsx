'use client';

import CustomCombobox from '@/components/custom/CustomCombobox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface CategoryInfoGetterProps {
  categoryData: { value: string; label: string }[];
  form: any;
}

export default function CategoryInfoGetter({ form, categoryData }: CategoryInfoGetterProps) {
  return (
    <FormField
      control={form.control}
      name={'category'}
      render={({ field }) => (
        <FormItem className={'w-full flex flex-col gap-y-[0.875rem]'}>
          <FormLabel className={'font-normal text-textBlack80 text-sm'}>Category</FormLabel>
          <FormControl>
            <CustomCombobox
              value={field.value}
              setValue={(value) => {
                form.setValue('category', value);
              }}
              placeholder={'Choose category'}
              notFoundText={'Client not found.'}
              data={categoryData}
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
