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

interface FilterSelectProps {
  placeholder: string;
  items: { label: string; value: string }[];
  handleChange: (value: string) => void;
}

export default function FilterSelect({ placeholder, items, handleChange }: FilterSelectProps) {
  return (
    <Select onValueChange={(value) => handleChange(value)}>
      <SelectTrigger className="w-[120px]  py-0.5 px-4 flex gap-x-2 bg-white border border-borderBlack10 rounded-full outline-none ring-0 focus:ring-0 focus:outline-none -outline-offset-0 focus:outline-offset-0 focus:ring-offset-0">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className={'bg-white'}>
        <SelectGroup>
          {items.map((item) => {
            return (
              <SelectItem
                className={'hover:bg-bgLightGreenHover hover:text-textGreenPrimary hover:font-[500] duration-200'}
                value={item.value}
                key={item.value}
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
