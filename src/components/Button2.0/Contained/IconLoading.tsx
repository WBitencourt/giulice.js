import * as React from 'react';
import { twMerge } from 'tailwind-merge'
import * as Icon from '@phosphor-icons/react';

export interface ContainedIconLoadingProps {
  className?: string;
}

export function ContainedIconLoading({ className }: ContainedIconLoadingProps) {
  return (
    <Icon.CircleNotch 
      className={
        twMerge(
          `animate-spin 
          text-white dark:text-black text-xl`, 
          className
        )
      }
      weight='bold' 
    />
  );
}
