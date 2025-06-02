import * as React from 'react';
import { twMerge } from 'tailwind-merge'

export interface ContainedTextProps extends React.ButtonHTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  className?: string;
}

export function ContainedText({ children, className, ...props }: ContainedTextProps) {
  return (
    <span 
      { ...props }
      className={twMerge('', className)} 
    >
      {children}
    </span>
  );
}
