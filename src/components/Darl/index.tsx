import React, { useEffect, useState } from 'react';
import { Tooltip } from '../Tooltip2.0';
import { twMerge } from 'tailwind-merge';
import * as Icon from '@phosphor-icons/react';

import useContext, { 
  Provider, 
  ProviderRootProps, 
} from './contexts';

export interface RootProps {
  label?: string;
  visible?: boolean;
  children: React.ReactNode;
}

export interface InsertAreaFieldRootProps {
  className?: string;
  children: React.ReactNode;
}

export interface ButtonRootProps {
  children: React.ReactNode;
  className?: string;
}

export interface ButtonUndoProps {
  disabled?: boolean;
  onClick?: () => void;
}

export interface ButtonAddProps {
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
}

export interface ComponentClipBoardProps {
  text: string;
  onClick: () => void;
}

export interface ButtonClipBoardProps {
  value: string;
  onClick?: (value: string) => void;
}

export interface ButtonRemoveProps {
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
}

export interface ButtonEditProps {
  disabled?: boolean;
  isLoading?: boolean;
  onClick?: () => void;
}

export interface ListRootProps {
  className?: string;
  children: React.ReactNode;
}

export interface ListRowProps {
  className?: string;
  children: React.ReactNode;
}

export interface ListRowFieldProps {
  className?: string;
  children: React.ReactNode;
}

