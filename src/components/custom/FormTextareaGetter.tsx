'use client';

import { CustomTextarea } from '@/components/custom/CustomTextarea';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface FormTextareaGetterProps {
  form: any;
  name: string;
  label: string;
  placeholder: string;
}

export default function FormTextareaGetter({ form, name, placeholder, label }: FormTextareaGetterProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={'flex flex-col gap-y-[0.875rem]'}>
          <FormLabel className={'font-normal text-textBlack80 text-sm'}>{label}</FormLabel>
          <FormControl>
            <CustomTextarea
              value={field.value}
              setValue={(value) => {
                form.setValue(name, value);
              }}
              placeholder={placeholder}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
