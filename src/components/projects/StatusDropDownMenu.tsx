import { Row } from '@tanstack/react-table';
import React, { useEffect, useState } from 'react';

import ConfirmationDialog from '@/components/projects/ConfirmationDialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Project } from '@/types';

// Function to determine the CSS classes based on status
function statusColor(status: Project['Status']): string {
  switch (status) {
    case 'Finished':
      return 'text-statusSuccess border-statusSuccess rounded-3xl';
    case 'Approved':
      return 'text-statusInfo border-statusInfo rounded-3xl';
    case 'Pending':
      return 'text-statusDanger border-statusDanger rounded-3xl';
    case 'On Hold':
      return 'text-statusOrange border-statusOrange rounded-3xl';
    case 'Declined':
      return 'text-statusRed border-statusRed rounded-3xl';
    default:
      return '';
  }
}

interface StatusDropdownMenuProps {
  row: Row<Project>;
  status: string; // Input as string for compatibility
}

const validStatuses: Project['Status'][] = ['Finished', 'Approved', 'Pending', 'On Hold', 'Declined'];

const StatusDropdownMenu: React.FC<StatusDropdownMenuProps> = ({ row, status }) => {
  const [currentStatus, setCurrentStatus] = useState<Project['Status']>('Pending');

  useEffect(() => {
    // Ensure status is valid before setting it
    if (validStatuses.includes(status as Project['Status'])) {
      setCurrentStatus(status as Project['Status']);
    }
  }, [status]);

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<Project['Status'] | null>(null);

  const openConfirmationDialog = (newStatus: Project['Status']) => {
    setSelectedStatus(newStatus);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedStatus(null);
  };

  const handleConfirmStatusChange = () => {
    if (selectedStatus) {
      setCurrentStatus(selectedStatus); // Update the local state to the new status
      // To impliment this for back end backend
      closeDialog();
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className={`h-8 w-28 px-2 py-1 text-sm ${statusColor(currentStatus)}`}>
            {currentStatus}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="bg-white rounded-xl border border-gray-200 p-2">
          {validStatuses.map((option) => (
            <DropdownMenuItem
              key={option}
              onClick={() => openConfirmationDialog(option)}
              className={`hover:bg-gray-100 text-sm justify-center border ${statusColor(option)} my-3 rounded-3xl`}
            >
              {option}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={closeDialog}
        onConfirm={handleConfirmStatusChange}
        projectNumber={row.original.ProjectNumber}
      />
    </>
  );
};

export default StatusDropdownMenu;
