'use client';

import { memo } from 'react';

import CustomDatePicker from '@/components/custom/CustomDatePicker';
// import CustomInput from '@/components/custom/CustomInput';
// import CustomPasswordInput from '@/components/custom/CustomPasswordInput';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
// import { PasswordInput } from '@/components/ui/password-input';
import { cn } from '@/lib/utils';

interface FormDateGetterProps {
  form: any;
  name: string;
  label: string;
  placeholder: string;
  btnClassName?: string;
}

function FormDateGetter({ form, name, label, placeholder, btnClassName }: FormDateGetterProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={'flex flex-col gap-y-[0.875rem]'}>
          <FormLabel className={'font-normal text-textBlack80 text-sm'}>{label}</FormLabel>
          <FormControl>
            <CustomDatePicker
              btnClassName={cn(
                '!m-0 text-sm text-textBlack40 justify-between h-auto py-3 px-5 border rounded-lg border-borderGray w-full',
                btnClassName
              )}
              popoverContentClassName={'bg-white'}
              placeholder={placeholder}
              date={field.value}
              setDate={(date) => {
                form.setValue(name, date);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
export default memo(FormDateGetter);
