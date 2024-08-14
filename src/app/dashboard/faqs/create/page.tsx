'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import CreateButton from '@/components/custom/CreateButton';
import FormComboboxGetter from '@/components/custom/FormComboboxGetter';
import FormInputDataGetter from '@/components/custom/FormInputDataGetter';
import FormTextareaGetter from '@/components/custom/FormTextareaGetter';
import { Form } from '@/components/ui/form';
import { Option } from '@/types';

const questionCreateSchema = z.object({
  category: z.string(),
  question: z.string(),
  answer: z.string(),
});
export default function Home() {
  const categories: Option[] = [
    { value: 'category1', label: 'Category 1' },
    { value: 'category2', label: 'Category 2' },
    { value: 'category3', label: 'Category 3' },
  ];

  const form = useForm<z.infer<typeof questionCreateSchema>>({
    resolver: zodResolver(questionCreateSchema),
  });
  const onInvalid = (errors: any) => console.error(errors);
  function onSubmit(values: z.infer<typeof questionCreateSchema>) {
    console.log(values);
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="bg-bgLightGreen w-full h-full p-5">
        <div className={'w-[655px] max-w-[90%] gap-y-6 flex flex-col'}>
          <div className={'flex justify-between'}>
            <Link
              href={'/dashboard/faqs'}
              className="text-2xl flex items-center gap-x-2 leading-6 font-semibold text-textBlackNew"
            >
              <ArrowLeft />
              FAQ
            </Link>
            <CreateButton type={'submit'}>Save</CreateButton>
          </div>
          <div className={'flex flex-col p-6 gap-y-4 bg-white rounded-lg border border-borderBlack10'}>
            <FormComboboxGetter
              data={categories}
              form={form}
              name={'category'}
              label={'Category'}
              placeholder={'Choose category'}
              notFoundText={'Category not found'}
            />
            <FormInputDataGetter form={form} name={'question'} label={'Question'} placeholder={'Enter question'} />
            <FormTextareaGetter form={form} name={'answer'} label={'Answer'} placeholder={'Input your answer'} />
          </div>
        </div>
      </form>
    </Form>
  );
}
