import * as React from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface CitySelectProps {
  cities: string[];
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  itemActiveClassName?: string;
  placeholder?: string;
  value?: string;
  setValue?: (value: string) => void;
  className?: string;
}

export function CitySelect({
  cities,
  contentClassName,
  triggerClassName,
  itemClassName,
  itemActiveClassName,
  placeholder,
  value,
  setValue,
  className,
}: CitySelectProps) {
  return (
    <Select defaultValue={value} onValueChange={(val) => setValue && setValue(val)}>
      <SelectTrigger className={cn('w-[180px]', triggerClassName, className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={cn(contentClassName)}>
        {cities.map((city) => (
          <SelectItem
            className={cn('bg-white hover:bg-gray-100', itemClassName, value === city && itemActiveClassName)}
            key={city}
            value={city}
          >
            {city}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default CitySelect;
