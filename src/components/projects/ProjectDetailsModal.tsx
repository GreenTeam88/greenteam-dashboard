import React from 'react';

import { Project } from '@/components/custom/DataTable';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

interface ProjectDetailsProps {
  trigger: React.ReactNode;
  singleProjectData: Project;
}

function ModalContent({ data }: { data: Project }) {
  return (
    <DialogContent
      className={
        'absolute block left-[unset] p-0 !rounded-none translate-x-0 translate-y-0 top-0 translate-none right-0 bg-white max-w-[500px] h-full w-full'
      }
    >
      <DialogHeader className={'block h-fit'}>
        <DialogTitle className={'py-5 px-10 text-[1.25rem] leading-[1.5rem] font-[400]'}>Project details</DialogTitle>
        <Separator className={'bg-bgBlack10 m-0'} />
      </DialogHeader>
      <main className={'py-6 px-10'}>salam</main>
    </DialogContent>
  );
}

export default function ProjectDetailsModal({ trigger, singleProjectData }: ProjectDetailsProps) {
  console.log('MODAL RENDERED');
  return (
    <Dialog open={true}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <ModalContent data={singleProjectData} />
    </Dialog>
  );
}
