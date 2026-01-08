'use client';

// import Image from 'next/image';
import { Calculator } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ReactComponent as DocumentIcon } from '@/assets/icons/DocumentIcon.svg';
import { ReactComponent as EuroIcon } from '@/assets/icons/EuroIcon.svg';
import { ReactComponent as FolderIcon } from '@/assets/icons/FolderIcon.svg';
import { ReactComponent as LayersIcon } from '@/assets/icons/LayersIcon.svg';
import { ReactComponent as Logo } from '@/assets/icons/Logo.svg';
import { ReactComponent as PersonIcon } from '@/assets/icons/PersonIcon.svg';
import { ReactComponent as PlanIcon } from '@/assets/icons/PlanIcon.svg';
import { ReactComponent as QuestionIcon } from '@/assets/icons/QuestionIcon.svg';
import { ReactComponent as SubcontractorIcon } from '@/assets/icons/SubcontractorIcon.svg';

// Wrapper component to make Lucide icons compatible with the sidebar pattern
const CalculatorIcon = () => <Calculator className="h-5 w-5 text-current" />;

export default function Sidebar() {
  const pathname = usePathname();
  const links = [
    { text: 'Projects', href: '/dashboard/projects', icon: FolderIcon, active: pathname.includes('/projects') },
    { text: 'Clients', href: '/dashboard/clients', icon: PersonIcon, active: pathname.includes('/clients') },
    { text: 'Quotations', href: '/dashboard/quotations', icon: LayersIcon, active: pathname.includes('/quotations') },
    { text: 'Invoicing', href: '/dashboard/invoicing', icon: DocumentIcon, active: pathname.includes('/invoicing') },
    { text: 'Pricelist', href: '/dashboard/pricelist', icon: EuroIcon, active: pathname.includes('/pricelist') },
    {
      text: 'Calculators',
      href: '/dashboard/calculators',
      icon: CalculatorIcon,
      active: pathname.includes('/calculators'),
    },
    {
      text: 'Subcontractors',
      href: '/dashboard/subcontractors',
      icon: SubcontractorIcon,
      active: pathname.includes('/subcontractors'),
    },
    { text: 'Planning', href: '/dashboard/planning', icon: PlanIcon, active: pathname.includes('/planning') },
    { text: 'FAQ', href: '/dashboard/faqs', icon: QuestionIcon, active: pathname.includes('/faqs') },
  ];
  return (
    <aside className={'bg-white flex flex-col h-full w-[200px] border-r border-r-borderBlack10'}>
      <header className={'p-4 border-b border-b-borderBlack10'}>
        <Logo />
      </header>
      <div className={'flex-1 p-4'}>
        <nav>
          <ul className={'flex flex-col gap-1'}>
            {links.map((link) => {
              return (
                <li
                  className={`p-3 ${link.active && 'bg-bgLightGreenHover'} group rounded-lg hover:bg-bgLightGreenHover duration-200`}
                  key={link.text}
                >
                  <Link className={'flex gap-3 items-center'} href={link.href}>
                    <link.icon />
                    <h5
                      className={`${link.active ? 'text-textGreenPrimary' : 'text-textBlack'} text-sm group-hover:text-textGreenPrimary`}
                    >
                      {link.text}
                    </h5>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </aside>
  );
}
