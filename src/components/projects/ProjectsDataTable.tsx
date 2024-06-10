'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import * as React from 'react';

import CustomDataTable from '@/components/custom/CustomDataTable';
import { CustomToolTip } from '@/components/custom/CustomToolTip';
import ProjectInfoSidebar from '@/components/projects/ProjectInfoSidebar';
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
import { Project } from '@/types';

const TableHeader = ({
  activeFilter,
  setActiveFilter,
}: {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}) => {
  const filterTypeProjects = ['All', 'Pending', 'Declined', 'Approved', 'Finished'];
  return (
    <div className={'border-b border-b-borderGray flex items-center'}>
      {filterTypeProjects.map((fType) => {
        return (
          <button
            onClick={() => setActiveFilter(fType)}
            key={fType}
            className={cn('p-3', activeFilter === fType && 'border-b-2 border-green-700')}
          >
            <h5
              className={cn(
                'text-sm text-textBlack40',
                activeFilter === fType && 'text-textGreenPrimary font-semibold'
              )}
            >
              {fType}
            </h5>
          </button>
        );
      })}
    </div>
  );
};

export default function ProjectsDataTable({
  activeFilter,
  setActiveFilter,
}: {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}) {
  const ThreeDotsDropDownMenu = [
    {
      text: 'Details',
      color: 'text-textBlack',
    },
    {
      text: 'Edit',
      color: 'text-textGreenPrimary',
    },
    {
      text: 'Delete',
      color: 'text-statusRed',
    },
  ];

  function statusColor(status: Project['Status']) {
    switch (status) {
      case 'FINISHED':
        return 'text-statusSuccess border-statusSuccess';
      case 'APPROVED':
        return 'text-statusInfo border-statusInfo';
      case 'PENDING':
        return 'text-statusDanger border-statusDanger';
      case 'ON HOLD':
        return 'text-statusOrange border-statusOrange';
      case 'DECLINED':
        return 'text-statusRed border-statusRed';
    }
  }
  function getDataFromRow(row: Row<Project>) {
    const obj: Omit<Project, 'id'> = {
      'Project number': row.getValue('Project number'),
      Date: row.getValue('Date'),
      Category: row.getValue('Category'),
      Details: row.getValue('Details'),
      Name: row.getValue('Name'),
      Address: row.getValue('Address'),
      City: row.getValue('City'),
      Telephone: row.getValue('Telephone'),
      Status: row.getValue('Status'),
    };
    return obj;
  }
  const projectsColumns: ColumnDef<Project>[] = [
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
      accessorKey: 'Project number',
      header: 'Project number',
      cell: ({ row }) => (
        <p
          onClick={() => openModal(<ProjectInfoSidebar id={+row.id} data={getDataFromRow(row)} />)}
          className={'cursor-pointer inline-block'}
        >
          {row.getValue('Project number')}
        </p>
      ),
    },
    {
      accessorKey: 'Date',
      header: 'Date',
      // cell: ({ row }) => <CustomToolTip text={row.getValue('Date')} />,
    },
    {
      accessorKey: 'Category',
      header: 'Category',
    },
    {
      accessorKey: 'Details',
      header: 'Details',
      cell: ({ row }) => <CustomToolTip limit={15} text={row.getValue('Details')} />,
    },
    {
      accessorKey: 'Name',
      header: 'Name',
      cell: ({ row }) => <CustomToolTip limit={17} text={row.getValue('Name')} />,
    },
    {
      accessorKey: 'Address',
      header: 'Address',
      cell: ({ row }) => <CustomToolTip limit={10} text={row.getValue('Address')} />,
    },
    {
      accessorKey: 'City',
      header: 'City',
    },
    {
      accessorKey: 'Telephone',
      header: 'Telephone',
      cell: ({ row }) => <CustomToolTip limit={10} text={row.getValue('Telephone')} />,
    },
    {
      accessorKey: 'Status',
      header: 'Status',
      cell: ({ row }) => (
        <div
          className={`py-[3px] flex justify-center items-center font-[600] text-sm rounded-full px-3 border ${statusColor(row.getValue('Status'))}`}
        >
          {row.getValue('Status')}
        </div>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4 outline-none" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={'bg-white'} align="end">
              {ThreeDotsDropDownMenu.map((item) => {
                return (
                  <DropdownMenuItem
                    key={item.text}
                    onClick={() => {
                      if (item.text === 'Details') {
                        openModal(<ProjectInfoSidebar id={+row.id} data={getDataFromRow(row)} />);
                      }
                    }}
                    className={`${item.color} hover:bg-bgLightGreenHover hover:font-[500] duration-200 text-sm`}
                  >
                    {item.text}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return (
    <CustomDataTable<Project>
      header={<TableHeader activeFilter={activeFilter} setActiveFilter={setActiveFilter} />}
      columns={projectsColumns}
      data={projects}
    />
  );
}
