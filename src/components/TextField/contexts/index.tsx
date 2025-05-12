import { createContext, useCallback, useContext as useContextPrimitive, useEffect, useState } from 'react';

export type Value = string | number | readonly string[] | undefined;

export interface ProviderRootProps {
  highlight?: boolean;
  onBlur?: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
  children: React.ReactNode;
}

export interface ContextProps {
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
}

const Context = createContext<ContextProps>({} as ContextProps);

export const Provider = ({ highlight = false, onBlur, children, ...props }: ProviderRootProps) => {
  const [inputID, setInputID] = useState<string>(`input-${Math.random().toString()}`);
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

  const updateInputID = useCallback((newValue: string | undefined) => {
    if (newValue === inputID) return;

    if (newValue === undefined) {
      setInputID(`input-${Math.random().toString()}`);
      return;
    }

    setInputID(newValue);
  }, []);

  const updateHasValue = useCallback((newValue: boolean) => {
    setHasValue(newValue);
  }, []);

  const updateIsDisabled = useCallback((newValue: boolean) => {
    setIsDisabled(newValue);
  }, []);

  return (
    <Context.Provider { ...props } value={{
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
    }}>
      {children}
    </Context.Provider>
  );
};

export default function useContext() {
  const context = useContextPrimitive<ContextProps>(Context);

  return context;
}
