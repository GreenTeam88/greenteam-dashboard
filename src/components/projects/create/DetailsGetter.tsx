'use client';

// import CustomCombobox from '@/components/custom/CustomCombobox';
import { CustomTextarea } from '@/components/custom/CustomTextarea';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface DetailsGetterProps {
  form: any;
}

export default function DetailsGetter({ form }: DetailsGetterProps) {
  return (
    <FormField
      control={form.control}
      name={'details'}
      render={({ field }) => (
        <FormItem className={'flex flex-col gap-y-[0.875rem]'}>
          <FormLabel className={'font-normal text-textBlack80 text-sm'}>General details</FormLabel>
          <FormControl>
            <CustomTextarea
              value={field.value}
              setValue={(value) => {
                form.setValue('details', value);
              }}
              className={'!m-0 !ring-transparent !outline-transparent h-[150px] border border-borderGray py-3 px-5'}
              placeholder={'Input general details'}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
