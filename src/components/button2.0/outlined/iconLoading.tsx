import * as React from 'react';
import { twMerge } from 'tailwind-merge'
import * as Icon from '@phosphor-icons/react';

export interface OutlinediconLoadingProps {
  className?: string;
}

export function OutlinediconLoading({ className }: OutlinediconLoadingProps) {
  return (
    <Icon.CircleNotch 
      className={
        twMerge(
          `animate-spin 
          text-black dark:text-white text-xl`, 
          className
        )
      }
      weight='bold' 
    />
  );
}
