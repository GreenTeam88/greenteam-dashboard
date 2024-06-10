'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

import { ReactComponent as BellIcon } from '@/assets/icons/BellIcon.svg';
import { ReactComponent as ChevronDownIcon } from '@/assets/icons/ChevronDownIcon.svg';
import { ReactComponent as SearchIcon } from '@/assets/icons/SearchIcon.svg';
import userAvatar from '@/assets/userAvatar.png';

export default function Navbar() {
  const pathname = usePathname();
  function getHeaderTitle() {
    switch (pathname) {
      case '/projects':
        return 'Projects';
      case '/quotations':
        return 'Quotations';
      case '/clients':
        return 'Clients';
      default:
        return 'Dashboard';
    }
  }
  return (
    <header className={'py-3 flex items-center justify-between px-10 border-b border-b-borderBlack10'}>
      <div className={'900:hidden'}>
        <h2 className={'text-textDarkBlack text-[1.25rem] leading-[1.5rem]'}>{getHeaderTitle()}</h2>
      </div>
      <div className={'w-[400px] 1200:w-[250px]'}>
        <div className={'flex gap-[0.625rem] rounded-lg  py-2 px-4 bg-bgBlack5'}>
          <SearchIcon className={'top-2 left-2'} />
          <input placeholder={'Search anything here'} className={'bg-transparent outline-none text-sm'} />
        </div>
      </div>
      <div>
        <div className={'flex gap-6 items-center'}>
          <BellIcon />
          <div className={'flex gap-4'}>
            <Image src={userAvatar} alt={'user avatar'} />
            <div className={'flex flex-col'}>
              <h5 className={'text-sm text-textBlack80'}>John Doe</h5>
              <h6 className={'text-[0.75rem] leading-[1.125rem] text-textBlack40'}>Admin</h6>
            </div>
            <div className={'flex justify-center items-center'}>
              <ChevronDownIcon />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
