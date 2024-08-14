import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface CustomToolTipProps {
  text: string;
  limit?: number;
  triggerClassName?: string;
  textClassName?: string;
}

export function CustomToolTip({ text, limit = 10, triggerClassName, textClassName }: CustomToolTipProps) {
  if (!text) return null;
  if (limit >= text.length) return text;
  return (
    <TooltipProvider delayDuration={400}>
      <Tooltip>
        <TooltipTrigger className={cn(triggerClassName)}>
          {limit < text.length ? `${text.slice(0, limit)}...` : text}
        </TooltipTrigger>
        <TooltipContent side={'bottom'} className={'bg-white border border-borderBlack10'}>
          <p className={cn(textClassName)}>{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
