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

// Filter Header Component
const ClientsTableHeader: React.FC<ClientsDataTableProps> = ({ activeFilter, setActiveFilter }) => {
  const filterTypes = ['All', 'Private', 'Business Client'];

  return (
    <div className="border-b border-b-borderGray flex items-center">
      {filterTypes.map((type) => (
        <button
          key={type}
          onClick={() => setActiveFilter(type)}
          className={cn('p-3', activeFilter === type && 'border-b-2 border-green-700')}
        >
          <h5
            className={cn('text-sm text-textBlack40', activeFilter === type && 'text-textGreenPrimary font-semibold')}
          >
            {type}
          </h5>
        </button>
      ))}
    </div>
  );
};

// Dropdown Menu Component
const ActionDropdownMenu: React.FC<{ row: Row<Client> }> = ({ row }) => {
  const menuItems = [
    { text: 'Details', color: 'text-textBlack' },
    { text: 'Edit', color: 'text-textGreenPrimary' },
    { text: 'Delete', color: 'text-statusRed' },
  ];

  const handleMenuClick = (action: string) => {
    if (action === 'Details') {
      openModal(<ClientInfoSidebar id={+row.id} data={getDataFromRow(row)} />);
    }
  };

  function getDataFromRow(row: Row<Client>): Omit<Client, 'id'> {
    return {
      ClientType: row.getValue('ClientType') as string,
      Fullname: row.getValue('Full name') as string,
      Address: row.getValue('Address') as string,
      Housenumber: row.getValue('House number') as string,
      City: row.getValue('City') as string,
      Country: row.getValue('Country') as string,
      Email: row.getValue('Email') as string,
      Telephone: row.getValue('Telephone') as string,
    };
  }

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
            onClick={() => handleMenuClick(item.text)}
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

  // Filter data based on active filter
  const filteredData = getFilteredData(clients, activeFilter);

  return (
    <CustomDataTable<Client>
      columns={clientsColumns}
      data={filteredData} // Use filtered data
      header={<ClientsTableHeader activeFilter={activeFilter} setActiveFilter={setActiveFilter} />}
    />
  );
};

export default ClientsDataTable;
