'use client';

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { GripVertical, MoreHorizontal, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import * as React from 'react';
import { toast } from 'sonner';

import {
  deleteCalculator,
  duplicateCalculator,
  publishCalculator,
  reorderCalculators,
  unpublishCalculator,
} from '@/app/actions/calculatorActions';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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

const ListHeader = ({ activeFilter, setActiveFilter }: Omit<CalculatorsDataTableProps, 'calculators'>) => {
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

// Sortable row component
function SortableRow({
  calculator,
  isDndEnabled,
  onEdit,
  onDuplicate,
  onTogglePublish,
  onDelete,
}: {
  calculator: ProductTableRow;
  isDndEnabled: boolean;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onTogglePublish: (id: string, status: string) => void;
  onDelete: (calculator: ProductTableRow) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: calculator.id,
    disabled: !isDndEnabled,
  });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    zIndex: isDragging ? 10 : undefined,
    opacity: isDragging ? 0.5 : 1,
  };

  const date = new Date(calculator.updatedAt);

  return (
    <TableRow ref={setNodeRef} style={style} className="hover:bg-bgLightGreen">
      {/* Drag Handle */}
      <TableCell className="w-10 px-2">
        {isDndEnabled ? (
          <div
            {...attributes}
            {...listeners}
            className="flex h-8 w-8 cursor-grab items-center justify-center rounded-md transition-colors hover:bg-gray-100 active:cursor-grabbing"
          >
            <GripVertical className="h-4 w-4 text-gray-400" />
          </div>
        ) : (
          <div className="flex h-8 w-8 items-center justify-center">
            <GripVertical className="h-4 w-4 text-gray-200" />
          </div>
        )}
      </TableCell>

      {/* Name */}
      <TableCell>
        <Link
          href={`/dashboard/calculators/${calculator.id}/edit`}
          className="cursor-pointer font-medium text-textGreenPrimary hover:underline"
        >
          {calculator.name}
        </Link>
      </TableCell>

      {/* Slug */}
      <TableCell>
        <CustomToolTip limit={20} text={calculator.slug} />
      </TableCell>

      {/* Steps */}
      <TableCell>{calculator.stepsCount}</TableCell>

      {/* Questions */}
      <TableCell>{calculator.questionsCount}</TableCell>

      {/* Status */}
      <TableCell>
        <StatusBadge status={calculator.status} />
      </TableCell>

      {/* Last Updated */}
      <TableCell>
        <span className="text-sm text-gray-500">{date.toLocaleDateString()}</span>
      </TableCell>

      {/* Actions */}
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4 outline-none" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-white" align="end">
            <DropdownMenuItem
              className="text-textGreenPrimary hover:bg-bgLightGreenHover hover:font-[500]"
              onClick={() => onEdit(calculator.id)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-textBlack hover:bg-bgLightGreenHover hover:font-[500]"
              onClick={() => onDuplicate(calculator.id)}
            >
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-textBlack hover:bg-bgLightGreenHover hover:font-[500]"
              onClick={() => onTogglePublish(calculator.id, calculator.status)}
            >
              {calculator.status === 'published' ? 'Unpublish' : 'Publish'}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-statusRed hover:bg-red-50 hover:font-[500]"
              onClick={() => onDelete(calculator)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

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

  // DnD is only enabled when viewing "All" (no filter active)
  const isDndEnabled = activeFilter === 'All';

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = calculators.findIndex((c) => c.id === active.id);
      const newIndex = calculators.findIndex((c) => c.id === over.id);

      const reordered = arrayMove(calculators, oldIndex, newIndex).map((calc, index) => ({
        ...calc,
        order: index,
      }));

      // Optimistic update
      setCalculators(reordered);

      // Persist to database
      const reorderData = reordered.map((calc) => ({ id: calc.id, order: calc.order }));
      const result = await reorderCalculators(reorderData);

      if (!result.success) {
        // Revert on failure
        setCalculators(calculators);
        toast.error(result.error || 'Failed to reorder calculators');
      }
    }
  };

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
      setCalculators((prev) => [...prev, result.data as ProductTableRow]);
      toast.success('Calculator duplicated successfully');
    } else {
      toast.error(result.error || 'Failed to duplicate calculator');
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: string) => {
    const result = currentStatus === 'published' ? await unpublishCalculator(id) : await publishCalculator(id);

    if (result.success) {
      const newStatus = currentStatus === 'published' ? 'draft' : 'published';
      setCalculators((prev) =>
        prev.map((calc) => (calc.id === id ? { ...calc, status: newStatus as 'published' | 'draft' } : calc))
      );
      toast.success(`Calculator ${currentStatus === 'published' ? 'unpublished' : 'published'} successfully`);
    } else {
      toast.error(result.error || 'Failed to update status');
    }
  };

  // Filter data based on activeFilter
  const filteredData = React.useMemo(() => {
    if (activeFilter === 'All') return calculators;
    if (activeFilter === 'Published') return calculators.filter((c) => c.status === 'published');
    if (activeFilter === 'Draft') return calculators.filter((c) => c.status === 'draft');
    return calculators;
  }, [calculators, activeFilter]);

  return (
    <>
      <div className="w-full">
        <ListHeader activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        <Table className="bg-white">
          <TableHeader>
            <TableRow>
              <TableHead className="w-10 px-2" />
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Steps</TableHead>
              <TableHead>Questions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {isDndEnabled ? (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={filteredData.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                  {filteredData.map((calculator) => (
                    <SortableRow
                      key={calculator.id}
                      calculator={calculator}
                      isDndEnabled={isDndEnabled}
                      onEdit={(id) => router.push(`/dashboard/calculators/${id}/edit`)}
                      onDuplicate={handleDuplicate}
                      onTogglePublish={handleTogglePublish}
                      onDelete={openDeleteDialog}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            ) : (
              filteredData.map((calculator) => (
                <SortableRow
                  key={calculator.id}
                  calculator={calculator}
                  isDndEnabled={false}
                  onEdit={(id) => router.push(`/dashboard/calculators/${id}/edit`)}
                  onDuplicate={handleDuplicate}
                  onTogglePublish={handleTogglePublish}
                  onDelete={openDeleteDialog}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
