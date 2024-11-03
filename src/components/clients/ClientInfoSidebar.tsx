'use client';

import * as React from 'react';

import { CustomToolTip } from '@/components/custom/CustomToolTip';
import InfoSidebar from '@/components/InfoSidebar';
import { Client } from '@/types';

interface ClientInfoSidebarProps {
  id: number;
  data: Omit<Client, 'id'>;
}

export default function ClientInfoSidebar({ data }: ClientInfoSidebarProps) {
  type DataKeyType = keyof typeof data;

  // Helper function to format camelCase text to Regular Case
  function formatCamelCaseText(text: string): string {
    // Insert a space before all caps and capitalize the first letter
    return text
      .replace(/([A-Z])/g, ' $1') // Puts a space before each uppercase letter
      .replace(/^./, (str) => str.toUpperCase()); // Capitalizes the first character
  }

  return (
    <InfoSidebar text={'client'} onDelete={() => console.log('Client deleted!')}>
      <InfoSidebar.SidebarHeader title={'Client Details'} />
      <InfoSidebar.SidebarContent>
        {Object.keys(data)
          .filter((key) => key !== 'id') // Exclude 'id' from the keys
          .map((key) => {
            const dataKey = key as DataKeyType;
            const tooltipText = data[dataKey];
            return (
              tooltipText !== undefined && (
                <InfoSidebar.SidebarContentItemDivider key={dataKey}>
                  <h5 className={'text-textBlack font-semibold text-base leading-5'}>{formatCamelCaseText(key)}</h5>
                  <CustomToolTip
                    triggerClassName={'text-textBlack text-base leading-5'}
                    text={tooltipText}
                    limit={20}
                  />
                </InfoSidebar.SidebarContentItemDivider>
              )
            );
          })}
      </InfoSidebar.SidebarContent>
    </InfoSidebar>
  );
}
