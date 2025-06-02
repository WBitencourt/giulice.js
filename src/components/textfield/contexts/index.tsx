'use client';

import { createContext, useCallback, useContext as useContextPrimitive, useId, useRef, useState } from 'react';

export type Value = string | number | readonly string[] | undefined;

export interface ProviderRootProps {
  highlight?: boolean;
  onBlur?: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
  children: React.ReactNode;
}

export interface ContextProps {
  inputRef: React.RefObject<HTMLInputElement | null>;
  inputID: string;
  isFocused: boolean;
  highlight: boolean | undefined;
  showPassword: boolean;
  hasValue: boolean;
  isDisabled: boolean;
  updateHasValue: (newValue: boolean) => void;
  updateIsFocused: (newValue: boolean) => void;
  updateInputID: (newValue: string | undefined) => void;
  updateIsDisabled: (newValue: boolean) => void;
  toggleShowPassword: () => void;
  toggleFocus: () => void;
}

const Context = createContext<ContextProps>({} as ContextProps);

export const Provider = ({ highlight = false, children, ...props }: ProviderRootProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [inputID, setInputID] = useState<string>(useId());
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  
  const toggleShowPassword = useCallback(() => {
    setShowPassword((previousValue) => !previousValue);
  }, []);

  const updateIsFocused = useCallback((newValue: boolean) => {
    setIsFocused(newValue);
  }, []);

  const toggleFocus = useCallback(() => {
    setIsFocused(state => !state);
  }, []);

  const updateInputID = useCallback((newValue: string | undefined) => {
    if (newValue === inputID) return;

    if (newValue === undefined) {
      setInputID(`input-${Math.random().toString()}`);
      return;
    }

    setInputID(newValue);
  }, [inputID]);

  const updateHasValue = useCallback((newValue: boolean) => {
    setHasValue(newValue);
  }, []);

  const updateIsDisabled = useCallback((newValue: boolean) => {
    setIsDisabled(newValue);
  }, []);

  return (
    <Context.Provider { ...props } value={{
      inputRef,
      inputID,
      isFocused,
      isDisabled,
      hasValue,
      highlight,
      showPassword,
      updateIsFocused,
      updateInputID,
      updateHasValue,
      updateIsDisabled,
      toggleShowPassword,
      toggleFocus,
    }}>
      {children}
    </Context.Provider>
  );
};

export default function useContext() {
  const context = useContextPrimitive<ContextProps>(Context);

  return context;
}
