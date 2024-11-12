'use client';

import { memo } from 'react';

import ClientLanguageGetter from '@/components/clients/create/ClientLanguageGetter';
import FormInputDataGetter from '@/components/custom/FormInputDataGetter';
import { languageOptions } from '@/mockDatas/clientCreateDatas';

interface PrivateTypeClientGettersProps {
  form: any;
}
function PrivateTypeClientGetters({ form }: PrivateTypeClientGettersProps) {
  return (
    <>
      <div className={'grid grid-cols-2 gap-x-4'}>
        <FormInputDataGetter
          form={form}
          name={'clientNumber'}
          label={'Client number'}
          placeholder={'input client Number'}
        />
      </div>
      <div className={'grid grid-cols-2 gap-x-4'}>
        <FormInputDataGetter
          form={form}
          name={'firstName'}
          label={'First name'}
          placeholder={'Input first name'}
          required
        />
        <FormInputDataGetter
          form={form}
          name={'lastName'}
          label={'Last name'}
          placeholder={'Input last name'}
          required
        />
      </div>
      <div className={'grid grid-cols-2 gap-x-4'}>
        <FormInputDataGetter form={form} name={'address'} label={'Address'} placeholder={'Input address'} required />
        <FormInputDataGetter
          form={form}
          name={'houseNumber'}
          label={'House number'}
          placeholder={'Input house number'}
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-x-4">
        <FormInputDataGetter
          form={form}
          name={'extraAddressInfo'}
          label={'Extra address information'}
          placeholder={'Input extra information'}
          required
        />
        <ClientLanguageGetter form={form} languages={languageOptions} />
      </div>
    </>
  );
}

export default memo(PrivateTypeClientGetters);
