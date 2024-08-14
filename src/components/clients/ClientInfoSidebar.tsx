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

  return (
    <InfoSidebar text={'client'} onDelete={() => console.log('Client deleted!')}>
      <InfoSidebar.SidebarHeader title={'Client details'} />
      <InfoSidebar.SidebarContent>
        {Object.keys(data).map((key) => {
          const dataKey = key as DataKeyType;
          return (
            data[dataKey] && (
              <InfoSidebar.SidebarContentItemDivider key={dataKey}>
                <h5 className={'text-textBlack font-semibold text-base leading-5'}>{key}</h5>
                <CustomToolTip
                  triggerClassName={'text-textBlack text-base leading-5'}
                  text={data[dataKey]}
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
