import useContext from '@/components/TextField/contexts';
import * as Icon from '@phosphor-icons/react';
import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

export const ButtonClean = ({ className, type = 'button', ...props }: ComponentProps<'button'>) => {
  const { isDisabled } = useContext();

  if (isDisabled) return null;

  return (
    <button 
      type={type} 
      { ...props } 
      className={twMerge('cursor-pointer z-10', className)}
    >
      <Icon.X 
        className='group-hover:text-cyan-500 text-black/0 text-sm' 
        weight='bold' 
      />  
    </button>
  )
}