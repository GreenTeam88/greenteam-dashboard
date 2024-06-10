'use client';

import MultiSelectFormField from '@/components/ui/multi-select';
import { cn } from '@/lib/utils';
import { Option } from '@/types';

interface HousePartsGetterProps {
  data: Option[];
  placeholder?: string;
  value: string[];
  setValue: (value: string[]) => void;
  btnClassName?: string;
  menuClassName?: string;
  menuListItemsClassName?: string;
  placeholderClassName?: string;
}

export default function ShadcnCustomMultiSelect({
  data,
  placeholder = 'choose',
  value,
  setValue,
  btnClassName,
  menuClassName,
  menuListItemsClassName,
  placeholderClassName,
}: HousePartsGetterProps) {
  return (
    <MultiSelectFormField
      variant={'inverted'}
      animation={0}
      btnClassName={cn(btnClassName)}
      menuClassName={cn(menuClassName)}
      menuListItemsClassName={cn(menuListItemsClassName)}
      placeholderClassName={cn(placeholderClassName)}
      value={value}
      onValueChange={(value) => setValue(value)}
      options={data}
      placeholder={placeholder}
    />
  );
}
