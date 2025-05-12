'use client'

import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";
import useContext, { Provider } from "../contexts";

export interface TextFieldRootProps extends ComponentProps<'div'> {
  highlight?: boolean;
  visible?: boolean;
}

const Root = ({ visible = true, className, children, ...props }: TextFieldRootProps) => {
  const { isFocused, isDisabled } = useContext();
  
  if(!visible) {
    return null;
  }

  return (
    <div 
      { ...props }
      data-input-focused={isFocused}
      data-disabled={isDisabled}
      className={twMerge([
        'group relative flex px-3 rounded-md border-1 h-14 justify-center items-center',
        'bg-white dark:bg-zinc-950 text-black dark:text-white bg-opacity-50',
        'hover:bg-accent hover:text-accent-foreground hover:dark:bg-accent hover:dark:text-accent-foreground',
        //'data-[input-focused=true]:outline-none data-[input-focused=true]:ring-2 data-[input-focused=true]:ring-cyan-500',
        //'data-[input-focused=true]:border-0 data-[input-focused=true]:hover:border-transparent',
        'data-[disabled=true]:bg-opacity-50 data-[disabled=true]:dark:bg-opacity-50',
      ].join(' '), className)}
    >
      {children}
    </div>
  )
}

export const ProviderRoot = ({ children, ...props }: TextFieldRootProps) => {
  return (
    <Provider 
      highlight={props.highlight}
    >
      <Root {...props}>
        { children }
      </Root>
    </Provider>
  )
}