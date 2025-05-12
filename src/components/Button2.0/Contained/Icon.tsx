import * as React from 'react';
import { twMerge } from 'tailwind-merge'

export interface ContainedIconProps extends React.ButtonHTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function ContainedIcon({ children, className, ...props }: ContainedIconProps) {
  return (
    <span className={twMerge('text-xl', className)} { ...props }>
      {children}
    </span>
  );
}
