import * as React from 'react';
import { twMerge } from 'tailwind-merge'

export interface OutlinedTextProps extends React.ButtonHTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function OutlinedText({ children, className, ...props }: OutlinedTextProps) {
  return (
    <span 
      className={twMerge('', className)} 
      { ...props }
    >
      {children}
    </span>
  );
}
