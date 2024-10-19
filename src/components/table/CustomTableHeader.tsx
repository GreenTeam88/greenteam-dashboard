import * as React from 'react';

import { cn } from '@/lib/utils';

// Extend T only to types that are valid as ReactNode and React.Key, excluding bigint
interface CustomTableHeaderProps<T extends React.Key> {
  activeFilter: T;
  setActiveFilter: (value: T) => void;
  filterTypes: T[];
}

export default function CustomTableHeader<T extends string | number>({
  activeFilter,
  setActiveFilter,
  filterTypes,
}: CustomTableHeaderProps<T>) {
  return (
    <div className={'border-b border-b-borderGray flex items-center'}>
      {filterTypes.map((fType) => (
        <button
          onClick={() => setActiveFilter(fType)}
          key={fType.toString()} // Ensure fType is converted to string for key
          className={cn('p-3', activeFilter === fType && 'border-b-2 border-green-700')}
        >
          <h5
            className={cn('text-sm text-textBlack40', activeFilter === fType && 'text-textGreenPrimary font-semibold')}
          >
            {fType}
          </h5>
        </button>
      ))}
    </div>
  );
}
