'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

import CreateButton from '@/components/custom/CreateButton';
import QuestionsContainer from '@/components/faqs/QuestionsContainer';
import { FaqQuestions } from '@/mockDatas/faqPage';
import { FaqQuestion } from '@/types';

type QuestionsObj = {
  [key: string]: FaqQuestion[];
};

export default function Home() {
  const [questionsObj, setQuestionsObj] = useState<QuestionsObj>({});

  useEffect(() => {
    const obj: QuestionsObj = {};
    FaqQuestions.forEach((question) => {
      const { category, ...rest } = question;
      if (!obj[category]) {
        obj[category] = [question];
      } else {
        obj[category].push(question);
      }
    });
    setQuestionsObj(obj);
  }, []);

  return (
    <div className="bg-bgLightGreen w-full h-full p-5">
      <div className="flex justify-end">
        <CreateButton asChild={true}>
          <Link href={'/dashboard/faqs/create'}>Create question</Link>
        </CreateButton>
      </div>
      <div className={'flex flex-col gap-y-6 mt-6'}>
        {Object.keys(questionsObj).map((category) => (
          <QuestionsContainer key={category} category={category} questions={questionsObj[category]} />
        ))}
      </div>
    </div>
  );
}
