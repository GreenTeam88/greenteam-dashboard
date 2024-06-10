import CustomCombobox from '@/components/custom/CustomCombobox';
import CustomDropzone from '@/components/custom/CustomDropzone';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

interface UploadGetterProps {
  form: any;
}
export default function UploadGetter({ form }: UploadGetterProps) {
  return (
    <FormField
      control={form.control}
      name={'files'}
      render={({ field }) => (
        <FormItem className={'w-full flex flex-col gap-y-[0.875rem]'}>
          <FormControl>
            <CustomDropzone
              files={field.value}
              setFiles={(files) => {
                form.setValue('files', files);
              }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
