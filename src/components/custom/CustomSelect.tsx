import Image from 'next/image';
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
  className?: string;
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
  className,
}: CustomSelectProps) {
  return (
    <Select defaultValue={value} onValueChange={(val) => setValue && setValue(val)}>
      <SelectTrigger className={cn('w-[180px]', triggerClassName, className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={cn(contentClassName)}>
        <SelectGroup>
          {data.map((item) => {
            return (
              <SelectItem
                className={cn('bg-white hover:bg-gray-100', itemClassName, value === item.label && itemActiveClassName)}
                key={item.value}
                value={item.value}
              >
                <div className={'flex items-center gap-x-2'}>
                  {item.icon && <Image src={item.icon} alt={item.label} width={16} height={16} />}
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
