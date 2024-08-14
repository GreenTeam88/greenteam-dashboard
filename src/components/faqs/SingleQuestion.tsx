'use client';

import { SquarePen, Trash2 } from 'lucide-react';
import { useState } from 'react';
import * as React from 'react';

import CustomAccordion from '@/components/custom/CustomAccordion';
import QuestionInfoSidebar from '@/components/faqs/QuestionInfoSidebar';
import { cn } from '@/lib/utils';
import useModalStore from '@/store/ModalStore';
import { FaqQuestion } from '@/types';

interface SingleQuestionProps {
  question: FaqQuestion;
}

interface SingleQuestionIconsProps {
  data: FaqQuestion;
}

function SingleQuestionIcons({ data }: SingleQuestionIconsProps) {
  const { openModal } = useModalStore();
  const { id, ...rest } = data;
  return (
    <div className={'flex gap-x-4 items-center'}>
      <SquarePen
        onClick={() => openModal(<QuestionInfoSidebar id={id} data={rest} />)}
        size={16}
        className={'text-textGreenPrimary cursor-pointer'}
      />
      <Trash2 size={16} className={'text-textSecondaryOrange'} />
    </div>
  );
}

export default function SingleQuestion({ question }: SingleQuestionProps) {
  const [active, setActive] = useState(false);
  return (
    <CustomAccordion
      customIcons={<SingleQuestionIcons data={question} />}
      onChange={setActive}
      value={`question-${question.id}`}
      itemClassName={'py-5'}
      triggerClassName={cn(
        '!no-underline p-0 text-textBlackNew font-semibold text-[1.125rem] leading-6',
        active && 'text-textGreenPrimary'
      )}
      contentClassName={'text-textBlackNew text-base leading-5 p-0 pt-4'}
      triggerText={question.question}
      contentText={question.answer}
    />
  );
}
