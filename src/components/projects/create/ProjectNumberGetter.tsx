'use client';

import { memo } from 'react';

import FormInputDataGetter from '@/components/custom/FormInputDataGetter';

interface ProjectNumberGettersProps {
  form: any;
}
function ProjectNumberGetter({ form }: ProjectNumberGettersProps) {
  return (
    <>
      <div className={'grid  gap-x-4 '}>
        <FormInputDataGetter
          form={form}
          name={'projectNumber'}
          label={'Project number'}
          placeholder={'input Project Number'}
        />
      </div>
    </>
  );
}

export default memo(ProjectNumberGetter);
