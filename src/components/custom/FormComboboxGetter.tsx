'use client';

import CustomCombobox from '@/components/custom/CustomCombobox';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface FormComboboxGetterProps {
  data: { value: string; label: string }[];
  form: any;
  name: string;
  label: string;
  placeholder: string;
  notFoundText: string;
}

export default function FormComboboxGetter({
  data,
  form,
  notFoundText,
  placeholder,
  name,
  label,
}: FormComboboxGetterProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={'flex flex-col gap-y-[0.875rem]'}>
          <FormLabel className={'font-normal text-textBlack80 text-sm'}>{label}</FormLabel>
          <FormControl>
            <CustomCombobox
              value={field.value}
              setValue={(value) => {
                form.setValue(name, value);
              }}
              placeholder={placeholder}
              notFoundText={notFoundText}
              data={data}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
