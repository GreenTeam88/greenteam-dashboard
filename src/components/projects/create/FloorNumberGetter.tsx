'use client';

import ShadcnCustomMultiSelect from '@/components/custom/ShadcnCustomMultiSelect';
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
            <ShadcnCustomMultiSelect
              btnClassName={
                '!m-0 w-full text-sm text-textBlack font-[400] border-borderGray rounded-lg py-3 px-5 h-auto'
              }
              placeholderClassName={'!m-0'}
              menuListItemsClassName={'text-sm'}
              menuClassName={'w-[300px] bg-white'}
              placeholder={'Choose a floor(s)'}
              data={floorNumberData}
              value={field.value}
              setValue={(value) => {
                form.setValue('floorNumber', value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
