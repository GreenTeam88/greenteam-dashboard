'use client';

import Link from 'next/link';

import { Checkbox } from '@/components/ui/checkbox';

interface RememberForProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
}

export default function RememberFor({ value, onChange }: RememberForProps) {
  return (
    <div className={'flex items-center justify-between'}>
      <div className={'flex items-center gap-x-2'}>
        <Checkbox
          defaultChecked={value}
          onCheckedChange={(value) => onChange && onChange(value as boolean)}
          id={'remember'}
        />
        <label htmlFor={'remember'} className={'text-textBlack80 text-sm'}>
          Remember for 30 Days
        </label>
      </div>
      <Link href={'/auth/login'} className={'font-semibold text-sm text-textSecondaryOrange'}>
        Forgot password
      </Link>
    </div>
  );
}
