'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import FormDateGetter from '@/components/custom/FormDateGetter';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Form } from '@/components/ui/form';
import { cn } from '@/lib/utils';
import { closeModal } from '@/store/ModalStore';

const invoicingExportFormSchema = z
  .object({
    fromDate: z.string(),
    toDate: z.string(),
    customDate: z.string(),
    exportType: z.string(),
  })
  .superRefine((arg, ctx) => {
    if (!arg.fromDate && !arg.toDate && !arg.customDate) {
      ctx.addIssue({
        message: 'Please select a date range',
        code: z.ZodIssueCode.custom,
        path: ['fromDate'],
      });
    }
    if (!arg.exportType) {
      ctx.addIssue({
        message: 'Please select a file format',
        code: z.ZodIssueCode.custom,
        path: ['exportType'],
      });
    }
    return z.NEVER;
  });

export default function InvoicingExportSidebar() {
  const [errorObj, setErrorObj] = React.useState<any>({});
  const customDateChoices = [
    { label: 'Last year', value: 'last-year' },
    { label: 'Last 6 months', value: 'last-6-months' },
    { label: 'Last 1 month', value: 'last-1-month' },
    { label: 'Last 2 weeks', value: 'last-2-weeks' },
    { label: 'Last week', value: 'last-week' },
    { label: 'Last 3 days', value: 'last-3-days' },
  ];
  const fileFormatChoices = [
    { label: 'PDF', value: 'pdf' },
    { label: 'Excel', value: 'xlsx' },
  ];
  const form = useForm<z.infer<typeof invoicingExportFormSchema>>({
    resolver: zodResolver(invoicingExportFormSchema),
    defaultValues: {
      fromDate: '',
      toDate: '',
      customDate: '',
      exportType: 'pdf',
    },
  });
  const customDate = useWatch({
    control: form.control,
    name: 'customDate',
  });
  const exportType = useWatch({
    control: form.control,
    name: 'exportType',
  });
  const onSubmit = (data: z.infer<typeof invoicingExportFormSchema>) => {
    console.log(data);
  };
  const onInvalid = (error: any) => {
    setErrorObj(error);
    console.error(error);
  };
  return (
    <aside className={'absolute bg-white h-full w-[500px] right-0 flex flex-col'}>
      <div className={'py-5 px-10 flex justify-between items-center border-b border-b-borderBlack10'}>
        <h4 className={'text-xl leading-6'}>Export</h4>
        <X onClick={closeModal} className={'cursor-pointer'} />
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className={'h-full flex flex-col  py-6 px-10 gap-y-6 overflow-y-auto'}
        >
          <div className={'flex flex-1 flex-col gap-y-4'}>
            <div className={'grid grid-cols-2 gap-x-4'}>
              <FormDateGetter form={form} name={'fromDate'} placeholder={'From Date'} label={'From'} />
              <FormDateGetter form={form} name={'toDate'} placeholder={'To Date'} label={'To'} />
            </div>
            <div className={'flex flex-wrap gap-3'}>
              {customDateChoices.map((dateChoice) => {
                return (
                  <div
                    key={dateChoice.value}
                    className={cn(
                      'py-2 px-3 flex items-center gap-x-2',
                      customDate === dateChoice.value && 'bg-bgLightGreen'
                    )}
                  >
                    <Checkbox
                      indicatorClassname={'bg-bgPrimaryGreen'}
                      iconClassname={'text-white'}
                      checked={customDate === dateChoice.value}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          form.setValue('customDate', dateChoice.value);
                        } else {
                          form.setValue('customDate', '');
                        }
                      }}
                      name={'dateChoiceCheckbox'}
                      id={dateChoice.value}
                    />
                    <label
                      className={cn(
                        'text-textBlackNew text-sm',
                        customDate === dateChoice.value && 'font-medium text-textGreenPrimary'
                      )}
                      htmlFor={dateChoice.value}
                    >
                      {dateChoice.label}
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
          <div className={'flex flex-col gap-y-4'}>
            <div className={'flex flex-col gap-y-2'}>
              <div className={'flex items-center gap-x-2'}>
                {fileFormatChoices.map((fileChoice) => {
                  return (
                    <div
                      key={fileChoice.value}
                      className={cn(
                        'w-[40%] py-2 px-3 flex items-center gap-x-2',
                        exportType === fileChoice.value && 'bg-bgLightGreen'
                      )}
                    >
                      <Checkbox
                        indicatorClassname={'bg-bgPrimaryGreen'}
                        iconClassname={'text-white'}
                        checked={exportType === fileChoice.value}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            form.setValue('exportType', fileChoice.value);
                          } else {
                            form.setValue('exportType', '');
                          }
                        }}
                        name={'dateChoiceCheckbox'}
                        id={fileChoice.value}
                      />
                      <label
                        className={cn(
                          'text-textBlackNew text-sm',
                          exportType === fileChoice.value && 'font-medium text-textGreenPrimary'
                        )}
                        htmlFor={fileChoice.value}
                      >
                        {fileChoice.label}
                      </label>
                    </div>
                  );
                })}
              </div>
              {errorObj.exportType && <p className={'text-sm font-medium'}>{errorObj.exportType.message}</p>}
            </div>
            <div className={'grid grid-cols-2 gap-x-4 items-center justify-between'}>
              <Button
                onClick={() => closeModal()}
                className={'py-2.5 px-5 text-sm border rounded-lg border-borderBlack10 text-textBlack'}
              >
                Cancel
              </Button>
              <Button
                type={'submit'}
                className={'bg-bgSecondaryOrange py-2.5 px-5 text-sm border rounded-lg text-white border-borderBlack10'}
              >
                Export
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </aside>
  );
}
