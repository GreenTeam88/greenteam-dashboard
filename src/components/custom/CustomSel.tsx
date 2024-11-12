import * as React from 'react';

import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Option } from '@/types';

interface CustomSelectProps {
  data: Option[];
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  itemActiveClassName?: string;
  placeholder?: string;
  value?: string;
  setValue?: (value: string) => void;
  className?: string;
}

export function CustomSel({
  data,
  contentClassName,
  triggerClassName,
  itemClassName,
  itemActiveClassName,
  placeholder,
  value,
  setValue,
  className,
}: CustomSelectProps) {
  return (
    <Select defaultValue={value} onValueChange={(val) => setValue && setValue(val)}>
      <SelectTrigger className={cn('w-full', triggerClassName, className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={cn(contentClassName)}>
        <SelectGroup>
          {data.map((item) => {
            return (
              <SelectItem
                className={cn('bg-white hover:bg-gray-100', itemClassName, value === item.value && itemActiveClassName)}
                key={item.value}
                value={item.value}
              >
                {item.label}
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
