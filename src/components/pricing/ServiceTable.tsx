'use client';

import { ChevronDown, ChevronUp, MoreVertical } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHeader, TableRow } from '@/components/ui/table';
import { Service } from '@/types';

export default function ServiceTable({ service }: { service: Service }) {
  // State to track which item is expanded
  const [expandedItem, setExpandedItem] = useState<boolean>(false);

  // Toggle function for expanding/collapsing the accordion details
  const handleExpandAccordion = () => {
    setExpandedItem(!expandedItem);
  };

  // Menu options for actions on each service
  const ThreeDotsDropDownMenu = [
    {
      text: 'Edit',
      color: 'text-textGreenPrimary',
    },
    {
      text: 'Delete',
      color: 'text-statusRed',
    },
  ];

  return (
    <div className="shadow-md mb-4 rounded-lg overflow-hidden">
      <Table className="min-w-full bg-white divide-y divide-gray-200 ">
        <TableHeader>
          <TableRow className="rounded-t-lg">
            <TableCell className="min-w-96 px-6 py-4  text-sm font-bold rounded-tl-lg ">{service.name}</TableCell>
            {service.subservices.map((subservice, index) => (
              <TableCell className=" w-52 px-6 py-3 text-left text-sm  font-bold max-w-52 " key={index}>
                {subservice.name}
              </TableCell>
            ))}
            <TableCell className="w-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4 outline-none" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className={'bg-white'} align="end">
                  {ThreeDotsDropDownMenu.map((item) => {
                    return (
                      <DropdownMenuItem
                        key={item.text}
                        className={`${item.color} hover:bg-bgLightGreenHover hover:font-[500] duration-200 text-sm`}
                      >
                        {item.text}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        </TableHeader>

        <TableBody className="rounded-md">
          <TableRow className="bg-orange-50 cursor-pointer" onClick={handleExpandAccordion}>
            <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-bold">Basic Price</TableCell>
            {service.subservices.map((subservice, index) => (
              <TableCell className="px-6 py-3 whitespace-nowrap text-sm font-bold" key={index}>
                €{subservice.price.toFixed(2)}/{subservice.unit}
              </TableCell>
            ))}
            <TableCell className="w-2">{!expandedItem ? <ChevronDown /> : <ChevronUp />}</TableCell>
          </TableRow>
          {expandedItem &&
            service.subcontractors.map((subcontractor, index) => (
              <TableRow key={index} className="rounded-md">
                <TableCell className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 rounded-md">
                  {subcontractor.name}
                </TableCell>
                {subcontractor.prices.map((price, priceIndex) => (
                  <TableCell className=" px-6 py-3 whitespace-nowrap text-sm rounded-md" key={priceIndex}>
                    €{price.toFixed(2)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
