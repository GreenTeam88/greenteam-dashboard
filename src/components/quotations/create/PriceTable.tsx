import { nanoid } from 'nanoid';
import { useState } from 'react';
import { useWatch } from 'react-hook-form';
import { FiTrash2 } from 'react-icons/fi';

import CustomInput from '@/components/custom/CustomInput';
import { CustomSelect } from '@/components/custom/CustomSelect';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { QuotationPrice } from '@/types';

type priceKey = Exclude<keyof QuotationPrice, 'id'>;

function PriceTableCounter() {
  return (
    <div className={'flex w-full rounded-lg border border-borderGray'}>
      <button type={'button'} className={'bg-bgLightGreen py-3 px-5 rounded-l-lg'}>
        -
      </button>
      <div className={'bg-white py-3 px-5'}>1</div>
      <button type={'button'} className={'bg-bgLightGreen py-3 px-5 rounded-r-lg'}>
        +
      </button>
    </div>
  );
}

function PriceTableDescription() {
  return (
    <CustomInput
      className={
        'h-auto w-full !ring-transparent border border-borderGray rounded-lg py-3 px-5 text-sm text-textBlackNew'
      }
      type={'text'}
      placeholder={'No description'}
    />
  );
}
function PriceTablePriceCell() {
  return (
    <CustomInput
      className={
        'h-auto w-full !ring-transparent border border-borderGray rounded-lg py-3 px-5 text-sm text-textBlackNew'
      }
      type={'text'}
      value={'0'}
      placeholder={'No description'}
    />
  );
}
function PriceTableDiscountCell() {
  return (
    <div className={'flex w-full border border-borderGray rounded-lg'}>
      <CustomInput
        className={
          '!h-auto !ring-transparent rounded-l-lg !ring-0 !ring-offset-0 w-fit !border-0 py-3 px-5 text-sm text-textBlackNew'
        }
        type={'text'}
        value={'25'}
        placeholder={'No description'}
      />
      <div className={'py-3 px-2 border-l border-l-borderGray bg-bgLightGreen rounded-r-lg'}>%</div>
    </div>
  );
}
function PriceTableTaxCell() {
  const data = [
    { value: '0%', label: '0%' },
    { value: '6%', label: '6%' },
    { value: '9%', label: '9%' },
    { value: '21%', label: '21%' },
  ];
  return (
    <CustomSelect
      itemActiveClassName={'bg-bgLightGreen'}
      triggerClassName={'!ring-transparent !outline-transparent w-full py-3 px-5 h-auto'}
      contentClassName={'bg-white'}
      data={data}
    />
  );
}
function RenderPriceTableCell({ priceKey, priceRow }: { priceKey: priceKey; priceRow: QuotationPrice }) {
  if (priceKey === 'quantity') {
    return <PriceTableCounter />;
  }
  if (priceKey === 'description') {
    return <PriceTableDescription />;
  }
  if (priceKey === 'price') {
    return <PriceTablePriceCell />;
  }
  if (priceKey === 'discount') {
    return <PriceTableDiscountCell />;
  }
  if (priceKey === 'tax') {
    return <PriceTableTaxCell />;
  }
  return <p className={'text-right text-sm text-textBlackNew '}>€{priceRow[priceKey]}</p>;
}

export default function PriceTable({ form }: { form: any }) {
  const title = ['RubbishBin', 'Quantity', 'Description', 'Price', 'Discount', 'Tax(BTW)', 'Price incl. Tax (BTW)'];
  // const [quotationPrices, setQuotationPrices] = useState<QuotationPrice[]>([]);
  const quotationPrices: QuotationPrice[] = useWatch({
    control: form.control,
    name: 'quotationPrices',
  });
  console.log(quotationPrices);

  function handleAddRow() {
    form.setValue('quotationPrices', [
      ...quotationPrices,
      {
        id: nanoid(),
        quantity: 0,
        description: '',
        price: 0,
        discount: 0,
        tax: 0,
        priceInclTax: 0,
      },
    ]);
  }

  function handleDeleteRow(id: string) {
    const newQuotationPrices = quotationPrices.filter((price) => price.id !== id);
    form.setValue('quotationPrices', newQuotationPrices);
  }

  return (
    <div className={'w-full border border-borderBlack10 rounded-lg flex flex-col'}>
      <div className={'bg-white rounded-lg'}>
        <div className={'flex h-16 items-center justify-between rounded-t-lg border-b border-b-borderGray'}>
          {title.map((t) => {
            return (
              <h5
                key={t}
                className={cn(
                  'text-sm font-semibold text-textBlackNew flex-1',
                  t === 'Description' && 'flex-[2]',
                  t === 'RubbishBin' && 'flex-[0.5]'
                )}
              >
                {t !== 'RubbishBin' ? t : ' '}
              </h5>
            );
          })}
        </div>
        <div>
          {quotationPrices.map((price, index) => {
            return (
              <div key={price.id} className={'border-b border-b-borderGray h-16 flex items-center justify-between'}>
                <div className={'flex-[0.5] flex items-center justify-center'}>
                  <FiTrash2
                    onClick={() => handleDeleteRow(price.id)}
                    size={16}
                    className={'text-textSecondaryOrange cursor-pointer'}
                  />
                </div>
                {Object.keys(price).map((pKey) => {
                  const priceKey = pKey as priceKey;
                  return (
                    pKey !== 'id' && (
                      <div className={cn('flex-1 py-2 px-3', pKey === 'description' && 'flex-[2]')} key={priceKey}>
                        <RenderPriceTableCell priceKey={priceKey} priceRow={price} />
                      </div>
                    )
                  );
                })}
              </div>
            );
          })}
        </div>
        <div className={'w-full h-16 flex items-center justify-center px-3'}>
          <Button
            onClick={handleAddRow}
            type={'button'}
            className={
              'text-sm flex-1 text-textSecondaryOrange rounded-lg border border-borderSecondaryOrange py-2.5 px-5'
            }
          >
            Add new row
          </Button>
        </div>
      </div>
    </div>
  );
}
