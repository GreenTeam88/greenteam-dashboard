'use client';

import { Check, ChevronDown, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import { HTMLProps } from 'react';

import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface CustomComboboxProps {
  value: string;
  setValue: (value: string) => void;
  placeholder: string;
  data: { value: string; label: string }[];
  notFoundText?: string;
  popoverBtnClassName?: string;
  popoverContentClassName?: string;
}
export default function CustomCombobox({
  value,
  setValue,
  placeholder,
  data,
  notFoundText = 'Not found.',
  popoverBtnClassName = '!m-0 w-full text-sm text-textBlack font-[400] border-borderGray rounded-lg py-3 px-5 h-auto',
  popoverContentClassName = 'w-[600px]',
}: CustomComboboxProps) {
  const [open, setOpen] = React.useState(false);
  // const [value, setValue] = React.useState('');
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size={'sm'}
          role="combobox"
          aria-expanded={open}
          aria-label={placeholder}
          className={cn('w-[200px] justify-between dark:text-white', popoverBtnClassName)}
        >
          {value ? data.find((d) => d.value === value)?.label : placeholder}
          {/*<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 hidden lg:block" />*/}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('popover-content-width-full p-0 bg-white', popoverContentClassName)}>
        <Command>
          <CommandInput placeholder={placeholder} />
          <CommandList>
            <CommandEmpty>{notFoundText}</CommandEmpty>
            <CommandGroup>
              {data &&
                data.map((d) => (
                  <CommandItem
                    className={cn(
                      value === d.value && 'bg-bgLightGreen text-textGreenPrimary font-medium',
                      'hover:bg-bgBlack5'
                    )}
                    key={d.value}
                    value={d.value}
                    onSelect={() => {
                      setValue(d.value);
                      setOpen(false);
                    }}
                  >
                    <Check className={cn('mr-2 h-4 w-4', value === d.value ? 'opacity-100' : 'opacity-0')} />
                    {d.label}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
