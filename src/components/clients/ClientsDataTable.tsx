'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import * as React from 'react';

import ClientInfoSidebar from '@/components/clients/ClientInfoSidebar';
import CustomDataTable from '@/components/custom/CustomDataTable';
import { CustomToolTip } from '@/components/custom/CustomToolTip';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { clients } from '@/mockDatas/clientPageDatas';
import { openModal } from '@/store/ModalStore';
import { Client } from '@/types'; //Project

interface ClientsDataTableProps {
  activeFilter: string;
  setActiveFilter: (value: string) => void;
}

const ClientsTableHeader = ({ activeFilter, setActiveFilter }: ClientsDataTableProps) => {
  const filterTypeProjects = ['All', 'Private', 'Business Client'];
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

export default function ClientsDataTable({ activeFilter, setActiveFilter }: ClientsDataTableProps) {
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

  function getDataFromRow(row: Row<Client>) {
    const obj: Omit<Client, 'id'> = {
      ClientType: row.getValue('Client Type'),
      Fullname: row.getValue('Full name'),
      Address: row.getValue('Address'),
      Housenumber: row.getValue('House number'),
      // Extraaddressinfo: row.getValue('Extra address info'),
      // 'Postal code': row.getValue('Postal code'),
      City: row.getValue('City'),
      Country: row.getValue('Country'),
      Email: row.getValue('Email'),
      Telephone: row.getValue('Telephone 1'),
      // 'Telephone 2': row.getValue('Telephone 2'),
    };

    return obj;
  }

  const clientsColumns: ColumnDef<Client>[] = [
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
      accessorKey: 'Full name',
      header: 'Full name',
      cell: ({ row }) => <p className={'cursor-pointer inline-block'}>{row.getValue('Full name')}</p>,
    },
    {
      accessorKey: 'Client Type',
      header: 'Client Type',
      // cell: ({ row }) => <CustomToolTip text={row.getValue('Date')} />,
    },
    {
      accessorKey: 'Address',
      header: 'Address',
      cell: ({ row }) => <CustomToolTip limit={17} text={row.getValue('Address')} />,
    },
    {
      accessorKey: 'House number',
      header: 'House number',
      cell: ({ row }) => <CustomToolTip limit={15} text={row.getValue('House number')} />,
    },
    {
      accessorKey: 'City',
      header: 'City',
      cell: ({ row }) => <CustomToolTip limit={15} text={row.getValue('City')} />,
    },
    {
      accessorKey: 'Country',
      header: 'Country',
      cell: ({ row }) => <CustomToolTip limit={15} text={row.getValue('Country')} />,
    },
    {
      accessorKey: 'Email',
      header: 'Email',
      cell: ({ row }) => <CustomToolTip limit={10} text={row.getValue('Email')} />,
    },
    {
      accessorKey: 'Telephone',
      header: 'Telephone',
      cell: ({ row }) => <CustomToolTip limit={10} text={row.getValue('Telephone')} />,
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
                    className={`${item.color} hover:bg-bgLightGreenHover hover:font-[500] duration-200 text-sm`}
                    onClick={() => {
                      if (item.text === 'Details') {
                        openModal(<ClientInfoSidebar id={+row.id} data={getDataFromRow(row)} />);
                      }
                    }}
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
    <CustomDataTable<Client>
      columns={clientsColumns}
      data={clients}
      header={<ClientsTableHeader activeFilter={activeFilter} setActiveFilter={setActiveFilter} />}
    />
  );
}
