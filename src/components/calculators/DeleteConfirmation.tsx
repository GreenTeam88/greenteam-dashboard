'use client';

import { Trash2 } from 'lucide-react';
import React, { useState } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface DeleteConfirmationProps {
  onConfirm: () => void;
  title: string;
  description: string;
  triggerButton?: React.ReactNode;
  variant?: 'ghost' | 'destructive' | 'outline';
  size?: 'sm' | 'default' | 'lg';
}

export function DeleteConfirmation({
  onConfirm,
  title,
  description,
  triggerButton,
  variant = 'ghost',
  size = 'sm',
}: DeleteConfirmationProps) {
  const [open, setOpen] = useState(false);

  const handleConfirm = () => {
    onConfirm();
    setOpen(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <div onClick={() => setOpen(true)}>
        {triggerButton || (
          <Button type="button" variant={variant} size={size}>
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        )}
      </div>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Trash2 className="h-6 w-6 text-red-600" />
          </div>
          <AlertDialogTitle className="text-gray-900">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-600">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-100 text-gray-700 hover:bg-gray-200">Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} className="bg-red-600 text-white hover:bg-red-700">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
