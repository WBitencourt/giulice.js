'use client'

import { Tooltip } from '@/components/tooltip';
import { useEffect, useState } from 'react';
import { Value } from "../contexts";
import { twMerge } from 'tailwind-merge';
import { copyToClipBoard } from '@/utils/dom';
import { CircleCheck, Copy } from 'lucide-react';

interface ButtonClipboardProps extends React.ComponentProps<'button'> {
  value: Value;
}

export const ButtonClipboard = ({ value, type = 'button', className, onClick, ...props }: ButtonClipboardProps) => {
  const [showCopied, setShowCopied] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {     
      copyToClipBoard(value?.toString());
      setShowCopied(true);

      onClick?.(event);
    } catch (error) {
      throw error
    }
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
        <button 
          { ...props }
          className={twMerge('cursor-pointer z-10', className)}
          type={type}
          onClick={handleClick}
        >
          {
            showCopied ?
            <CircleCheck 
              className="text-green-500 hover:text-green-700 dark:hover:text-green-300 h-4 w-4" 
            />
            :
            <Copy 
              className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 h-4 w-4 transition duration-700 ease-in-out"  
            />
          } 
        </button>
      </Tooltip.Trigger>
      <Tooltip.Content side='left'>
        {showCopied ? 'Texto copiado!' : `Copiar para área de transferência`}
      </Tooltip.Content>
    </Tooltip.Root>
  )
}