import { Button } from '@/components/ui/button';

interface CreateButtonProps {
  path?: string;
  asChild?: boolean;
  children?: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  onClick?: any;
}

export default function CreateButton({ asChild, children, type = 'button', onClick }: CreateButtonProps) {
  return (
    <Button
      onClick={onClick}
      type={type}
      asChild={asChild}
      className={'bg-bgSecondaryOrange text-white text-sm rounded-lg py-2.5 px-5'}
    >
      {children}
    </Button>
  );
}