const ComponentClipBoard = ({ text, onClick }: ComponentClipBoardProps) => {
  const { copyClipBoard } = useContext();
  const [showCopied, setShowCopied] = useState(false);

  const handleOnClick = () => {
    if (!onClick) {
      return 
    }

    copyClipBoard(text);
    setShowCopied(true);
    onClick();
  }

  useEffect(() => {
    if(!showCopied) {
      return;
    }

    setTimeout(() => {
      setShowCopied(false)
    }, 2000)
  }, [showCopied])

  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        {
          showCopied ?
          <Icon.CheckCircle 
            className='
              text-xl
              text-green-500 hover:text-green-700 
              dark:hover:text-green-300 
            ' 
            weight='bold' 
          />
          :
          <Icon.CopySimple 
            className='
              text-zinc-500 
              hover:text-zinc-700 
              dark:hover:text-zinc-300 text-xl
            ' 
            weight='bold' 
            onClick={handleOnClick}
          />
        }  
      </Tooltip.Trigger>
      <Tooltip.Content side='left'>
        {showCopied ? 'Texto copiado!' : 'Copiar linha para área de transferência'}
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

const Root = ({
  label, 
  visible = true,
  children,
}: RootProps) => {
  return (
    visible ?
    <>
      <span 
        className='relative -top-1 left-4 text-xs text-zinc-500 dark:text-zinc-400 w-fit'>
        { label }
      </span>
      <div className='flex flex-col gap-6 px-4 pt-8 pb-4 -mt-4 rounded bg-white dark:bg-zinc-950 border-zinc-300 dark:border-zinc-700 border'>
        { children }
      </div>
    </>
    :
    null
  ) 
}

const ProviderRoot = <T,>({ 
  initialValuesInsertArea,
  initialList,
  onChange,
  children,
}: ProviderRootProps<T>) => {
  return (
    <Provider 
      onChange={onChange}
      initialValuesInsertArea={initialValuesInsertArea}
      initialList={initialList}
    >
      { children }
    </Provider>
  );
}

const InsertAreaRoot = ({ className, children }: any) => {
  return (
    <div className={twMerge('flex items-center gap-2 w-full', className)}>
      { children }
    </div>
  )
}

const InsertAreaFieldRoot = ({ className, children }: InsertAreaFieldRootProps) => {
  return (
    <div className={twMerge('flex items-center gap-2 w-full', className)}> 
      {children} 
    </div>
  )
}

const ButtonRoot = ({ children, className }: ButtonRootProps) => {
  return (
    <div className={twMerge('flex items-center gap-1', className)}>
      { children }
    </div>
  )
}

const ButtonUndo = ({ disabled, onClick }: ButtonUndoProps) => {
  const handleOnClick = () => {
    if (!onClick) {
      return 
    }

    onClick();
  }
  
  return (
    <button
      disabled={disabled}
    >
      <Icon.ArrowCounterClockwise
        className='text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 text-xl' 
        weight='fill' 
        onClick={handleOnClick}  
      />
    </button>
  )
}

const ButtonClipBoard = ({ value, onClick }: ButtonClipBoardProps) => {
  const handleOnClick = () => {
    if (!onClick) {
      return 
    }

    onClick(value);
  }

  return (
    <ComponentClipBoard 
      onClick={handleOnClick}
      text={value} 
    />
  )
}

const ButtonAdd = ({ 
  disabled, 
  isLoading,
  onClick, 
}: ButtonAddProps) => {
  const handleOnClick = () => {
    if(disabled) {
      return
    }

    if (!onClick) {
      return 
    }

    onClick();
  }

  return (
    <button 
      disabled={disabled}
      onClick={handleOnClick}
    >
      {
        isLoading ?
        <Icon.CircleNotch 
          className="animate-spin text-green-500 dark:text-green-500" 
          weight='bold' 
        />
        :
        <Icon.PlusCircle
          className='text-green-600 hover:text-green-500' 
          weight='fill' 
        />
      }
    </button>
  )
}

const ButtonRemove = ({ 
  disabled, 
  isLoading,
  onClick 
}: ButtonRemoveProps) => {
  const handleOnClick = () => {
    if(disabled) {
      return
    }

    if (!onClick) {
      return 
    }

    onClick();
  }

  return (
    <button
      disabled={disabled}
      onClick={handleOnClick}
    >
      {
        isLoading ?
        <Icon.CircleNotch 
          className="animate-spin text-red-500 dark:text-red-500" 
          weight='bold' 
        />
        :
        <Icon.Trash
          className='text-red-600 hover:text-red-500' 
          weight='fill' 
        />
      }
    </button>
  )
}

const ButtonEdit = ({ 
  disabled, 
  isLoading,
  onClick 
}: ButtonEditProps) => {
  const handleOnClick = () => {
    if(disabled) {
      return
    }
    
    if (!onClick) {
      return 
    }

    onClick();
  }

  return (
    <button
      disabled={disabled}
      onClick={handleOnClick}
    >
      {
        isLoading ?
        <Icon.CircleNotch 
          className="animate-spin text-blue-500 dark:text-blue-500" 
          weight='bold' 
        />
        :
        <Icon.NotePencil
          className='text-xl text-blue-600 hover:text-blue-500' 
          weight='fill' 
        />
      }
    </button>
  )
}

const ListRoot = ({ className, children }: ListRootProps) => {
  return (
    <div className={twMerge('flex flex-col w-full gap-4', className)}>
      { children }
    </div>
  )
}

const ListRowRoot = ({ className, children }: ListRowProps) => {
  return (
    <div className={twMerge('flex gap-2 w-full', className)}>
      { children }
    </div>
  )
}

const ListRowField = ({ className, children }: ListRowFieldProps) => {
  return (
    <div className={twMerge('flex gap-2 w-full', className)}>
      { children }
    </div>
  )
}

export const Darl = {
  Root,
  Bag: ProviderRoot,
  Button: {
    Root: ButtonRoot,
    Add: ButtonAdd,
    Remove: ButtonRemove,
    Edit: ButtonEdit,
    Undo: ButtonUndo,
    CopyClipBoard: ButtonClipBoard,
  },
  InsertArea: {
    Root: InsertAreaRoot,
    Field: {
      Root: InsertAreaFieldRoot
    },
  },
  List: {
    Root: ListRoot,
    Row: {
      Root: ListRowRoot,
      Field: {
        Root: ListRowField,
      },
    },
  }
};