import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CreateButtonProps {
  path?: string;
  asChild?: boolean;
  children?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: any;
  disabled?: boolean;
  className?: string;
}

export default function CreateButton({
  asChild,
  children,
  type = 'button',
  onClick,
  disabled = false,
  className,
}: CreateButtonProps) {
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      type={type}
      asChild={asChild}
      className={cn('bg-bgSecondaryOrange text-white text-sm rounded-lg py-2.5 px-5', className)}
    >
      {children}
    </Button>
  );
}
