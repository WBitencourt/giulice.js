'use client'

import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';
import useContext from '../contexts';
import { Eye } from 'lucide-react';
import { EyeClosed } from 'lucide-react';

export const ButtonPasswordView = ({ onClick, className, type = 'button', ...props}: ComponentProps<'button'> ) => {
  const { showPassword, toggleShowPassword } = useContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    toggleShowPassword();

    onClick?.(event);
  }

  return (
    <button 
      { ...props }
      type={type}
      onClick={handleClick}
      className={twMerge("cursor-pointer p-0 m-0 z-10", className)}
    >
      {
        showPassword ? 
        <Eye 
          className="text-cyan-500 h-4 w-4" 
        />
        :
        <EyeClosed 
          className="text-cyan-500 h-4 w-4" 
        />
      }
    </button>
  )
}