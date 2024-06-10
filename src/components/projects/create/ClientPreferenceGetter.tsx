'use client';

import CustomInput from '@/components/custom/CustomInput';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface ClientPreferenceGetterProps {
  form: any;
}
export default function ClientPreferenceGetter({ form }: ClientPreferenceGetterProps) {
  return (
    <FormField
      control={form.control}
      name={'clientPreferences'}
      render={({ field }) => (
        <FormItem className={'flex flex-col gap-y-[0.875rem]'}>
          <FormLabel className={'font-normal text-textBlack80 text-sm'}>Client preferences</FormLabel>
          <FormControl>
            <CustomInput
              value={field.value ?? ''}
              onChange={(value) => {
                form.setValue('clientPreferences', value);
              }}
              className={
                '!m-0 !ring-transparent !outline-transparent h-auto border py-3 px-5 rounded-lg border-borderGray text-sm text-textBlack40'
              }
              type={'text'}
              placeholder={'Input client preferences'}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
