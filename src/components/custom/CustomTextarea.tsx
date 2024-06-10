import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface CustomTextareaProps {
  placeholder?: string;
  className?: string;
  value?: string;
  setValue?: (value: string) => void;
}

export function CustomTextarea({ placeholder = 'placeholder', className, value, setValue }: CustomTextareaProps) {
  return (
    <Textarea
      onChange={(e) => setValue && setValue(e.target.value)}
      value={value}
      className={cn(className)}
      placeholder={placeholder}
    />
  );
}
