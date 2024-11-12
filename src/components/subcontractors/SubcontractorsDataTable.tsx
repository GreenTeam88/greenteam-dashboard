'use client';

import { ColumnDef, Row } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import * as React from 'react';

import CustomDataTable from '@/components/custom/CustomDataTable';
import { CustomToolTip } from '@/components/custom/CustomToolTip';
import SubcontractorsInfoSidebar from '@/components/subcontractors/SubcontractorsInfoSidebar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThreeDotsDropDownMenu } from '@/constants';
import { subcontractors } from '@/mockDatas/subcontractorsPageDatas';
import { openModal } from '@/store/ModalStore';
import { Subcontractor } from '@/types';

export default function SubcontractorsDataTable() {
  type DataType = {
    [key in keyof Subcontractor]: {
      text: string;
      value: string;
    };
  };

  function getDataFromRow(row: Row<Subcontractor>): DataType {
    const data: DataType = {
      id: {
        text: 'ID',
        value: row.getValue('id'),
      },
      companyName: {
        text: 'Company Name',
        value: row.getValue('companyName'),
      },
      commerceNumber: {
        text: 'Chamber of commerce number',
        value: row.getValue('commerceNumber'),
      },
      vatTaxNumber: {
        text: 'Vat TAX number',
        value: row.getValue('vatTaxNumber'),
      },
      businessAddress: {
        text: 'Business address',
        value: row.getValue('businessAddress'),
      },
      city: {
        text: 'City',
        value: row.getValue('city'),
      },
      country: {
        text: 'Country',
        value: row.getValue('country'),
      },
      email: {
        text: 'Email',
        value: row.getValue('email'),
      },
      telephone: {
        text: 'Telephone',
        value: row.getValue('telephone'),
      },
    };
    return data;
  }

  const subcontractorColumns: ColumnDef<Subcontractor>[] = [
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
      accessorKey: 'companyName',
      header: 'Company Name',
      cell: ({ row }) => <p className={'cursor-pointer inline-block'}>{row.getValue('companyName')}</p>,
    },
    {
      accessorKey: 'commerceNumber',
      header: 'Chamber of commerce number',
      cell: ({ row }) => <CustomToolTip text={row.getValue('commerceNumber')} />,
    },
    {
      accessorKey: 'vatTaxNumber',
      header: 'Vat TAX number',
      cell: ({ row }) => <CustomToolTip limit={17} text={row.getValue('vatTaxNumber')} />,
    },
    {
      accessorKey: 'businessAddress',
      header: 'Business address',
      cell: ({ row }) => <CustomToolTip limit={15} text={row.getValue('businessAddress')} />,
    },
    {
      accessorKey: 'city',
      header: 'City',
      cell: ({ row }) => <CustomToolTip limit={15} text={row.getValue('city')} />,
    },
    {
      accessorKey: 'country',
      header: 'Country',
      cell: ({ row }) => <CustomToolTip limit={15} text={row.getValue('country')} />,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => <CustomToolTip limit={10} text={row.getValue('email')} />,
    },
    {
      accessorKey: 'telephone',
      header: 'Telephone',
      cell: ({ row }) => <CustomToolTip limit={10} text={row.getValue('telephone')} />,
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
                        openModal(<SubcontractorsInfoSidebar data={getDataFromRow(row)} />);
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

  return <CustomDataTable<Subcontractor> columns={subcontractorColumns} data={subcontractors} />;
}
