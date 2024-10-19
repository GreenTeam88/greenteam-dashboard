import * as React from 'react';

import { CustomToolTip } from '@/components/custom/CustomToolTip';
import InfoSidebar from '@/components/InfoSidebar';
import { FaqQuestion } from '@/types';

interface QuestionInfoSidebarProps {
  id: number;
  data: Omit<FaqQuestion, 'id'>;
}

export default function QuestionInfoSidebar({ data }: QuestionInfoSidebarProps) {
  return (
    <InfoSidebar text={'question'} onDelete={() => console.log('Question deleted!')}>
      <InfoSidebar.SidebarHeader title={'Question details'} />
      <InfoSidebar.SidebarContent>
        {Object.keys(data).map((key) => {
          return (
            <InfoSidebar.SidebarContentItemDivider key={key}>
              <h5 className={'text-textBlack font-semibold text-base leading-5'}>{key}</h5>
              {/*@ts-expect-error text => string*/}
              <CustomToolTip triggerClassName={'text-textBlack text-base leading-5'} text={data[key]} limit={20} />
            </InfoSidebar.SidebarContentItemDivider>
          );
        })}
      </InfoSidebar.SidebarContent>
    </InfoSidebar>
  );
}
// removed id from props
