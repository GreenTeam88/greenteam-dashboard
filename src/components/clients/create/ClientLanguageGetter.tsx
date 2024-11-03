'use client';

import { memo } from 'react';

import { CustomSelect } from '@/components/custom/CustomSelect';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface ClientLanguageGetterProps {
  form: any;
  languages: { label: string; value: string; icon?: string }[]; // Language options with optional icon
}

function ClientLanguageGetter({ form, languages }: ClientLanguageGetterProps) {
  return (
    <FormField
      control={form.control}
      name="preferredLanguage"
      render={({ field }) => (
        <FormItem className="flex flex-col gap-y-[0.875rem]">
          <FormLabel className="font-normal text-textBlack80 text-sm">Preferred Language</FormLabel>
          <FormControl>
            <CustomSelect
              itemActiveClassName="bg-bgLightGreenHover font-semibold"
              triggerClassName="!m-0 h-auto w-full !ring-transparent !outline-transparent py-3 px-5 border border-borderGray rounded-lg text-sm text-textBlack"
              contentClassName="bg-white"
              itemClassName="text-sm text-textBlack hover:bg-bgLightGreenHover"
              data={languages}
              setValue={(value) => {
                form.setValue('preferredLanguage', value);
              }}
              value={field.value ?? ''}
              placeholder="Select language"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

export default memo(ClientLanguageGetter);
