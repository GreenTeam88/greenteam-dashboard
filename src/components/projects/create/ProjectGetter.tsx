'use client';

import { memo } from 'react';

import FormInputDataGetter from '@/components/custom/FormInputDataGetter';

interface ProjectGettersProps {
  form: any;
}
function ProjectGetter({ form }: ProjectGettersProps) {
  return (
    <>
      <div className={'grid grid-cols-2 gap-x-4 pb-4'}>
        <FormInputDataGetter
          form={form}
          name={'projectNumber'}
          label={'Project number'}
          placeholder={'input Project Number'}
        />
        <FormInputDataGetter
          form={form}
          name={'Name'}
          label={'Project name'}
          placeholder={'Input Project name'}
          required
        />
      </div>
      <div className={'grid grid-cols-2 gap-x-4 pb-4'}>
        <FormInputDataGetter
          form={form}
          name={'projectAdress'}
          label={'Project Adress'}
          placeholder={'Input Adress'}
          required
        />
        <FormInputDataGetter form={form} name={'city'} label={'City name'} placeholder={'Input City name'} required />
      </div>

      <FormInputDataGetter
        form={form}
        name={'Telephone'}
        label={'Telephone'}
        placeholder={'Input PhoneNumber'}
        required
      />
    </>
  );
}

export default memo(ProjectGetter);
