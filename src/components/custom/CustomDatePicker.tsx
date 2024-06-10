'use client';

import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface CustomDatePickerProps {
  placeholder?: string;
  date?: Date | undefined;
  setDate?: (date: Date | undefined) => void;
  btnClassName?: string;
  popoverContentClassName?: string;
}

export default function CustomDatePicker({
  placeholder = 'Select date',
  date,
  setDate,
  btnClassName,
  popoverContentClassName,
}: CustomDatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-[280px] justify-start text-left font-normal',
            !date && 'text-muted-foreground',
            btnClassName
          )}
        >
          {date ? format(date, 'PPP') : <span>{placeholder}</span>}
          <CalendarIcon className="mr-2 h-4 w-4 text-textBlack80" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('w-auto p-0', popoverContentClassName)}>
        <Calendar mode="single" selected={date} onSelect={(date) => setDate && setDate(date)} initialFocus />
      </PopoverContent>
    </Popover>
  );
}
