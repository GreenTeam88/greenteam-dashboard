import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface CustomInputProps {
  name?: string;
  type: string;
  placeholder: string;
  className?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  required?: boolean;
}

export default function CustomInput({
  type,
  placeholder,
  className,
  value,
  onChange,
  name,
  required,
}: CustomInputProps) {
  return (
    <Input
      name={name}
      value={value}
      onChange={(event) => onChange && onChange(event.target.value)}
      type={type}
      placeholder={placeholder}
      className={cn(className)}
      required={required}
    />
  );
}
