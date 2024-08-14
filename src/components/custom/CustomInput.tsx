import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface CustomInputProps {
  type: string;
  placeholder: string;
  className?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
}

export default function CustomInput({ type, placeholder, className, value, onChange }: CustomInputProps) {
  return (
    <Input
      value={value}
      onChange={(d) => onChange && onChange(d.target.value)}
      type={type}
      placeholder={placeholder}
      className={cn(className)}
    />
  );
}
