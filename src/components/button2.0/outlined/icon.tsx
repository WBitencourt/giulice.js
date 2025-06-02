import * as React from 'react';
import { twMerge } from 'tailwind-merge'

export interface OutlinedIconProps extends React.ButtonHTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function OutlinedIcon({ children, className, ...props }: OutlinedIconProps) {
  return (
    <span className={twMerge('flex text-xl dark:text-zinc-900 text-white', className)} { ...props }>
      {children}
    </span>
  );
}
