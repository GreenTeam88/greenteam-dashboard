// import CustomCombobox from '@/components/custom/CustomCombobox';
import { QuotationSelect } from '@/components/custom/QuotationSelect';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Quotation } from '@/types';

interface QuotationNumberGetterProps {
  quotations: Quotation[];
  form: any;
}

export function QuotationGetter({ quotations, form }: QuotationNumberGetterProps) {
  return (
    <FormField
      control={form.control}
      name={'quotation'}
      render={({ field }) => (
        <FormItem className={'flex flex-col gap-y-[0.875rem]'}>
          <FormLabel className={'font-normal text-textBlack80 text-sm'}>Quotation</FormLabel>
          <FormControl>
            <QuotationSelect
              itemActiveClassName="bg-bgLightGreenHover font-semibold"
              triggerClassName="!m-0 h-auto w-full !ring-transparent !outline-transparent py-3 px-5 border border-borderGray rounded-lg text-sm text-textBlack"
              contentClassName="bg-white"
              itemClassName="text-sm text-textBlack hover:bg-bgLightGreenHover"
              data={quotations}
              setValue={(value: any) => {
                form.setValue('preferredLanguage', value);
              }}
              value={field.value ?? ''}
              placeholder="Assign quotaion"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
