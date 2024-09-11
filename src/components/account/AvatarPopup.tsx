'use client';

import { ChevronDownIcon, LogOut, User } from 'lucide-react';
import Image from 'next/image';
import { redirect, useRouter } from 'next/navigation';
import { useEffect } from 'react';

import userAvatar from '@/assets/userAvatar.png';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/queryHooks/auth';

export default function AvatarPopup() {
  const { logout } = useAuth();
  const { mutate, data, isSuccess } = logout;
  const router = useRouter();

  useEffect(() => {
    if (isSuccess && data) {
      router.replace('/auth/login');
    }
  }, [isSuccess, data, router]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={'!border-transparent !outline-transparent'}>
        <div className={'size-full flex gap-4'}>
          <Image src={userAvatar} alt={'user avatar'} />
          <div className={'flex flex-col'}>
            <h5 className={'text-sm text-textBlack80'}>John Doe</h5>
            <h6 className={'text-[0.75rem] leading-[1.125rem] text-textBlack40'}>Admin</h6>
          </div>
          <div className={'flex justify-center items-center'}>
            <ChevronDownIcon />
          </div>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={'bg-white'}>
        <DropdownMenuItem
          onClick={() => router.push('/dashboard/account')}
          className={'cursor-pointer group hover:bg-bgLightGreenHover'}
        >
          <div className={'flex items-center gap-x-1'}>
            <User size={16} className={'group-hover:text-textGreenPrimary'} />
            <h4 className={'text-textBlackNew text-sm group-hover:text-textGreenPrimary'}>Account</h4>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => mutate()} className={'cursor-pointer group hover:bg-bgLightGreenHover'}>
          <div className={'flex items-center gap-x-1'}>
            <LogOut size={16} className={'group-hover:text-textGreenPrimary'} />
            <h4 className={'text-textBlackNew text-sm group-hover:text-textGreenPrimary'}>Log out</h4>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
