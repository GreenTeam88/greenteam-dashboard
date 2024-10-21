'use client';

import { Briefcase, User } from 'lucide-react';
import { memo } from 'react';

// import { useWatch } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ClientTypeGetterProps {
  form: any;
  activeType: 'Private' | 'Business Client';
}

function ClientTypeGetter({ form, activeType }: ClientTypeGetterProps) {
  const clientTypes = [
    {
      text: 'Private',
      icon: User,
    },
    {
      text: 'Business Client',
      icon: Briefcase,
    },
  ];
  return (
    <div className={'flex flex-col gap-y-6'}>
      <h5 className={'font-normal text-textBlack80 text-sm'}>Client type</h5>
      <div className={'grid grid-cols-2 gap-x-4'}>
        {clientTypes.map((cType) => {
          return (
            <Button
              onClick={() => form.setValue('clientType', cType.text)}
              key={cType.text}
              type={'button'}
              className={cn(
                'py-3 text-textGreenPrimary px-5 flex items-center justify-center gap-x-4 rounded-lg border border-borderGreenDefault',
                activeType === cType.text && 'bg-bgWhite50'
              )}
            >
              <cType.icon className={'size-4'} />
              <span className={'text-sm'}>{cType.text}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
export default memo(ClientTypeGetter);
