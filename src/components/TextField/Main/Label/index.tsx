'use client'

import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"
import useContext from "../../contexts";

export const Label = ({ className, children, ...props }: ComponentProps<'label'>) => {
  const { 
    isFocused, 
    isDisabled,
    highlight, 
    inputID,
    hasValue,
    updateIsFocused
  } = useContext();

  return (
    <label
      data-input-focused={isFocused || hasValue}
      data-highlight={highlight}
      data-disabled={isDisabled}
      className={twMerge(
        [
          'data-[highlight=true]:text-red-500',
          'data-[highlight=true]:dark:text-red-400',
          //'absolute left-3',
          'pr-6 transition-all duration-300 ease-in-out truncate w-full max-w-[95%]',
          'text-zinc-400 cursor-text',
          'text-sm z-0',
          'data-[input-focused=true]:text-xs',
          'data-[input-focused=true]:py-0',
          'data-[disabled=true]:text-zinc-500',
          'data-[disabled=true]:dark:text-zinc-500',
        ].join(' '), className
      )}
      htmlFor={inputID}
      onClick={() => {
        updateIsFocused(true)
      }}
    >
      { children }
    </label>
  )
}