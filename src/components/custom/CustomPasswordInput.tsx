import { PasswordInput } from '@/components/ui/password-input';
import { cn } from '@/lib/utils';

interface CustomPasswordInputProps {
  placeholder: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export default function CustomPasswordInput({ placeholder, className, value, onChange }: CustomPasswordInputProps) {
  return (
    <PasswordInput
      value={value}
      onChange={(d) => onChange && onChange(d.target.value)}
      placeholder={placeholder}
      className={cn(className)}
    />
  );
}
