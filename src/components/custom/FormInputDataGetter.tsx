'use client';

import { memo } from 'react';

import CustomInput from '@/components/custom/CustomInput';
import CustomPasswordInput from '@/components/custom/CustomPasswordInput';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// import { PasswordInput } from '@/components/ui/password-input';

interface FormInputDataGetterProps {
  form: any;
  name: string;
  label: string;
  placeholder: string;
  isPassword?: boolean;
  type?: 'text' | 'email' | 'number' | 'password' | 'tel';
}

function FormInputDataGetter({
  form,
  name,
  label,
  placeholder,
  isPassword = false,
  type = 'text',
}: FormInputDataGetterProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={'flex flex-col gap-y-[0.875rem]'}>
          <FormLabel className={'font-normal text-textBlack80 text-sm'}>{label}</FormLabel>
          <FormControl>
            {isPassword ? (
              <CustomPasswordInput
                value={field.value ?? ''}
                onChange={(value) => {
                  form.setValue(name, value);
                }}
                className={
                  '!m-0 !ring-transparent !outline-transparent h-auto border py-3 px-5 rounded-lg border-borderGray text-sm text-textBlack40'
                }
                placeholder={placeholder}
              />
            ) : (
              <CustomInput
                value={field.value ?? ''}
                onChange={(value) => {
                  form.setValue(name, value);
                }}
                className={
                  '!m-0 !ring-transparent !outline-transparent h-auto border py-3 px-5 rounded-lg border-borderGray text-sm text-textBlack40'
                }
                type={type}
                placeholder={placeholder}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
export default memo(FormInputDataGetter);
