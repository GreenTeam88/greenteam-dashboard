'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { toast } from 'sonner';

import {
  deleteCalculator,
  duplicateCalculator,
  publishCalculator,
  unpublishCalculator,
} from '@/app/actions/calculatorActions';
import CustomDataTable from '@/components/custom/CustomDataTable';
import { CustomToolTip } from '@/components/custom/CustomToolTip';
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
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

import type { ProductTableRow } from '@/types/calculator';

interface CalculatorsDataTableProps {
  calculators: ProductTableRow[];
  activeFilter: string;
  setActiveFilter: (value: string) => void;
}

function StatusBadge({ status }: { status: 'published' | 'draft' }) {
  const statusConfig = {
    published: {
      label: 'Published',
      className: 'bg-green-100 text-green-700 border-green-200',
      dotClassName: 'bg-green-500',
    },
    draft: {
      label: 'Draft',
      className: 'bg-amber-50 text-amber-700 border-amber-200',
      dotClassName: 'bg-amber-500',
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        config.className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', config.dotClassName)} />
      {config.label}
    </div>
  );
}

const TableHeader = ({ activeFilter, setActiveFilter }: Omit<CalculatorsDataTableProps, 'calculators'>) => {
  const filterTypes = ['All', 'Published', 'Draft'];
  return (
    <div className="flex items-center justify-between border-b border-b-borderGray">
      <div className="flex items-center">
        {filterTypes.map((fType) => {
          return (
            <button
              onClick={() => setActiveFilter(fType)}
              key={fType}
              className={cn('p-3', activeFilter === fType && 'border-b-2 border-green-700')}
            >
              <h5
                className={cn(
                  'text-sm text-textBlack40',
                  activeFilter === fType && 'font-semibold text-textGreenPrimary'
                )}
              >
                {fType}
              </h5>
            </button>
          );
        })}
      </div>
      <Link href="/dashboard/calculators/create">
        <Button size="sm" className="mr-3 bg-bgPrimaryGreen hover:bg-bgPrimaryGreen/90">
          <Plus className="mr-2 h-4 w-4" />
          New Calculator
        </Button>
      </Link>
    </div>
  );
};

export default function CalculatorsDataTable({
  calculators: initialCalculators,
  activeFilter,
  setActiveFilter,
}: CalculatorsDataTableProps) {
  const router = useRouter();
  const [calculators, setCalculators] = React.useState<ProductTableRow[]>(initialCalculators);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [calculatorToDelete, setCalculatorToDelete] = React.useState<ProductTableRow | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Update local state when props change (e.g., from server)
  React.useEffect(() => {
    setCalculators(initialCalculators);
  }, [initialCalculators]);

  const openDeleteDialog = (calculator: ProductTableRow) => {
    setCalculatorToDelete(calculator);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!calculatorToDelete) return;

    setIsDeleting(true);
    const result = await deleteCalculator(calculatorToDelete.id);
    setIsDeleting(false);

    if (result.success) {
      // Update local state to remove the deleted calculator
      setCalculators((prev) => prev.filter((calc) => calc.id !== calculatorToDelete.id));
      toast.success('Calculator deleted successfully');
      setDeleteDialogOpen(false);
      setCalculatorToDelete(null);
    } else {
      toast.error(result.error || 'Failed to delete calculator');
    }
  };

  const handleDuplicate = async (id: string) => {
    const result = await duplicateCalculator(id);
    if (result.success && result.data) {
      // Add the duplicated calculator to the local state
      setCalculators((prev) => [result.data as ProductTableRow, ...prev]);
      toast.success('Calculator duplicated successfully');
    } else {
      toast.error(result.error || 'Failed to duplicate calculator');
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: string) => {
    const result = currentStatus === 'published' ? await unpublishCalculator(id) : await publishCalculator(id);

    if (result.success) {
      // Update the status in local state
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      setCalculators((prev) =>
        prev.map((calc) => (calc.id === id ? { ...calc, status: newStatus as 'published' | 'draft' } : calc))
      );
      toast.success(`Calculator ${currentStatus === 'published' ? 'unpublished' : 'published'} successfully`);
    } else {
      toast.error(result.error || 'Failed to update status');
    }
  };

  const columns: ColumnDef<ProductTableRow>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <Link
          href={`/dashboard/calculators/${row.original.id}/edit`}
          className="cursor-pointer font-medium text-textGreenPrimary hover:underline"
        >
          {row.getValue('name')}
        </Link>
      ),
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
      cell: ({ row }) => <CustomToolTip limit={20} text={row.getValue('slug')} />,
    },
    {
      accessorKey: 'stepsCount',
      header: 'Steps',
      cell: ({ row }) => <span>{row.getValue('stepsCount')}</span>,
    },
    {
      accessorKey: 'questionsCount',
      header: 'Questions',
      cell: ({ row }) => <span>{row.getValue('questionsCount')}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
    },
    {
      accessorKey: 'updatedAt',
      header: 'Last Updated',
      cell: ({ row }) => {
        const date = new Date(row.getValue('updatedAt'));
        return <span className="text-sm text-gray-500">{date.toLocaleDateString()}</span>;
      },
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        const calculator = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4 outline-none" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white" align="end">
              <DropdownMenuItem
                className="text-textGreenPrimary hover:bg-bgLightGreenHover hover:font-[500]"
                onClick={() => router.push(`/dashboard/calculators/${calculator.id}/edit`)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-textBlack hover:bg-bgLightGreenHover hover:font-[500]"
                onClick={() => handleDuplicate(calculator.id)}
              >
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-textBlack hover:bg-bgLightGreenHover hover:font-[500]"
                onClick={() => handleTogglePublish(calculator.id, calculator.status)}
              >
                {calculator.status === 'published' ? 'Unpublish' : 'Publish'}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-statusRed hover:bg-red-50 hover:font-[500]"
                onClick={() => openDeleteDialog(calculator)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Filter data based on activeFilter
  const filteredData = React.useMemo(() => {
    if (activeFilter === 'All') return calculators;
    if (activeFilter === 'Published') return calculators.filter((c) => c.status === 'published');
    if (activeFilter === 'Draft') return calculators.filter((c) => c.status === 'draft');
    return calculators;
  }, [calculators, activeFilter]);

  return (
    <>
      <CustomDataTable<ProductTableRow>
        columns={columns}
        data={filteredData}
        header={<TableHeader activeFilter={activeFilter} setActiveFilter={setActiveFilter} />}
      />

      {/* Delete Confirmation Modal */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white">
          <AlertDialogHeader>
            <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <AlertDialogTitle className="text-gray-900">Delete Calculator</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to delete <span className="font-semibold">{calculatorToDelete?.name}</span>? This
              will permanently remove the calculator and all its steps and questions. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-100 text-gray-700 hover:bg-gray-200" disabled={isDeleting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
