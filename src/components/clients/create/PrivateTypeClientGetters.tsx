'use client';

import { memo } from 'react';

import FormInputDataGetter from '@/components/custom/FormInputDataGetter';

interface PrivateTypeClientGettersProps {
  form: any;
}
function PrivateTypeClientGetters({ form }: PrivateTypeClientGettersProps) {
  return (
    <>
      <div className={'grid grid-cols-2 gap-x-4'}>
        <FormInputDataGetter form={form} name={'firstName'} label={'First name'} placeholder={'Input first name'} />
        <FormInputDataGetter form={form} name={'lastName'} label={'Last name'} placeholder={'Input last name'} />
      </div>
      <div className={'grid grid-cols-2 gap-x-4'}>
        <FormInputDataGetter form={form} name={'address'} label={'Address'} placeholder={'Input address'} />
        <FormInputDataGetter
          form={form}
          name={'houseNumber'}
          label={'House number'}
          placeholder={'Input house number'}
        />
      </div>
      <FormInputDataGetter
        form={form}
        name={'extraAddressInfo'}
        label={'Extra address information'}
        placeholder={'Input extra information'}
      />
    </>
  );
}

export default memo(PrivateTypeClientGetters);
