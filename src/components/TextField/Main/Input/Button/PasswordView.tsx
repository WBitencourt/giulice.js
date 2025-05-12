'use client'

import * as Icon from '@phosphor-icons/react';
import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';
import useContext from '../../../contexts';

export const ButtonPasswordView = ({ onClick, className, type = 'button', ...props}: ComponentProps<'button'> ) => {
  const { showPassword, toggleShowPassword } = useContext();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    toggleShowPassword();

    if(onClick) onClick(event);
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
        <Icon.Eye 
          className="text-cyan-500 text-xl" 
          weight='bold' 
        />
        :
        <Icon.EyeClosed 
          className="text-cyan-500 text-xl" 
          weight='bold' 
        />
      }
    </button>
  )
}