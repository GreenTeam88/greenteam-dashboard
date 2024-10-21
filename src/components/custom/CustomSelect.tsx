import * as React from 'react';

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  // SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Option } from '@/types';

type CountryOption = Option & { icon?: string };

interface CustomSelectProps {
  data: CountryOption[];
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  itemActiveClassName?: string;
  placeholder?: string;
  value?: string;
  setValue?: (value: string) => void;
}

export function CustomSelect({
  data,
  contentClassName,
  triggerClassName,
  itemClassName,
  itemActiveClassName,
  placeholder,
  value,
  setValue,
}: CustomSelectProps) {
  return (
    <Select defaultValue={value} onValueChange={(val) => setValue && setValue(val)}>
      <SelectTrigger className={cn('w-[180px]', triggerClassName)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={cn(contentClassName)}>
        <SelectGroup>
          {data.map((item) => {
            return (
              <SelectItem
                className={cn(itemClassName, value === item.label && itemActiveClassName)}
                key={item.value}
                value={item.value}
              >
                <div className={'flex items-center gap-x-2'}>
                  {item.icon && <img src={item.icon} alt={item.label} className={'size-4'} />}
                  {item.label}
                </div>
              </SelectItem>
            );
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
