'use client';

import CustomInput from '@/components/custom/CustomInput';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { memo } from "react";

interface ClientLastNameGetterProps {
  form: any;
}

function ClientLastNameGetter({ form }: ClientLastNameGetterProps) {
  return (
    <FormField
      control={form.control}
      name={'lastName'}
      render={({ field }) => (
        <FormItem className={'flex flex-col gap-y-[0.875rem]'}>
          <FormLabel className={'font-normal text-textBlack80 text-sm'}>Last name</FormLabel>
          <FormControl>
            <CustomInput
              value={field.value ?? ''}
              onChange={(value) => {
                form.setValue('lastName', value);
              }}
              className={
                '!m-0 !ring-transparent !outline-transparent h-auto border py-3 px-5 rounded-lg border-borderGray text-sm text-textBlack40'
              }
              type={'text'}
              placeholder={'Input last name'}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
export default memo(ClientLastNameGetter);
