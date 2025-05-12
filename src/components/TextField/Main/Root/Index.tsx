'use client'

import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export interface TextFieldRootProps extends ComponentProps<'div'> {
  highlight?: boolean;
  visible?: boolean;
}

export const MainRoot = ({ 
  visible = true, 
  className, 
  children, 
  ...props 
}: TextFieldRootProps) => { 
  if(!visible) {
    return null;
  }

  return (
    <div 
      { ...props }
      className={twMerge('flex flex-col flex-1', className)}
    >
      {children}
    </div>
  )
}