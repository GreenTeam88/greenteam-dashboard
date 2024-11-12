'use client';

import CustomDatePicker from '@/components/custom/CustomDatePicker';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface DateGetterProps {
  form: any;
}

export default function ToDateGetter({ form }: DateGetterProps) {
  return (
    <FormField
      control={form.control}
      name={'projectDateEnd'}
      render={({ field }) => (
        <FormItem className={'flex flex-col gap-y-[0.875rem]'}>
          <FormLabel className={'font-normal text-textBlack80 text-sm'}>To</FormLabel>
          <FormControl>
            <CustomDatePicker
              btnClassName={
                '!m-0 text-sm text-textBlack justify-between h-auto py-3 px-5 border rounded-lg border-borderGray w-full'
              }
              popoverContentClassName={'bg-white'}
              placeholder={'DD/MM/YYYY'}
              date={field.value}
              setDate={(date) => {
                form.setValue('projectDateEnd', date, { shouldValidate: true });
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
