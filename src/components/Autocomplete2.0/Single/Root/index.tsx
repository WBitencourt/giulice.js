'use client'

import { forwardRef } from "react";
import { AutocompleteSingleHandles, AutocompleteProviderRef, AutocompleteSingleProps } from "../contexts";
import { cn } from "@/utils/ClassName";
import React from "react";

const Root = ({ 
  visible = true, 
  className, 
  children, 
  ...props 
}: AutocompleteSingleProps) => {
  if(!visible) {
    return null;
  }

  return (
    <div 
      { ...props } 
      className={cn('relative', className)}
    >
      {children}
    </div>
  )
}

const AutocompleteSingleProviderRoot = ({ 
  children, 
  freeSolo,
  picklist,
  onOptionChange,
  selectedOption,
  ...props 
}: AutocompleteSingleProps, ref: React.Ref<AutocompleteSingleHandles>) => {
  return (
    <AutocompleteProviderRef 
      ref={ref}
      freeSolo={freeSolo}
      picklist={picklist}
      onOptionChange={onOptionChange}
      selectedOption={selectedOption}
    >
      <Root
        { ...props }
      >
        { children }
      </Root>
    </AutocompleteProviderRef>
  )
}

export const AutocompleteSingleProviderRootRef = forwardRef(AutocompleteSingleProviderRoot);