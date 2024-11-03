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
      <div className="grid grid-cols-2 gap-x-4">
        <FormInputDataGetter
          form={form}
          name={'clientNumber'}
          label={'Client number'}
          placeholder={'input client Number'}
          required
        />
        <FormInputDataGetter
          form={form}
          name={'companyName'}
          label={'Company name'}
          placeholder={'Input company name'}
          required
        />
      </div>

      <div className={'grid grid-cols-2 gap-x-4'}>
        <FormInputDataGetter
          form={form}
          name={'cocNumber'}
          label={'Chamber of commerce number'}
          placeholder={'Input coc number'}
          required
        />
        <FormInputDataGetter
          form={form}
          name={'vatTaxNumber'}
          label={'VAT tax number'}
          placeholder={'Input VAT tax number'}
          required
        />
      </div>
      <div className={'grid grid-cols-2 gap-x-4'}>
        <FormInputDataGetter
          form={form}
          name={'businessAddress'}
          label={'Business address'}
          placeholder={'Input business address'}
          required
        />
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
          name={'extraBusinessAddressInfo'}
          label={'Extra business address information'}
          placeholder={'Input extra business information'}
          required
        />
        <ClientLanguageGetter form={form} languages={languageOptions} />
      </div>
    </>
  );
}

export default memo(PrivateTypeClientGetters);
