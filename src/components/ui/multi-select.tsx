import { cva } from 'class-variance-authority';
import { CheckIcon, ChevronDown, WandSparkles, XIcon } from 'lucide-react'; // removed XCircle
import * as React from 'react';

// import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

import type { VariantProps } from 'class-variance-authority';

const multiSelectVariants = cva(
  'm-1 transition ease-in-out delay-150 hover:-translate-y-1 hover:scale-110 duration-300',
  {
    variants: {
      variant: {
        default: 'border-foreground/10 drop-shadow-md text-foreground bg-card hover:bg-card/80',
        secondary: 'border-foreground/10 bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80',
        inverted: 'inverted',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface MultiSelectFormFieldProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof multiSelectVariants> {
  asChild?: boolean;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  defaultValue?: string[];
  disabled?: boolean;
  placeholder: string;
  btnClassName?: string;
  menuClassName?: string;
  placeholderClassName?: string;
  menuListItemsClassName?: string;
  animation?: number;
  onValueChange: (value: string[]) => void;
}

const MultiSelectFormField = React.forwardRef<HTMLButtonElement, MultiSelectFormFieldProps>(
  (
    {
      btnClassName,
      menuClassName,
      placeholderClassName,
      menuListItemsClassName,
      // variant,
      // asChild = false,
      options,
      defaultValue,
      onValueChange,
      // disabled,
      placeholder,
      animation = 0,
      ...props
    },
    ref
  ) => {
    const [selectedValues, setSelectedValues] = React.useState<string[]>(defaultValue || []);
    const selectedValuesSet = React.useRef(new Set(selectedValues));
    const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(animation > 0);

    React.useEffect(() => {
      setSelectedValues(defaultValue || []);
      selectedValuesSet.current = new Set(defaultValue);
    }, [defaultValue]);

    const handleInputKeyDown = (event: any) => {
      if (event.key === 'Enter') {
        setIsPopoverOpen(true);
      } else if (event.key === 'Backspace' && !event.target.value) {
        selectedValues.pop();
        setSelectedValues([...selectedValues]);
        selectedValuesSet.current.delete(selectedValues[selectedValues.length - 1]);
        onValueChange([...selectedValues]);
      }
    };

    const toggleOption = (value: string) => {
      if (selectedValuesSet.current.has(value)) {
        selectedValuesSet.current.delete(value);
        setSelectedValues(selectedValues.filter((v) => v !== value));
      } else {
        selectedValuesSet.current.add(value);
        setSelectedValues([...selectedValues, value]);
      }
      onValueChange(Array.from(selectedValuesSet.current));
    };

    return (
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={ref}
            {...props}
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
            className={cn(
              'flex w-full p-1 rounded-md border min-h-10 h-auto items-center justify-between bg-inherit hover:bg-card',
              btnClassName
            )}
          >
            {selectedValues.length > 0 ? (
              <div className="flex justify-between items-center w-full">
                <div className="flex flex-wrap items-center overflow-hidden text-sm">
                  {selectedValues.join(', ')}
                  {/*{selectedValues.map((value) => {*/}
                  {/*  const option = options.find((o) => o.value === value);*/}
                  {/*  const IconComponent = option?.icon;*/}
                  {/*  return (*/}
                  {/*    <Badge*/}
                  {/*      key={value}*/}
                  {/*      className={cn(isAnimating ? 'animate-bounce' : '', multiSelectVariants({ variant }))}*/}
                  {/*      style={{*/}
                  {/*        animationDuration: `${animation}s`,*/}
                  {/*      }}*/}
                  {/*    >*/}
                  {/*      {IconComponent && <IconComponent className="h-4 w-4 mr-2" />}*/}
                  {/*      {option?.label}*/}
                  {/*      <XCircle*/}
                  {/*        className="ml-2 h-4 w-4 cursor-pointer"*/}
                  {/*        onClick={(event) => {*/}
                  {/*          event.stopPropagation();*/}
                  {/*          toggleOption(value);*/}
                  {/*        }}*/}
                  {/*      />*/}
                  {/*    </Badge>*/}
                  {/*  );*/}
                  {/*})}*/}
                </div>
                <div className="flex items-center justify-between">
                  <XIcon
                    className="h-4 ml-2 cursor-pointer text-muted-foreground"
                    onClick={(event) => {
                      setSelectedValues([]);
                      selectedValuesSet.current.clear();
                      onValueChange([]);
                      event.stopPropagation();
                    }}
                  />
                  <Separator orientation="vertical" className="flex min-h-6 h-full" />
                  <ChevronDown className="h-4 ml-2 cursor-pointer text-muted-foreground" />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full mx-auto">
                <span className={cn('text-sm text-muted-foreground mx-3', placeholderClassName)}>{placeholder}</span>
                <ChevronDown className="h-4 cursor-pointer text-muted-foreground ml-2" />
              </div>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className={cn('w-[200px] p-0 drop-shadow-sm', menuClassName)}
          align="start"
          onEscapeKeyDown={() => setIsPopoverOpen(false)}
        >
          <Command>
            <CommandInput placeholder="Search..." onKeyDown={handleInputKeyDown} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedValuesSet.current.has(option.value);
                  return (
                    <CommandItem
                      key={option.value}
                      onSelect={() => toggleOption(option.value)}
                      style={{
                        pointerEvents: 'auto',
                        opacity: 1,
                      }}
                      className={cn(
                        'cursor-pointer',
                        'hover:bg-bgBlack5',
                        menuListItemsClassName,
                        isSelected ? 'bg-bgLightGreen font-medium text-textGreenPrimary' : ''
                      )}
                    >
                      <div
                        className={cn(
                          'mr-2 rounded-[2px] !outline-transparent !ring-transparent flex h-4 w-4 items-center justify-center border border-primary',
                          isSelected ? 'bg-bgPrimaryGreen text-primary-foreground' : 'opacity-50 [&_svg]:invisible'
                        )}
                      >
                        <CheckIcon className="h-4 w-4 text-white" />
                      </div>
                      {option.icon && <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />}
                      <span>{option.label}</span>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              <CommandSeparator />
              {/*<CommandGroup>*/}
              {/*  <div className="flex items-center justify-between">*/}
              {/*    {selectedValues.length > 0 && (*/}
              {/*      <>*/}
              {/*        <CommandItem*/}
              {/*          onSelect={() => {*/}
              {/*            setSelectedValues([]);*/}
              {/*            selectedValuesSet.current.clear();*/}
              {/*            onValueChange([]);*/}
              {/*          }}*/}
              {/*          style={{*/}
              {/*            pointerEvents: 'auto',*/}
              {/*            opacity: 1,*/}
              {/*          }}*/}
              {/*          className="flex-1 justify-center cursor-pointer"*/}
              {/*        >*/}
              {/*          Clear*/}
              {/*        </CommandItem>*/}
              {/*        <Separator orientation="vertical" className="flex min-h-6 h-full" />*/}
              {/*      </>*/}
              {/*    )}*/}
              {/*    <CommandSeparator />*/}
              {/*    <CommandItem*/}
              {/*      onSelect={() => setIsPopoverOpen(false)}*/}
              {/*      style={{*/}
              {/*        pointerEvents: 'auto',*/}
              {/*        opacity: 1,*/}
              {/*      }}*/}
              {/*      className="flex-1 justify-center cursor-pointer"*/}
              {/*    >*/}
              {/*      Close*/}
              {/*    </CommandItem>*/}
              {/*  </div>*/}
              {/*</CommandGroup>*/}
            </CommandList>
          </Command>
        </PopoverContent>
        {animation > 0 && selectedValues.length > 0 && (
          <WandSparkles
            className={cn(
              'cursor-pointer my-2 text-foreground bg-background w-3 h-3',
              isAnimating ? '' : 'text-muted-foreground'
            )}
            onClick={() => setIsAnimating(!isAnimating)}
          />
        )}
      </Popover>
    );
  }
);

MultiSelectFormField.displayName = 'MultiSelectFormField';

export default MultiSelectFormField;
