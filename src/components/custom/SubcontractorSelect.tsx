import * as React from 'react';

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Subcontractor } from '@/types';

interface SubcontractorSelectProps {
  data: Subcontractor[];
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  itemActiveClassName?: string;
  placeholder?: string;
  value?: string;
  setValue?: (value: string) => void;
  className?: string;
}

export function SubcontractorSelect({
  data,
  contentClassName,
  triggerClassName,
  itemClassName,
  itemActiveClassName,
  placeholder,
  value,
  setValue,
  className,
}: SubcontractorSelectProps) {
  return (
    <Select defaultValue={value} onValueChange={(val) => setValue && setValue(val)}>
      <SelectTrigger className={cn('w-[180px]', triggerClassName, className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={cn(contentClassName)}>
        <SelectGroup>
          {data.map((item) => (
            <SelectItem
              className={cn(
                'bg-white hover:bg-gray-100',
                itemClassName,
                value === item.companyName && itemActiveClassName
              )}
              key={item.id}
              value={item.companyName}
            >
              {item.companyName}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
