import { Tooltip } from '@/components/Tooltip2.0';
import * as Icon  from '@phosphor-icons/react';
import React from 'react';
import { twMerge } from 'tailwind-merge';
import { TextArea } from '../TextArea';

export interface AnnotationBoxTitleProps {
  children: React.ReactNode;
  className?: string;
}

export interface OnClickAddAnnotation {
  value: string | undefined;
}

export interface AnnotationBoxFormProps {
  label: string;
  disabled?: boolean;
  rows?: number;
  multiline?: boolean;
  className?: string;
  value?: string;
  isAddingAnnotation?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void;
  onClickAdd?: (value: OnClickAddAnnotation) => void;
}

export interface AnnotationBoxItemHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export interface AnnotationBoxItemTextItemProps {
  children: React.ReactNode;
  className?: string;
}

export interface AnnotationBoxItemTooltipItemProps {
  title: string;
  children: React.ReactElement;
  className?: string;
}

export interface AnnotationBoxItemIconItemProps {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
}

export interface AnnotationBoxToggleListItemProps {
  isOpen: boolean;
  openMessage?: string;
  closeMessage?: string;
  onClick?: (isOpen: boolean) => void;
}

export interface AnnotationBoxItemRootProps {
  open?: boolean;
  className?: string;
  children: React.ReactNode;
}

export interface AnnotationBoxRootProps {
  visible?: boolean;
  children: React.ReactNode;
  className?: string;
}

const AnnotationBoxTitle = ({ children, className }: AnnotationBoxTitleProps) => {
  return (
    <>
      <h2 className={twMerge(" text-zinc-500 dark:text-zinc-400", className)} >
        { children }
      </h2>

      <hr className="border-zinc-100 dark:border-zinc-800 mb-2 -mt-2" />
    </>
  );
}

const AnnotationBoxForm = ({ 
  label,
  rows = 2,
  multiline = true,
  value = '',
  disabled = false,
  isAddingAnnotation = false,
  onChange,
  onClickAdd,
}: AnnotationBoxFormProps) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      if (onClickAdd) {
        onClickAdd({ value });
      }
    }
  };

  const handleClickAdd = () => {
    if(!onClickAdd) return;

    onClickAdd({ value });
  };

  return (
    <div className="flex gap-2 items-center">
      <TextArea
        label={label}
        disabled={disabled}
        className='w-full'
        onChange={onChange}
        onKeyDown={handleKeyDown}
        rows={rows}
        value={value}
      />
      <Tooltip.Root>
        <Tooltip.Trigger>
          {
            isAddingAnnotation ?
            <Icon.CircleNotch 
              className="animate-spin text-green-500 text-2xl" 
              weight='bold' 
            />
            :
            <button 
              type='button'
              disabled={disabled}
              onClick={handleClickAdd}
            >
              <Icon.PlusCircle 
                data-disabled={disabled}
                className='text-green-500 data-[disabled=true]:text-green-500/50 data-[disabled=true]:cursor-not-allowed text-2xl transition ease-in-out delay-150 duration-300 data-[disabled=false]:hover:-translate-y-1 data-[disabled=false]:hover:scale-110' 
                weight='fill'
              />
            </button>

          }
        </Tooltip.Trigger>
        <Tooltip.Content side='top'>
          {disabled ? 'Botão desabilitado' : 'Adicionar'}
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
  );
}

const AnnotationBoxItemHeader = ({ children, className }: AnnotationBoxItemHeaderProps) => {
  return (
    <div 
      className={twMerge('text-zinc-500 dark:text-zinc-300', className)}
    >
      {children}
    </div>
  )
}

const AnnotationBoxItemTextItem = ({ children, className }: AnnotationBoxItemTextItemProps) => {
  return (
    <div 
      className={twMerge('text-zinc-400 dark:text-zinc-500', className)}
    >
      { children }
    </div>
  )
}

const AnnotationBoxItemTooltipItem = ({ 
  title, 
  children, 
  className 
}: AnnotationBoxItemTooltipItemProps) => {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        { children }
      </Tooltip.Trigger>
      <Tooltip.Content side='left'>
        {title}
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

const AnnotationBoxItemIconItem = ({ 
  children, 
  className,
}: AnnotationBoxItemIconItemProps) => {
  return (
    <div className={twMerge('flex justify-center text-xl transition ease-in-out delay-150 duration-300 hover:-translate-y-1 hover:scale-110', className)}>
      {
        children
      }
    </div>
  )
}

const AnnotationBoxToggleListItem = ({ 
  isOpen, 
  openMessage = 'Esconder anotações', 
  closeMessage = 'Mostrar anotações', 
  onClick 
}: AnnotationBoxToggleListItemProps) => {

  const handleOnClick = (isOpen: boolean) => {
    if (onClick) {
      onClick(isOpen);
    }
  }

  return (
    <>
      {      
        isOpen ? 
        <div 
          onClick={() => handleOnClick(!isOpen)}
          className='flex flex-1 items-center gap-2 h-9 cursor-pointer'
        >
          <Icon.CaretDown 
            className="text-cyan-500" 
            weight='bold' 
          />
          <span className="text-xs font-sans">
            { closeMessage }
          </span>
        </div>
        : 
        <div 
          onClick={() => handleOnClick(!isOpen)}
          className='flex flex-1 items-center gap-2 h-9 cursor-pointer'
        >
          <Icon.CaretRight 
            className="text-cyan-500" 
            weight='bold' 
          /> 
          <span className="text-xs font-sans">
            { openMessage }
          </span>
        </div>
      }
    </>
  )
}

const AnnotationBoxItemRoot = ({ open, children, className }: AnnotationBoxItemRootProps) => {
  return (
    open ?
    <div className={twMerge("grid grid-cols-[auto_1fr_auto] gap-4 p-4 rounded bg-zinc-100 dark:bg-zinc-900", className)}> 
      { children }
    </div>
    :
    null
  );
}

const AnnotationBoxRoot = ({ children, className, visible = true }: AnnotationBoxRootProps) => {
  if (!visible) return null;

  return (
    <div className={twMerge('flex flex-col gap-4 border-1 border-zinc-200 hover:border-black bg-white dark:border-zinc-800 dark:bg-zinc-950 p-4 rounded', className)}>
      { children }
    </div>
  );
};

export const AnnotationBox = {
  Root: AnnotationBoxRoot,
  Title: AnnotationBoxTitle,
  Form: AnnotationBoxForm,
  List: {
    Root: AnnotationBoxItemRoot,
    Header: AnnotationBoxItemHeader,
    ToggleListItem: AnnotationBoxToggleListItem,
    Item: {
      Text: AnnotationBoxItemTextItem,
      Icon: AnnotationBoxItemIconItem,
      Tooltip: AnnotationBoxItemTooltipItem,
    }
  }
};