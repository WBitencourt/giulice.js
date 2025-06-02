'use client';

import useContext from '@/components/textfield/contexts';
import { XIcon } from '@phosphor-icons/react';
import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

export const ButtonClean = ({ className, type = 'button', ...props }: ComponentProps<'button'>) => {
  const { isDisabled } = useContext();

  if (isDisabled) return null;

  return (
    <button 
      { ...props } 
      type={type} 
      className={twMerge('cursor-pointer z-10', className)}
    >
      <XIcon
        className='group-hover:text-red-500 text-black/0 text-sm' 
        weight='bold' 
      />  
    </button>
  )
}