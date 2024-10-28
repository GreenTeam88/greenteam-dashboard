'use client';

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PasswordInput } from '@/components/ui/password-input';
import { Input } from '../ui/input';

interface FormInputDataGetterProps {
  form: any;
  name: string;
  label: string;
  placeholder: string;
  isPassword?: boolean;
  type?: 'text' | 'email' | 'number' | 'password' | 'tel';
  required?: boolean;
}

export default function FormInputDataGetter({
  form,
  name,
  label,
  placeholder,
  isPassword = false,
  required = false,
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
              <PasswordInput
                {...field}
                placeholder={placeholder}
                className={
                  '!m-0 !ring-transparent !outline-transparent h-auto border py-3 px-5 rounded-lg border-borderGray text-sm text-textBlack40'
                }
              />
            ) : (
              <Input
                {...field}
                placeholder={placeholder}
                required={required}
                className={
                  '!m-0 !ring-transparent !outline-transparent h-auto border py-3 px-5 rounded-lg border-borderGray text-sm text-textBlack40'
                }
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
