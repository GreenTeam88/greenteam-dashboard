import { cn } from '@/lib/utils';

interface AccountSectionSelectorProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export default function AccountSectionSelector({ activeSection, setActiveSection }: AccountSectionSelectorProps) {
  const sections = ['Profile', 'Password'];
  return (
    <div className={'flex border-b border-b-black/20 h-12'}>
      {sections.map((section) => {
        return (
          <button
            onClick={() => setActiveSection(section)}
            type={'button'}
            className={cn(
              'h-full w-[120px] flex items-center justify-center text-sm text-textBlack40 text-center font-semibold',
              activeSection === section && 'border-b-2 border-borderGreenDefault text-textGreenPrimary'
            )}
            key={section}
          >
            {section}
          </button>
        );
      })}
    </div>
  );
}
