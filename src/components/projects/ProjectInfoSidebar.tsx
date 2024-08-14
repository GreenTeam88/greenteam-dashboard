'use client';

import * as React from 'react';

import { CustomToolTip } from '@/components/custom/CustomToolTip';
import InfoSidebar from '@/components/InfoSidebar';
import { Project } from '@/types';

interface ProjectInfoSidebarProps {
  id: number;
  data: Omit<Project, 'id'>;
}
export default function ProjectInfoSidebar({ data }: ProjectInfoSidebarProps) {
  function statusColor(status: Project['Status']) {
    switch (status) {
      case 'FINISHED':
        return 'text-statusSuccess border-statusSuccess';
      case 'APPROVED':
        return 'text-statusInfo border-statusInfo';
      case 'PENDING':
        return 'text-statusDanger border-statusDanger';
      case 'ON HOLD':
        return 'text-statusOrange border-statusOrange';
      case 'DECLINED':
        return 'text-statusRed border-statusRed';
    }
  }
  // console.log(data);
  return (
    <InfoSidebar text={'project'} onDelete={() => console.log('Project deleted!')}>
      <InfoSidebar.SidebarHeader title={'Project details'} />
      <InfoSidebar.SidebarContent>
        <div className={'flex flex-col'}>
          {Object.keys(data).map((key) => {
            return (
              <InfoSidebar.SidebarContentItemDivider key={key}>
                <h5 className={'text-textBlack font-semibold text-base leading-5'}>{key}</h5>
                {key === 'Status' ? (
                  <div
                    className={`py-[3px] flex justify-center items-center font-[600] text-sm rounded-full px-3 border ${statusColor(data[key])}`}
                  >
                    {data[key]}
                  </div>
                ) : (
                  // @ts-expect-error text => string
                  <CustomToolTip triggerClassName={'text-textBlack text-base leading-5'} text={data[key]} limit={20} />
                )}
              </InfoSidebar.SidebarContentItemDivider>
            );
          })}
        </div>
      </InfoSidebar.SidebarContent>
    </InfoSidebar>
  );
}
