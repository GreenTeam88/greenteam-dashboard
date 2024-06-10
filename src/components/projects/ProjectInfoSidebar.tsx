'use client';

import { X } from 'lucide-react';
import * as React from 'react';

import { CustomToolTip } from '@/components/custom/CustomToolTip';
import { Button } from '@/components/ui/button';
import { closeModal } from '@/store/ModalStore';
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
    <aside className={'absolute bg-white h-full w-[400px] right-0 flex flex-col'}>
      <div className={'py-5 px-10 flex justify-between items-center border-b border-b-borderBlack10'}>
        <h4 className={'text-xl leading-6'}>Project details</h4>
        <X onClick={closeModal} className={'cursor-pointer'} />
      </div>
      <div className={'flex flex-col py-6 px-10 gap-y-6 overflow-y-auto'}>
        <div className={'flex flex-col'}>
          {Object.keys(data).map((key) => {
            return (
              <div key={key} className={'flex justify-between items-center py-6 border-b border-b-borderBlack10'}>
                <h5 className={'text-textBlack font-semibold text-base leading-5'}>{key}</h5>
                {key === 'Status' ? (
                  <div
                    className={`py-[3px] flex justify-center items-center font-[600] text-sm rounded-full px-3 border ${statusColor(data[key])}`}
                  >
                    {data[key]}
                  </div>
                ) : (
                  // @ts-ignore
                  <CustomToolTip triggerClassName={'text-textBlack text-base leading-5'} text={data[key]} limit={20} />
                )}
              </div>
            );
          })}
        </div>
        <div className={'grid grid-cols-2 gap-x-4 items-center justify-between'}>
          <Button
            className={'py-2.5 px-5 text-sm border rounded-lg border-borderSecondaryOrange text-textSecondaryOrange'}
          >
            Delete project
          </Button>
          <Button className={'py-2.5 px-5 text-sm border rounded-lg text-textBlack border-borderBlack10'}>
            Edit project
          </Button>
        </div>
      </div>
    </aside>
  );
}
