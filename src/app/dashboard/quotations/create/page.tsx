'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { FiEdit } from 'react-icons/fi';
import { z } from 'zod';

import { ReactComponent as EyeIcon } from '@/assets/icons/eye.svg';
import { ReactComponent as SaveIcon } from '@/assets/icons/save.svg';
import CreateButton from '@/components/custom/CreateButton';
import FormComboboxGetter from '@/components/custom/FormComboboxGetter';
import FormDateGetter from '@/components/custom/FormDateGetter';
import FormInputDataGetter from '@/components/custom/FormInputDataGetter';
import PriceTable from '@/components/quotations/create/PriceTable';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';

const quotationCreateFormSchema = z.object({
  quotationNumber: z.string(),
  reference: z.string(),
  client: z.string(),
  date: z.string(),
  expireDate: z.string(),
  quotationPrices: z.array(
    z.object({
      id: z.string(),
      quantity: z.number(),
      description: z.string(),
      price: z.number(),
      discount: z.number(),
      tax: z.number(),
      priceInclTax: z.number(),
    })
  ),
});

export default function Home() {
  const form = useForm<z.infer<typeof quotationCreateFormSchema>>({
    resolver: zodResolver(quotationCreateFormSchema),
    defaultValues: {
      quotationPrices: [],
    },
  });
  const btns = [
    {
      id: 1,
      icon: <EyeIcon />,
      text: 'Preview',
    },
    {
      id: 2,
      icon: <SaveIcon />,
      text: 'Draft',
    },
  ];
  return (
    <div className={'bg-bgLightGreen w-full h-full p-5'}>
      <Form {...form}>
        <form className={'w-full flex flex-col gap-y-6'}>
          <div className={'flex justify-between items-center'}>
            <div className={'flex items-center gap-x-4'}>
              {btns.map((btn) => {
                return (
                  <Button
                    className={
                      'py-2.5 px-5 gap-x-2.5 flex items-center justify-center rounded-lg border border-borderBlack10'
                    }
                    key={btn.text}
                  >
                    {btn.icon}
                    <span className={'text-sm text-textBlack'}>{btn.text}</span>
                  </Button>
                );
              })}
            </div>
            <CreateButton asChild={true}>
              <Link href={'/'}>Send</Link>
            </CreateButton>
          </div>
          <div className={'p-6 bg-white rounded-lg border flex flex-col gap-y-4 border-borderBlack10'}>
            <h3 className={'text-xl leading-6 text-textDarkBlack'}>Quotation</h3>
            <div className={'flex flex-col gap-y-4'}>
              <div className={'flex gap-x-4 items-end'}>
                <div className={'flex-1'}>
                  <FormComboboxGetter
                    form={form}
                    name={'client'}
                    placeholder={'Choose client'}
                    label={'To'}
                    notFoundText={'Client not found'}
                    data={[{ value: 'elmir', label: 'elmir' }]}
                  />
                </div>
                <Button
                  className={
                    'flex text-sm rounded-lg h-auto text-textBlackNew font-normal gap-x-2.5 items-center justify-center bg-bgLightGreen border border-borderGray py-3 px-5'
                  }
                >
                  Edit client
                  <FiEdit />
                </Button>
              </div>
              <FormInputDataGetter form={form} name={'reference'} placeholder={'Input reference'} label={'Reference'} />
            </div>
            <div className={'grid grid-cols-3 gap-x-4'}>
              <FormInputDataGetter
                form={form}
                name={'quotationNumber'}
                placeholder={'Input quotation number'}
                label={'Quotation number'}
              />
              <FormDateGetter
                btnClassName={'bg-bgLightGreen'}
                form={form}
                name={'date'}
                placeholder={'DD/MM/YYY'}
                label={'Date'}
              />
              <FormDateGetter form={form} name={'expireDate'} placeholder={'DD/MM/YYY'} label={'Expire date'} />
            </div>
          </div>
          <PriceTable form={form} />
        </form>
      </Form>
    </div>
  );
}
