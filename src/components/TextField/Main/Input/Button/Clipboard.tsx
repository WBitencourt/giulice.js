'use client'

import { Tooltip } from '@/components/Tooltip2.0';
import * as Icon from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import { Value } from "../../../contexts";
import { twMerge } from 'tailwind-merge';
import { copyToClipBoard } from '@/utils/dom';

interface ButtonClipboardProps extends React.ComponentProps<'button'> {
  value: Value;
}

export const ButtonClipboard = ({ value, type = 'button', className, onClick, ...props }: ButtonClipboardProps) => {
  const [showCopied, setShowCopied] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {     
      copyToClipBoard(value?.toString());
      setShowCopied(true);

      if(!onClick) {
        return;
      }

      onClick(event);
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
            <Icon.CheckCircle 
              className="text-green-500 hover:text-green-700 dark:hover:text-green-300 text-xl c4aa9042-ca7d-4326-ab46-6dcfefb3dea2" 
              weight='bold' 
            />
            :
            <Icon.CopySimple 
              className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 text-xl transition duration-700 ease-in-out" 
              weight='bold' 
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