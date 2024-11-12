'use client';

// import CustomMultiSelect from '@/components/custom/CustomMultiSelect';
import ShadcnCustomMultiSelect from '@/components/custom/ShadcnCustomMultiSelect';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

// import MultiSelectFormField from '@/components/ui/multi-select';

interface HousePartsGetterProps {
  housePartData: { value: string; label: string }[];
  form: any;
}

export default function HousePartsGetter({ housePartData, form }: HousePartsGetterProps) {
  return (
    <FormField
      control={form.control}
      name={'houseParts'}
      render={({ field }) => (
        <FormItem className={'flex flex-col gap-y-[0.875rem]'}>
          <FormLabel className={'font-normal text-textBlack80 text-sm'}>Parts of a house</FormLabel>
          <FormControl>
            <ShadcnCustomMultiSelect
              btnClassName={
                '!m-0 w-full text-sm text-textBlack font-[400] border-borderGray rounded-lg py-3 px-5 h-auto'
              }
              placeholderClassName={'!m-0'}
              menuListItemsClassName={'text-sm'}
              menuClassName={'w-[300px] bg-white'}
              placeholder={'Parts of a house'}
              data={housePartData}
              value={field.value}
              setValue={(value) => {
                form.setValue('houseParts', value);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
