'use client'

import React, { ComponentProps, useEffect } from 'react';
import { twMerge } from 'tailwind-merge';
import useContext from '../../contexts';
import { maskCnpj, maskCpf, maskCpfCnpj, maskCurrencyBRL, maskDateTime, maskEmail, maskPhone } from '@/utils/masks';

export type TypeMaskTextField = 'cnpj' | 'cpf' | 'cpf-cnpj' | 'phone' | 'currency-br' | 'email' | 'date-time' | undefined;

export interface InputProps extends Omit<ComponentProps<'input'>, 'onChange'> {
  typeMask?: TypeMaskTextField;
  highlight?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
}

function mergeRefs(...refs: React.Ref<HTMLInputElement>[]) {
  return (value: HTMLInputElement | null) => {
    refs.forEach(ref => {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref != null) {
        ref.current = value;
      }
    });
  };
}

const InputPrimitive = ({
  id,
  ref,
  type = 'text',
  typeMask,
  value = '',
  className,
  onBlur,
  onFocus,
  onChange,
  disabled = false,
  highlight = false,
  ...props
}: InputProps) => {
  const { 
    inputRef,
    updateIsFocused, 
    showPassword, 
    updateInputID, 
    updateHasValue, 
    updateIsDisabled,
    inputID,
    isFocused,
    hasValue, 
  } = useContext();

  const getValueMask = (value: string) => {
    switch(typeMask) {
      case 'cnpj':
        return maskCnpj(value);
      case 'cpf':
        return maskCpf(value);
      case 'cpf-cnpj':
        return maskCpfCnpj(value);
      case 'phone':
        return maskPhone(value);
      case 'currency-br':
        return maskCurrencyBRL(value);
      case 'email':
        return maskEmail(value);
      case 'date-time':
        return maskDateTime(value);
      default:
        return value;
    }
  }

  const handleFocus = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    updateIsFocused(true);

    if(onFocus) {
      onFocus(event);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    updateIsFocused(false)

    onBlur?.(event);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, value: string) => {
    onChange?.(event, getValueMask(value));
  };

  useEffect(() => {
    const hasValue = value && value.toString().trim().length > 0 ? true : false;
    updateHasValue(hasValue);
  }, [value, updateHasValue]);

  useEffect(() => {
    updateInputID(id);
  }, [id, updateInputID]);

  useEffect(() => {
    updateIsDisabled(disabled);
  }, [disabled, updateIsDisabled]);

  return (
    <input
      { ...props }
      id={inputID}
      ref={ mergeRefs(ref ?? null, inputRef) }
      type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
      disabled={disabled}
      data-disabled={disabled} 
      data-focused={isFocused || hasValue}
      data-highlight={highlight}
      onFocus={handleFocus}
      onChange={(event) => handleChange(event, event.target.value)}
      onBlur={handleBlur}
      className={twMerge([
        'flex w-full text-sm resize-y border-none outline-none', 
        'data-[disabled=true]:cursor-not-allowed', 
        'data-[highlight=true]:bg-red-500 min-w-[200px] z-10',
        'data-[disabled=true]:text-zinc-500',
        'data-[disabled=true]:dark:text-zinc-500',
        'data-[focused=false]:sr-only',
      ].join(' '), className)}
      value={value}
    />
  )
}

export const Input = InputPrimitive;