'use client';

import CustomMultiSelect from '@/components/custom/CustomMultiSelect';
import { Option } from '@/types';

interface IProjectCreateMultiSelect {
  data: Option[];
  setData: (data: Option[]) => void;
  placeholder?: string;
  inputClassName?: string;
  placeholderClassName?: string;
  selectMenuClassName?: string;
  menuListHoverClassName?: string;
  menuListActiveClassName?: string;
  menuListClassName?: string;
}
export default function ProjectCreateMultiSelect({ data, setData, placeholder }: IProjectCreateMultiSelect) {
  return (
    <CustomMultiSelect
      inputClassName={
        '!border-borderBlack10 !rounded-lg !py-3 !px-5 !h-auto !text-sm !text-textBlack !font-[400] !w-full'
      }
      placeholderClassName={'!text-textBlack !text-sm !font-[400]'}
      selectMenuClassName={'!border-borderBlack10 !rounded-lg'}
      data={data}
      setData={(options) => {
        setData(options);
      }}
      placeholder={placeholder}
    />
  );
}
