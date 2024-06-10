'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import FilterSelect from '@/components/custom/FilterSelect';

export default function SortBy() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );
  function handleChange(value: string) {
    router.push(pathname + '?' + createQueryString('sort', value));
  }
  const items = [
    { label: 'Category', value: 'category' },
    { label: 'Client', value: 'client' },
    { label: 'City', value: 'city' },
  ];
  return (
    <div className={'flex gap-3 items-center'}>
      <span className={'text-textBlack text-sm'}>Sort by</span>
      <FilterSelect placeholder={'Choose'} items={items} handleChange={handleChange} />
    </div>
  );
}
