import SingleQuestion from '@/components/faqs/SingleQuestion';
import { FaqQuestion } from '@/types';

interface QuestionsContainerProps {
  category: string;
  questions: FaqQuestion[];
}

export default function QuestionsContainer({ category, questions }: QuestionsContainerProps) {
  return (
    <div className={'bg-white px-6 pt-6 flex flex-col gap-y-6 border border-borderGray rounded-lg'}>
      <h4 className={'text-2xl leading-6 font-semibold text-textBlackNew'}>{category}</h4>
      <div className={'flex flex-col'}>
        {questions.map((question) => {
          return <SingleQuestion question={question} key={question.id} />;
        })}
      </div>
    </div>
  );
}
