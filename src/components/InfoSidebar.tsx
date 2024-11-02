'use client';

import { ArrowLeft, X } from 'lucide-react';
import * as React from 'react';
import { createContext, memo, useContext, useState } from 'react';

import { Button } from '@/components/ui/button';
import { closeModal } from '@/store/ModalStore';

interface InfoSidebarProps {
  children: React.ReactNode;
  text: string;
  onDelete?: () => void;
}
interface InfoSidebarContextType {
  currentPage: 'home' | 'edit' | 'delete';
  setCurrentPage: React.Dispatch<React.SetStateAction<'home' | 'delete'>>;
  onDelete?: () => void;
  text: string;
}
const InfoSidebarContext = createContext<InfoSidebarContextType | undefined>(undefined);

function SidebarDeletePageButtons() {
  const { setCurrentPage, onDelete } = useContext(InfoSidebarContext)!;
  return (
    <div className={'grid grid-cols-2 gap-x-4 items-center justify-between'}>
      <Button
        onClick={onDelete}
        className={
          'py-2.5 px-5 text-sm border rounded-lg border-borderSecondaryOrange text-textSecondaryOrange ' +
          'hover:bg-orange-600 hover:text-white'
        }
      >
        Yes, delete it
      </Button>
      <Button
        onClick={() => setCurrentPage('home')}
        className={
          'py-2.5 px-5 text-sm border rounded-lg bg-green-700 text-white border-green-700 ' +
          'hover:bg-white hover:text-green-700 hover:border-green-700'
        }
      >
        Cancel
      </Button>
    </div>
  );
}

function SidebarDeletePage({ text }: { text: string }) {
  const { setCurrentPage } = useContext(InfoSidebarContext)!;
  return (
    <>
      <div className={'py-5 px-10 flex gap-x-4 items-center border-b border-b-borderBlack10'}>
        <ArrowLeft onClick={() => setCurrentPage('home')} className={'cursor-pointer'} />
        <h4 className={'text-xl leading-6'}>Warning!</h4>
      </div>
      <div className={'flex flex-col justify-between h-full py-6 px-10 gap-y-6 overflow-y-auto'}>
        <p className={'text-base text-textBlackNew'}>
          Are you sure you want to delete this {text}? This action cannot be undone.
        </p>
        <SidebarDeletePageButtons />
      </div>
    </>
  );
}

export default function InfoSidebar({ children, text, onDelete }: InfoSidebarProps) {
  const [currentPage, setCurrentPage] = useState<'home' | 'delete'>('home');

  return (
    <InfoSidebarContext.Provider value={{ currentPage, setCurrentPage, onDelete, text }}>
      <aside className={'absolute bg-white h-full w-[500px] right-0 flex flex-col'}>
        {currentPage === 'delete' && <SidebarDeletePage text={text} />}
        {currentPage === 'home' && children}
      </aside>
    </InfoSidebarContext.Provider>
  );
}

function SidebarButtons() {
  const { setCurrentPage } = useContext(InfoSidebarContext)!;
  return (
    <div className={'grid grid-cols-2 gap-x-4 items-center justify-between py-6'}>
      <Button
        onClick={() => setCurrentPage('delete')}
        className={
          'py-2.5 px-5 text-sm border rounded-lg border-borderSecondaryOrange text-textSecondaryOrange ' +
          'hover:bg-orange-600 hover:text-white'
        }
      >
        Delete Client
      </Button>
      <Button
        className={
          'py-2.5 px-5 text-sm border rounded-lg bg-green-700 text-white border-green-700 ' +
          'hover:bg-white hover:text-green-700 hover:border-green-700'
        }
      >
        Edit Client
      </Button>
    </div>
  );
}

function SidebarHeader({ title }: { title: string }) {
  return (
    <div className={'py-4 px-10 flex justify-between items-center border-b border-b-borderBlack10'}>
      <h4 className={'text-xl leading-6'}>{title}</h4>
      <X onClick={closeModal} className={'cursor-pointer'} />
    </div>
  );
}

InfoSidebar.SidebarHeader = memo(SidebarHeader);

function SidebarContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col  py-1 px-10 space-y-6 overflow-y-auto">
      {children}
      <SidebarButtons />
    </div>
  );
}
InfoSidebar.SidebarContent = memo(SidebarContent);

function SidebarContentItemDivider({ children }: { children: React.ReactNode }) {
  return <div className={'flex justify-between items-center py-3 border-b border-b-borderBlack10'}>{children}</div>;
}
InfoSidebar.SidebarContentItemDivider = memo(SidebarContentItemDivider);
