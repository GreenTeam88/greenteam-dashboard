'use client';

import { useEffect } from 'react';

import { cn } from '@/lib/utils';
import useModalStore from '@/store/ModalStore';

export default function CustomModal() {
  const { isOpen, closeModal, content } = useModalStore();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  if (!isOpen) return null;
  return <div className={cn('fixed inset-0 w-full h-full z-10 bg-black bg-opacity-50')}>{content}</div>;
}
