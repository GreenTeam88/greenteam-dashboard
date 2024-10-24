'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import * as React from 'react';
import { FaCheck } from 'react-icons/fa6';
import { VscClose } from 'react-icons/vsc';

import { InvoicingFilterTypes } from '@/app/dashboard/invoicing/page';
import CustomDataTable from '@/components/custom/CustomDataTable';
import { CustomToolTip } from '@/components/custom/CustomToolTip';
import InvoicingInfoSidebar from '@/components/invoicing/InvoicingInfoSidebar';
import CustomTableHeader from '@/components/table/CustomTableHeader';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThreeDotsDropDownMenu } from '@/constants';
import { cn } from '@/lib/utils';
import { invoices } from '@/mockDatas/invoicingPageDatas';
import { openModal } from '@/store/ModalStore';
import { Invoice, SidebarDataType } from '@/types'; // Subcontractor

function TotalAmountBox(totalAmount: string, status: Invoice['status']) {
  const StatusBoxClass =
    'w-fit text-xs font-semibold leading-5 py-[3px] px-3 text-statusSuccess border border-statusSuccess rounded-full flex items-center gap-x-1';
  if (status === 'FINISHED') {
    return (
      <div className={cn(StatusBoxClass, 'text-statusSuccess border-statusSuccess')}>
        {totalAmount}
        <FaCheck size={12} />
      </div>
    );
  }
  if (status === 'DECLINED') {
    return (
      <div className={cn(StatusBoxClass, 'text-statusRed border-statusRed')}>
        {totalAmount}
        <VscClose size={15} />
      </div>
    );
  }
  return totalAmount;
}

function StatusBox(status: Invoice['status']) {
  const StatusBoxClass =
    'w-fit text-xs font-semibold leading-5 py-[3px] px-3 text-statusSuccess border border-statusSuccess rounded-full flex items-center gap-x-1';
  const colorObj = {
    FINISHED: 'text-statusSuccess border-statusSuccess',
    APPROVED: 'text-statusInfo border-statusInfo',
    PENDING: 'text-statusDanger border-statusDanger',
    DECLINED: 'text-statusRed border-statusRed',
    UNPAID: 'text-[#ADADAD] border-[#ADADAD]',
  };
  return <div className={cn(StatusBoxClass, colorObj[status])}>{status}</div>;
}

interface InvoicingInfoSidebarProps {
  activeFilter: InvoicingFilterTypes;
  setActiveFilter: React.Dispatch<React.SetStateAction<InvoicingFilterTypes>>;
}

export default function InvoicingDataTable({ activeFilter, setActiveFilter }: InvoicingInfoSidebarProps) {
  const InvoicingFilterTypesArr: InvoicingFilterTypes[] = ['All', 'Received', 'Project paid', 'Subcontractor paid'];

  function getDataFromRow(row: Row<Invoice>): SidebarDataType<Invoice> {
    return {
      projectNumber: {
        text: 'Project Number',
        value: row.getValue('projectNumber'),
      },
      category: {
        text: 'Category',
        value: row.getValue('category'),
      },
      date: {
        text: 'Date',
        value: row.getValue('date'),
      },
      client: {
        text: 'Client',
        value: row.getValue('client'),
      },
      subcontractor: {
        text: 'Subcontractor',
        value: row.getValue('subcontractor'),
      },
      totalAmount: {
        text: 'Total Amount',
        //@ts-expect-error totalAmount as number
        value: '€' + row.getValue('totalAmount').toFixed(2).toString(),
      },
      status: {
        text: 'Status',
        value: row.getValue('status'),
      },
    };
  }

  const subcontractorColumns: ColumnDef<Invoice>[] = [
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
      accessorKey: 'projectNumber',
      header: 'Project Number',
      cell: ({ row }) => <p className={'cursor-pointer inline-block'}>{row.getValue('projectNumber')}</p>,
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ row }) => <CustomToolTip text={row.getValue('category')} />,
    },
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => <CustomToolTip limit={17} text={row.getValue('date')} />,
    },
    {
      accessorKey: 'client',
      header: 'Client',
      cell: ({ row }) => <CustomToolTip limit={15} text={row.getValue('client')} />,
    },
    {
      accessorKey: 'subcontractor',
      header: 'Subcontractor',
      cell: ({ row }) => <CustomToolTip limit={15} text={row.getValue('subcontractor')} />,
    },
    {
      accessorKey: 'totalAmount',
      header: 'Total Amount',
      cell: ({ row }) => {
        const num = row.getValue('totalAmount') as number;
        const str = '€' + num.toFixed(2).toString();
        return TotalAmountBox(str, row.getValue('status'));
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => StatusBox(row.getValue('status')),
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
                        openModal(<InvoicingInfoSidebar data={getDataFromRow(row)} />);
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
    <CustomDataTable<Invoice>
      columns={subcontractorColumns}
      data={invoices}
      header={
        <CustomTableHeader<InvoicingFilterTypes>
          filterTypes={InvoicingFilterTypesArr}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      }
    />
  );
}
