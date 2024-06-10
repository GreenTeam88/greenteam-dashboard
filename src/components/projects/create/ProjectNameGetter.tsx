'use client';

import CustomInput from '@/components/custom/CustomInput';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface ProjectNameGetterProps {
  form: any;
}

export default function ProjectNameGetter({ form }: ProjectNameGetterProps) {
  return (
    <FormField
      control={form.control}
      name={'projectName'}
      render={({ field }) => (
        <FormItem className={'flex flex-col gap-y-[0.875rem]'}>
          <FormLabel className={'font-normal text-textBlack80 text-sm'}>Project name</FormLabel>
          <FormControl>
            <CustomInput
              value={field.value ?? ''}
              onChange={(value) => {
                form.setValue('projectName', value);
              }}
              className={
                '!m-0 !ring-transparent !outline-transparent h-auto border py-3 px-5 rounded-lg border-borderGray text-sm text-textBlack40'
              }
              type={'text'}
              placeholder={'Input project name'}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
