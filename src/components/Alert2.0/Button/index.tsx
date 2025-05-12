import { ComponentProps } from "react";
import * as Icon from '@phosphor-icons/react';
import { twMerge } from "tailwind-merge";

export interface CloseButtonProps extends ComponentProps<'button'> {
  visible?: boolean;
  className?: string
}

export const CloseButton = ({ className, visible = true, ...props }: CloseButtonProps) => {
  if(!visible) {
    return null;
  }

  return (
    <button { ...props }>
      <Icon.X 
        className={twMerge("cursor-pointer rounded-full text-xl text-white dark:text-black", className)}
        weight='bold' 
      />
    </button>
  );
}