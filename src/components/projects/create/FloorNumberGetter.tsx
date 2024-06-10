'use client';

import CustomCombobox from '@/components/custom/CustomCombobox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Option } from '@/types';

interface FloorNumberGetterProps {
  floorNumberData: Option[];
  form: any;
}
export default function FloorNumberGetter({ floorNumberData, form }: FloorNumberGetterProps) {
  return (
    <FormField
      control={form.control}
      name={'floorNumber'}
      render={({ field }) => (
        <FormItem className={'flex flex-col gap-y-[0.875rem]'}>
          <FormLabel className={'font-normal text-textBlack80 text-sm'}>Floor number</FormLabel>
          <FormControl>
            <CustomCombobox
              value={field.value}
              setValue={(value) => {
                form.setValue('floorNumber', value);
              }}
              placeholder={'Floor number'}
              notFoundText={'Floor not found.'}
              data={floorNumberData}
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
