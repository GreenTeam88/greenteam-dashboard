'use client';

import { memo } from 'react';

import CustomInput from '@/components/custom/CustomInput';
import { CustomSelect } from '@/components/custom/CustomSelect';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { countries } from '@/mockDatas/clientCreateDatas';

interface ClientCountryGetterProps {
  form: any;
}

function ClientCountryGetter({ form }: ClientCountryGetterProps) {
  return (
    <FormField
      control={form.control}
      name={'country'}
      render={({ field }) => (
        <FormItem className={'flex flex-col gap-y-[0.875rem]'}>
          <FormLabel className={'font-normal text-textBlack80 text-sm'}>Country</FormLabel>
          <FormControl>
            <CustomSelect
              itemActiveClassName={'bg-bgLightGreenHover font-semibold'}
              triggerClassName={
                '!m-0 h-auto w-full !ring-transparent !outline-transparent py-3 px-5 border border-borderGray rounded-lg text-sm text-textBlack'
              }
              contentClassName={'bg-white'}
              itemClassName={'text-sm text-textBlack hover:bg-bgLightGreenHover'}
              data={countries}
              setValue={(value) => {
                form.setValue('country', value);
              }}
              value={field.value ?? ''}
              placeholder={'Select country'}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
export default memo(ClientCountryGetter);
