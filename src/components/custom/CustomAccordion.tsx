// import { Trash2 } from 'lucide-react';
import React from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { cn } from '@/lib/utils';

interface CustomAccordionProps {
  triggerText: string;
  contentText: string;
  triggerClassName?: string;
  contentClassName?: string;
  itemClassName?: string;
  onChange?: (val: boolean) => void;
  value: string;
  customIcons?: React.ReactNode;
}

export default function CustomAccordion({
  triggerText,
  contentText,
  triggerClassName,
  contentClassName,
  itemClassName,
  onChange,
  value,
  customIcons = null,
}: CustomAccordionProps) {
  return (
    <Accordion onValueChange={(value) => onChange && onChange(!!value)} type="single" collapsible className="w-full">
      <AccordionItem className={cn(itemClassName)} value={value}>
        <AccordionTrigger customIcons={customIcons} className={cn(triggerClassName)}>
          {triggerText}
        </AccordionTrigger>
        <AccordionContent className={cn(contentClassName)}>{contentText}</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
