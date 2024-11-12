'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { MoreVertical } from 'lucide-react';
import React, { useMemo } from 'react';

import CustomDataTable from '@/components/custom/CustomDataTable';
import { CustomToolTip } from '@/components/custom/CustomToolTip';
import ProjectInfoSidebar from '@/components/projects/ProjectInfoSidebar';
import StatusDropdownMenu from '@/components/projects/StatusDropDownMenu';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { projects } from '@/mockDatas/projectPageDatas';
import { openModal } from '@/store/ModalStore';
import { Project } from '@/types'; // Assuming this import line correctly points to where the Project type is exported.

interface ProjectDataTableProps {
  activeFilter: string;
  setActiveFilter: (value: string) => void;
}

const getFilteredProjects = (data: Project[], filter: string): Project[] => {
  if (filter === 'All') return data;
  return data.filter((project) => project.Status.toLocaleLowerCase() === filter.toLowerCase());
};

// Done
const ProjectsTableHeader: React.FC<
  ProjectDataTableProps & {
    counts: { all: number; Pending: number; Declined: number; Approved: number; OnHold: number; Finished: number };
  }
> = ({ activeFilter, setActiveFilter, counts }) => {
  return (
    <div className="border-b rounded-md bg-white border-b-borderGray flex items-center">
      {['All', 'Pending', 'Declined', 'Approved', 'On Hold', 'Finished'].map((type, index) => {
        const count =
          index === 0
            ? counts.all
            : index === 1
              ? counts.Pending
              : index === 2
                ? counts.Declined
                : index === 3
                  ? counts.Approved
                  : index === 4
                    ? counts.OnHold
                    : counts.Finished;
        const isActive = activeFilter === type;
        return (
          <button
            key={type}
            onClick={() => setActiveFilter(type)}
            className={cn('p-3 flex items-center gap-2', isActive && 'border-b-2 border-green-700')}
          >
            <h5 className={cn('text-sm', isActive ? 'text-green-700 font-semibold' : 'text-textBlack40')}>{type}</h5>
            <span
              className={cn(
                'flex items-center justify-center font-medium h-6 w-6 rounded-full text-xs',
                'transition-colors duration-300',
                isActive ? 'bg-gray-100 text-green-700' : 'bg-gray-100 text-gray-500'
              )}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
};

//Done
const ActionDropdownMenu: React.FC<{ row: Row<Project> }> = ({ row }) => {
  const menuItems = [
    { text: 'Details', action: 'Details', color: 'text-textBlack' },
    { text: 'Edit', action: 'Edit', color: 'text-textGreenPrimary' },
    { text: 'Delete', action: 'Delete', color: 'text-statusRed' },
  ];

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, action: string, projectId: string) => {
    event.stopPropagation();
    const projectDetails = projects.find((project) => project.id === projectId);
    switch (action) {
      case 'Details':
        if (projectDetails) {
          openModal(<ProjectInfoSidebar id={+projectId} data={projectDetails} />);
        }
        break;
      case 'Edit':
        if (projectDetails) {
          console.log('Edit:', projectDetails);
        }
        break;
      case 'Delete':
        if (projectDetails) {
          console.log('Delete:', projectDetails);
        }
        break;
      default:
        console.log('Invalid action');
        break;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreVertical className="h-4 w-4 outline-none" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end">
        {menuItems.map((item) => (
          <DropdownMenuItem
            key={item.text}
            className={`${item.color} hover:bg-bgLightGreenHover hover:font-[500] duration-200 text-sm`}
            onClick={(e) => handleMenuClick(e, item.text, row.original.id)}
          >
            {item.text}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const projectsColumns: ColumnDef<Project>[] = [
  {
    id: 'select',
    header: () => <Checkbox aria-label="Select all" />,
    cell: ({ row }) => (
      <Checkbox checked={row.getIsSelected()} onCheckedChange={() => row.toggleSelected()} aria-label="Select row" />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'ProjectNumber',
    header: 'Project Number',
    cell: ({ row }) => <p className="cursor-pointer">{row.getValue('ProjectNumber')}</p>,
  },
  {
    accessorKey: 'Category',
    header: 'Category',
    cell: ({ row }) => <p>{row.getValue('Category')}</p>,
  },
  {
    accessorKey: 'Details',
    header: 'Details',
    cell: ({ row }) => <CustomToolTip limit={17} text={row.getValue('Details') as string} />,
  },
  {
    accessorKey: 'Date',
    header: 'Date',
    cell: ({ row }) => <CustomToolTip limit={17} text={row.getValue('Date')} />,
  },
  {
    accessorKey: 'Name',
    header: 'Name',
    cell: ({ row }) => <CustomToolTip limit={17} text={row.getValue('Name')} />,
  },
  {
    accessorKey: 'Address',
    header: 'Address',
    cell: ({ row }) => <CustomToolTip limit={15} text={row.getValue('Address')} />,
  },
  {
    accessorKey: 'City',
    header: 'City',
    cell: ({ row }) => <CustomToolTip limit={15} text={row.getValue('City')} />,
  },
  {
    accessorKey: 'Telephone',
    header: 'Telephone',
    cell: ({ row }) => <CustomToolTip limit={10} text={row.getValue('Telephone')} />,
  },
  {
    accessorKey: 'Status',
    header: 'Status',
    cell: ({ row }) => <StatusDropdownMenu row={row} status={row.getValue('Status')} />,
  },
  {
    id: 'actions',
    cell: ({ row }) => <ActionDropdownMenu row={row} />,
    enableHiding: false,
  },
];

const ProjectsDataTable: React.FC<ProjectDataTableProps> = ({ activeFilter, setActiveFilter }) => {
  const counts = useMemo(
    () => ({
      all: projects.length,
      Pending: projects.filter((p) => p.Status === 'Pending').length,
      Declined: projects.filter((p) => p.Status === 'Declined').length,
      Approved: projects.filter((p) => p.Status === 'Approved').length,
      Finished: projects.filter((p) => p.Status === 'Finished').length,
      OnHold: projects.filter((p) => p.Status === 'On Hold').length,
    }),
    []
  );
  const filteredProjects = getFilteredProjects(projects, activeFilter);

  return (
    <CustomDataTable
      columns={projectsColumns}
      data={filteredProjects}
      onRowClick={(project) => {
        const clientDetails = projects.find((p) => p.id === project.id);
        if (clientDetails) {
          openModal(<ProjectInfoSidebar id={+project.id} data={clientDetails} />);
        }
      }}
      header={<ProjectsTableHeader activeFilter={activeFilter} setActiveFilter={setActiveFilter} counts={counts} />}
    />
  );
};

export default ProjectsDataTable;
