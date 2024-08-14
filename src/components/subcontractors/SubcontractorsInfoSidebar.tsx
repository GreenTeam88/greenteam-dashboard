'use client';

import * as React from 'react';

import { CustomToolTip } from '@/components/custom/CustomToolTip';
import InfoSidebar from '@/components/InfoSidebar';
import { Subcontractor } from '@/types';

type DataType = {
  [key in keyof Subcontractor]: {
    text: string;
    value: string;
  };
};

interface SubcontractorsInfoSidebarProps {
  data: DataType;
}

export default function SubcontractorsInfoSidebar({ data }: SubcontractorsInfoSidebarProps) {
  type DataKeyType = keyof typeof data;

  return (
    <InfoSidebar text={'subcontractor'} onDelete={() => console.log('Subcontractor deleted!')}>
      <InfoSidebar.SidebarHeader title={'Subcontractor details'} />
      <InfoSidebar.SidebarContent>
        {Object.keys(data).map((key) => {
          const dataKey = key as DataKeyType;
          return (
            data[dataKey] && (
              <InfoSidebar.SidebarContentItemDivider key={dataKey}>
                <h5 className={'text-textBlack font-semibold text-base leading-5'}>{data[dataKey].text}</h5>
                <CustomToolTip
                  triggerClassName={'text-textBlack text-base leading-5'}
                  text={data[dataKey].value}
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
