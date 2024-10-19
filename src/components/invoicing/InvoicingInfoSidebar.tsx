import * as React from 'react';

import { CustomToolTip } from '@/components/custom/CustomToolTip';
import InfoSidebar from '@/components/InfoSidebar';
import { Invoice, SidebarDataType } from '@/types'; // , Subcontractor

interface InvoicingInfoSidebarProps {
  data: SidebarDataType<Invoice>;
}

export default function InvoicingInfoSidebar({ data }: InvoicingInfoSidebarProps) {
  type DataKeyType = keyof typeof data;
  return (
    <InfoSidebar text={'Invoicing'}>
      <InfoSidebar.SidebarHeader title={'Invoicing details'} />
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
