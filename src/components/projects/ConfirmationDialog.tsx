import React from 'react';

import { Button } from '@/components/ui/button';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectNumber: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ isOpen, onClose, onConfirm, projectNumber }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-4 shadow-lg">
        <h4 className="text-lg font-bold mb-4">Are you sure?</h4>
        <p>Are you sure you want to change the status of {projectNumber} to “DECLINED”?</p>
        <div className="flex justify-center gap-4">
          <Button
            onClick={onClose}
            className="py-2.5 px-5 text-sm border rounded-lg bg-green-700 text-white border-green-700 hover:bg-white hover:text-green-700 hover:border-green-700"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="py-2.5 px-5 text-sm border rounded-lg border-borderSecondaryOrange text-textSecondaryOrange hover:bg-orange-600 hover:text-white"
          >
            Yes, I'm sure
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
