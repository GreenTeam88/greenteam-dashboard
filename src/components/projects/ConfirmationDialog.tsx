// import React from 'react';

// import { Button } from '@/components/ui/button';

// interface ConfirmationDialogProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onConfirm: () => void;
//   projectNumber: string;
//   projectStatus: string;
// }

// const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
//   isOpen,
//   onClose,
//   onConfirm,
//   projectNumber,
//   projectStatus,
// }) => {
//   if (!isOpen) return null;

//   const handleDialogClick = (event: React.MouseEvent) => {
//     // Prevent click events from propagating out of the dialog
//     event.stopPropagation();
//   };

//   return (
//     <div
//       className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center p-4"
//       onClick={onClose} // Close dialog when clicking outside
//     >
//       <div className="bg-white rounded-lg p-4 shadow-lg" onClick={handleDialogClick}>
//         <h4 className="text-lg font-bold mb-4">Are you sure?</h4>
//         <p>
//           Are you sure you want to change the status of project {projectNumber} to {projectStatus}?
//         </p>
//         <div className="flex justify-center gap-4">
//           <Button
//             onClick={onClose}
//             className="py-2.5 px-5 text-sm border rounded-lg bg-green-700 text-white border-green-700 hover:bg-white hover:text-green-700 hover:border-green-700"
//           >
//             Cancel
//           </Button>
//           <Button
//             onClick={onConfirm}
//             className="py-2.5 px-5 text-sm border rounded-lg border-borderSecondaryOrange text-textSecondaryOrange hover:bg-orange-600 hover:text-white"
//           >
//             Yes, I m sure
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ConfirmationDialog;

import React from 'react';

import { Button } from '@/components/ui/button';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  projectNumber: string;
  projectStatus: string;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  projectNumber,
  projectStatus,
}) => {
  if (!isOpen) return null;

  const handleDialogClick = (event: React.MouseEvent) => {
    // Prevent click events from propagating out of the dialog
    event.stopPropagation();
  };

  // Define status color based on projectStatus
  const statusColor = (() => {
    switch (projectStatus) {
      case 'Finished':
        return 'text-statusSuccess'; // Green or success color
      case 'Approved':
        return 'text-statusInfo'; // Info color, often blue
      case 'Pending':
        return 'text-statusDanger'; // Red or danger color
      case 'On Hold':
        return 'text-statusOrange'; // Orange color
      case 'Declined':
        return 'text-statusRed'; // Red color
      default:
        return 'text-gray-600'; // Default color if status is unrecognized
    }
  })();
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center p-4"
      onClick={onClose} // Close dialog when clicking outside
    >
      <div className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md" onClick={handleDialogClick}>
        <p className="text-center mb-6 text-lg font-semibold">
          Are you sure you want to change the status of <span className="font-bold text-gray-900">{projectNumber}</span>{' '}
          to <span className={`font-bold ${statusColor}`}>{projectStatus}</span>?
        </p>
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
            Yes, I m sure
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationDialog;
