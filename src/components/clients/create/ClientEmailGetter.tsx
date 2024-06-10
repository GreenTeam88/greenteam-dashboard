'use client';

import { Mail } from 'lucide-react';
import { memo } from 'react';

import CustomInput from '@/components/custom/CustomInput';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface ClientEmailGetterProps {
  form: any;
}

function ClientEmailGetter({ form }: ClientEmailGetterProps) {
  return (
    <FormField
      control={form.control}
      name={'email'}
      render={({ field }) => (
        <FormItem className={'flex flex-col gap-y-[0.875rem]'}>
          <FormLabel className={'font-normal text-textBlack80 text-sm'}>Email</FormLabel>
          <FormControl>
            <div className={'!m-0 relative'}>
              <CustomInput
                value={field.value ?? ''}
                onChange={(value) => {
                  form.setValue('email', value);
                }}
                className={
                  '!ring-transparent !outline-transparent h-auto border py-3 px-5 rounded-lg border-borderGray text-sm text-textBlack40'
                }
                type={'email'}
                placeholder={'Input email'}
              />
              <div className={'absolute right-0 top-0 flex items-center justify-center h-full mr-2'}>
                <Mail className={'text-textBlack size-4'} />
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
export default memo(ClientEmailGetter);
