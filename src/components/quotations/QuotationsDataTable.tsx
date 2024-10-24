'use client';

import { ColumnDef } from '@tanstack/react-table'; //Row
import { MoreHorizontal } from 'lucide-react';
import * as React from 'react';

// import ClientInfoSidebar from '@/components/clients/ClientInfoSidebar';
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
// import { clients } from '@/mockDatas/clientPageDatas';
import { quotations } from '@/mockDatas/quotationPageDatas';
// import { openModal } from '@/store/ModalStore';
import { Quotation } from '@/types'; // removed Client, Project,

interface QuotationsDataTableProps {
  activeFilter: string;
  setActiveFilter: (value: string) => void;
}

function StatusBadge({ status }: { status: 'SEND' | 'DRAFT' }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center px-3 py-[3px] border rounded-full text-sm font-semibold',
        status === 'SEND' ? 'border-statusDanger text-statusDanger' : 'text-textBlack40 border-borderBlack40'
      )}
    >
      {status}
    </div>
  );
}

const ClientsTableHeader = ({ activeFilter, setActiveFilter }: QuotationsDataTableProps) => {
  const filterTypeProjects = ['All', 'Incoming', 'Outgoing'];
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

export default function QuotationsDataTable({ activeFilter, setActiveFilter }: QuotationsDataTableProps) {
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

  // function getDataFromRow(row: Row<Quotation>) {
  //   const obj: Quotation = {
  //     id: row.getValue('id'),
  //     quotationNumber: row.getValue('quotationNumber'),
  //     category: row.getValue('category'),
  //     details: row.getValue('details'),
  //     date: row.getValue('date'),
  //     name: row.getValue('name'),
  //     address: row.getValue('address'),
  //     city: row.getValue('city'),
  //     amount: row.getValue('amount'),
  //     telephone: row.getValue('telephone'),
  //     status: row.getValue('status'),
  //   };
  //   return obj;
  // }

  const clientsColumns: ColumnDef<Quotation>[] = [
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
      accessorKey: 'quotationNumber',
      header: 'Quotation number',
      cell: ({ row }) => <p className={'cursor-pointer inline-block'}>{row.getValue('quotationNumber')}</p>,
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => <CustomToolTip text={row.getValue('category')} />,
    },
    {
      accessorKey: 'details',
      header: 'Details',
      cell: ({ row }) => <CustomToolTip limit={10} text={row.getValue('details')} />,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => <CustomToolTip limit={15} text={row.getValue('date')} />,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => <CustomToolTip limit={15} text={row.getValue('name')} />,
    },
    {
      accessorKey: 'address',
      header: 'Address',
      cell: ({ row }) => <CustomToolTip limit={10} text={row.getValue('address')} />,
    },
    {
      accessorKey: 'city',
      header: 'City',
      cell: ({ row }) => <CustomToolTip limit={10} text={row.getValue('city')} />,
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => <CustomToolTip limit={10} text={'€' + row.getValue('amount')} />,
    },
    {
      accessorKey: 'telephone',
      header: 'Telephone',
      cell: ({ row }) => <CustomToolTip limit={10} text={row.getValue('telephone')} />,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <StatusBadge status={row.getValue('status')} />,
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: () => {
        // removed row from args
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
    <CustomDataTable<Quotation>
      columns={clientsColumns}
      data={quotations}
      header={<ClientsTableHeader activeFilter={activeFilter} setActiveFilter={setActiveFilter} />}
    />
  );
}
