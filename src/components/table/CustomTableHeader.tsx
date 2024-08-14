import * as React from 'react';

import { cn } from '@/lib/utils';

interface CustomTableHeaderProps<T> {
  activeFilter: T;
  setActiveFilter: (value: T) => void;
  filterTypes: T[];
}

export default function CustomTableHeader<T>({
  activeFilter,
  setActiveFilter,
  filterTypes,
}: CustomTableHeaderProps<T>) {
  return (
    <div className={'border-b border-b-borderGray flex items-center'}>
      {filterTypes.map((fType) => {
        return (
          <button
            onClick={() => setActiveFilter(fType)}
            key={fType}
            className={cn('p-3', activeFilter === fType && 'border-b-2 border-green-700')}
          >
            <h5
              className={cn(
                'text-sm text-textBlack40',
                activeFilter === fType && 'text-textGreenPrimary font-semibold'
              )}
            >
              {fType}
            </h5>
          </button>
        );
      })}
    </div>
  );
}
