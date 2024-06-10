'use client';

import CustomInput from '@/components/custom/CustomInput';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { memo } from "react";

interface ClientNameGetterProps {
  form: any;
}

function ClientNameGetter({ form }: ClientNameGetterProps) {
  return (
    <FormField
      control={form.control}
      name={'firstName'}
      render={({ field }) => (
        <FormItem className={'flex flex-col gap-y-[0.875rem]'}>
          <FormLabel className={'font-normal text-textBlack80 text-sm'}>First name</FormLabel>
          <FormControl>
            <CustomInput
              value={field.value ?? ''}
              onChange={(value) => {
                form.setValue('firstName', value);
              }}
              className={
                '!m-0 !ring-transparent !outline-transparent h-auto border py-3 px-5 rounded-lg border-borderGray text-sm text-textBlack40'
              }
              type={'text'}
              placeholder={'Input first name'}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
export default memo(ClientNameGetter);
