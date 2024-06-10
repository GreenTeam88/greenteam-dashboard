//@ts-nocheck
'use client';

import React from 'react';
import Select from 'react-select';

import { cn } from '@/lib/utils';
import { Option } from '@/types';

interface ICustomMultiSelect {
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

export default function CustomMultiSelect({
  data,
  placeholder,
  setData,
  inputClassName,
  placeholderClassName,
  selectMenuClassName,
  menuListClassName,
  menuListActiveClassName,
  menuListHoverClassName,
}: ICustomMultiSelect) {
  return (
    <Select
      classNames={{
        control: (state) => cn('!ring-transparent !cursor-pointer !outline-transparent !shadow-none', inputClassName),
        valueContainer: (state) => cn('!p-0'),
        indicatorSeparator: (state) => cn('!h-0 !w-0'),
        dropdownIndicator: (state) => cn('!p-0 !h-4 !w-4 !m-0 !text-textBlack !font-[400]'),
        placeholder: (state) => cn(placeholderClassName),
        menu: (state) => cn(selectMenuClassName),
      }}
      theme={(theme) => ({
        ...theme,
        borderRadius: 0,
        colors: {
          ...theme.colors,
          primary25: '#F3F7F5',
          primary: 'black',
        },
      })}
      id="selectbox"
      instanceId="selectboxitem"
      placeholder={placeholder}
      className={'!m-0'}
      closeMenuOnSelect={false}
      defaultValue={[]}
      isMulti
      onChange={(selectedOptions) => {
        setData(selectedOptions);
      }}
      options={data}
    />
  );
}
