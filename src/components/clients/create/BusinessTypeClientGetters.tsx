'use client';

import { memo } from 'react';

import FormInputDataGetter from '@/components/custom/FormInputDataGetter';

interface PrivateTypeClientGettersProps {
  form: any;
}

function PrivateTypeClientGetters({ form }: PrivateTypeClientGettersProps) {
  return (
    <>
      <FormInputDataGetter form={form} name={'companyName'} label={'Company name'} placeholder={'Input company name'} />
      <div className={'grid grid-cols-2 gap-x-4'}>
        <FormInputDataGetter
          form={form}
          name={'cocNumber'}
          label={'Chamber of commerce number'}
          placeholder={'Input coc number'}
        />
        <FormInputDataGetter
          form={form}
          name={'vatTaxNumber'}
          label={'VAT tax number'}
          placeholder={'Input VAT tax number'}
        />
      </div>
      <div className={'grid grid-cols-2 gap-x-4'}>
        <FormInputDataGetter
          form={form}
          name={'businessAddress'}
          label={'Business address'}
          placeholder={'Input business address'}
        />
        <FormInputDataGetter
          form={form}
          name={'houseNumber'}
          label={'House number'}
          placeholder={'Input house number'}
        />
      </div>
      <FormInputDataGetter
        form={form}
        name={'extraBusinessAddressInfo'}
        label={'Extra business address information'}
        placeholder={'Input extra business information'}
      />
    </>
  );
}

export default memo(PrivateTypeClientGetters);
