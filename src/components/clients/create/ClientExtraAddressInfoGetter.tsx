'use client';

import { memo } from 'react';

import CustomInput from '@/components/custom/CustomInput';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface ClientExtraAddressInfoGetterProps {
  form: any;
}

function ClientExtraAddressInfoGetter({ form }: ClientExtraAddressInfoGetterProps) {
  return (
    <FormField
      control={form.control}
      name={'extraAddressInfo'}
      render={({ field }) => (
        <FormItem className={'flex flex-col gap-y-[0.875rem]'}>
          <FormLabel className={'font-normal text-textBlack80 text-sm'}>Extra address information</FormLabel>
          <FormControl>
            <CustomInput
              value={field.value ?? ''}
              onChange={(value) => {
                form.setValue('extraAddressInfo', value);
              }}
              className={
                '!m-0 !ring-transparent !outline-transparent h-auto border py-3 px-5 rounded-lg border-borderGray text-sm text-textBlack40'
              }
              type={'text'}
              placeholder={'Input extra business address'}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
export default memo(ClientExtraAddressInfoGetter);
