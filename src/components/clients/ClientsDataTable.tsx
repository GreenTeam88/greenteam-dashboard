'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import React, { useMemo } from 'react';

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
import { Client } from '@/types';

interface ClientsDataTableProps {
  activeFilter: string;
  setActiveFilter: (value: string) => void;
}

// Helper function to filter data based on active filter
const getFilteredData = (data: Client[], filter: string): Client[] => {
  if (filter === 'All') return data;
  return data.filter((client) => client.ClientType === filter);
};

// ClientsTableHeader component now receives count as a prop
const ClientsTableHeader: React.FC<
  ClientsDataTableProps & { counts: { all: number; private: number; business: number } }
> = ({ activeFilter, setActiveFilter, counts }) => {
  return (
    <div className="border-b border-b-borderGray flex items-center">
      {['All', 'Private', 'Business Client'].map((type, index) => {
        const count = index === 0 ? counts.all : index === 1 ? counts.private : counts.business;
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

const ActionDropdownMenu: React.FC<{ row: Row<Client> }> = ({ row }) => {
  const menuItems = [
    { text: 'Details', color: 'text-textBlack' },
    { text: 'Edit', color: 'text-textGreenPrimary' },
    { text: 'Delete', color: 'text-statusRed' },
  ];

  const handleMenuClick = (action: string, clientId: string) => {
    if (action === 'Details') {
      const clientDetails = clients.find((client) => client.id === clientId);
      if (clientDetails) {
        openModal(<ClientInfoSidebar id={+clientId} data={clientDetails} />);
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4 outline-none" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white" align="end">
        {menuItems.map((item) => (
          <DropdownMenuItem
            key={item.text}
            className={`${item.color} hover:bg-bgLightGreenHover hover:font-[500] duration-200 text-sm`}
            onClick={() => handleMenuClick(item.text, row.original.id)}
          >
            {item.text}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Main DataTable Component
const ClientsDataTable: React.FC<ClientsDataTableProps> = ({ activeFilter, setActiveFilter }) => {
  const counts = useMemo(
    () => ({
      all: clients.length,
      private: clients.filter((client) => client.ClientType === 'Private').length,
      business: clients.filter((client) => client.ClientType === 'Business Client').length,
    }),
    [clients]
  );

  const filteredData = getFilteredData(clients, activeFilter);

  return (
    <CustomDataTable<Client>
      columns={clientsColumns}
      data={filteredData}
      header={<ClientsTableHeader activeFilter={activeFilter} setActiveFilter={setActiveFilter} counts={counts} />}
    />
  );
};

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
    accessorKey: 'Fullname',
    header: 'Full name',
    cell: ({ row }) => <p className="cursor-pointer">{row.getValue('Fullname')}</p>,
  },
  { accessorKey: 'ClientType', header: 'Client Type' },
  {
    accessorKey: 'Address',
    header: 'Address',
    cell: ({ row }) => <CustomToolTip limit={17} text={row.getValue('Address') as string} />,
  },
  {
    accessorKey: 'Housenumber',
    header: 'House number',
    cell: ({ row }) => <CustomToolTip limit={15} text={row.getValue('Housenumber') as string} />,
  },
  {
    accessorKey: 'City',
    header: 'City',
    cell: ({ row }) => <CustomToolTip limit={15} text={row.getValue('City') as string} />,
  },
  {
    accessorKey: 'Country',
    header: 'Country',
    cell: ({ row }) => <CustomToolTip limit={15} text={row.getValue('Country') as string} />,
  },
  {
    accessorKey: 'Email',
    header: 'Email',
    cell: ({ row }) => <CustomToolTip limit={10} text={row.getValue('Email') as string} />,
  },
  {
    accessorKey: 'Telephone',
    header: 'Telephone',
    cell: ({ row }) => <CustomToolTip limit={10} text={row.getValue('Telephone') as string} />,
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => <ActionDropdownMenu row={row} />,
  },
];

export default ClientsDataTable;
