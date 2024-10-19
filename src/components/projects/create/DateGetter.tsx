'use client';

// import CustomCombobox from '@/components/custom/CustomCombobox';
import CustomDatePicker from '@/components/custom/CustomDatePicker';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface DateGetterProps {
  form: any;
}

export default function DateGetter({ form }: DateGetterProps) {
  return (
    <FormField
      control={form.control}
      name={'projectDate'}
      render={({ field }) => (
        <FormItem className={'flex flex-col gap-y-[0.875rem]'}>
          <FormLabel className={'font-normal text-textBlack80 text-sm'}>Date</FormLabel>
          <FormControl>
            <CustomDatePicker
              btnClassName={
                '!m-0 text-sm text-textBlack40 justify-between h-auto py-3 px-5 border rounded-lg border-borderGray w-full'
              }
              popoverContentClassName={'bg-white'}
              placeholder={'DD/MM/YYY'}
              date={field.value}
              setDate={(date) => {
                form.setValue('projectDate', date);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
