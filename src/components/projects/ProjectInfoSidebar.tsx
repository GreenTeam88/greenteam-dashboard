'use client';

import * as React from 'react';

import { CustomToolTip } from '@/components/custom/CustomToolTip';
import ProjectBar from '@/components/projects/ProjectBar';
import { Project } from '@/types';

interface ProjectInfoSidebarProps {
  id: number;
  data: Omit<Project, 'id'>;
}

export default function ProjectInfoSidebar({ data }: ProjectInfoSidebarProps) {
  // Helper function to format camelCase text to Regular Case
  function formatCamelCaseText(text: string): string {
    return text
      .replace(/([A-Z])/g, ' $1') // Puts a space before each uppercase letter
      .replace(/^./, (str) => str.toUpperCase()); // Capitalizes the first character
  }

  function statusColor(status: Project['Status']) {
    switch (status) {
      case 'Finished':
        return 'text-statusSuccess border-statusSuccess';
      case 'Approved':
        return 'text-statusInfo border-statusInfo';
      case 'Pending':
        return 'text-statusDanger border-statusDanger';
      case 'On Hold':
        return 'text-statusOrange border-statusOrange';
      case 'Declined':
        return 'text-statusRed border-statusRed';
    }
  }

  // Create a new object that excludes the `id` field and ensures correct typing
  const filteredData = Object.fromEntries(Object.entries(data).filter(([key]) => key !== 'id')) as Omit<Project, 'id'>;

  return (
    <ProjectBar text={'project'} onDelete={() => console.log('Project deleted!')}>
      <ProjectBar.SidebarHeader title={'Project details'} />
      <ProjectBar.SidebarContent>
        <div className={'flex flex-col'}>
          {Object.keys(filteredData).map((key) => {
            const typedKey = key as keyof typeof filteredData;
            const value = filteredData[typedKey];

            return (
              <ProjectBar.SidebarContentItemDivider key={typedKey}>
                <h5 className={'text-textBlack font-semibold text-base leading-5'}>{formatCamelCaseText(typedKey)}</h5>
                {typedKey === 'Status' ? (
                  <div
                    className={`py-[3px] flex justify-center items-center font-[600] text-sm rounded-full px-3 border ${statusColor(
                      value as Project['Status']
                    )}`}
                  >
                    {value}
                  </div>
                ) : Array.isArray(value) ? (
                  // If the value is an array, display the first two items with a tooltip showing all items
                  <CustomToolTip
                    triggerClassName="text-textBlack text-base leading-5"
                    text={value.join(', ')} // Pass the entire array as a single string
                    limit={20}
                  />
                ) : (
                  // If the value is not an array, display as text with tooltip
                  <CustomToolTip
                    triggerClassName={'text-textBlack text-base leading-5'}
                    text={value as string}
                    limit={20}
                  />
                )}
              </ProjectBar.SidebarContentItemDivider>
            );
          })}
        </div>
      </ProjectBar.SidebarContent>
    </ProjectBar>
  );
}
