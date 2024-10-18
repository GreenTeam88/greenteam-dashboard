'use client';

import CustomCombobox from '@/components/custom/CustomCombobox';
import CustomMultipleSelector from '@/components/custom/CustomMultipleSelector';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface ClientInfoGetterProps {
  clientsData: { value: string; label: string }[];
  form: any;
}

export default function ClientInfoGetter({ clientsData, form }: ClientInfoGetterProps) {
  return (
    <FormField
      control={form.control}
      name={'client'}
      render={({ field }) => (
        <FormItem className={'flex flex-col gap-y-[0.875rem]'}>
          <FormLabel className={'font-normal text-textBlack80 text-sm'}>Client</FormLabel>
          <FormControl>
            <CustomCombobox
              value={field.value}
              setValue={(value) => {
                form.setValue('client', value);
                // console.log(form.getValues())
              }}
              placeholder={'Assign client'}
              notFoundText={'Client not found.'}
              data={clientsData}
              popoverBtnClassName={
                '!m-0 w-full text-sm text-textBlack font-[400] border-borderGray rounded-lg py-3 px-5 h-auto'
              }
              popoverContentClassName={'w-[600px]'}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
