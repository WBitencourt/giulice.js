import * as Icon from '@phosphor-icons/react';
import { twMerge } from "tailwind-merge";

export interface SummaryArrowProps {
  expanded?: boolean;
  className?: string;
}

export const SummaryArrowIcon = ({ className, expanded = false, ...props }: SummaryArrowProps) => {
  if(expanded) {
    return (
      <Icon.CaretDown 
        { ...props }
        className={twMerge('col-start-2 col-end-2 row-start-1 row-end-2 self-center justify-self-center text-black dark:text-white w-min', className)}
      />
    )
  }

  return (
    <Icon.CaretUp 
      { ...props }
      className={twMerge('col-start-2 col-end-2 row-start-1 row-end-2 self-center justify-self-center text-black dark:text-white w-min', className)}
    />
  )
}