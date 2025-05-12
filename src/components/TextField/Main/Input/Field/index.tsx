'use client'

import React, { ComponentProps, useEffect } from 'react';
import { IMask, IMaskInput } from 'react-imask';
import { NumericFormat } from 'react-number-format';
import { forwardRef } from 'react';
import { UF } from '@/utils/List/UF';
import { twMerge } from 'tailwind-merge';
import useContext from '../../../contexts';

export type TypeMaskTextField = 'celular' | 'currency-br' | 'cpf' | 'cnpj' | 'cpf-cnpj' | 'nup' | 'oab' | 'tel-fixo' | 'email' | 'date' | 'date-time' | undefined;

export interface InputProps extends ComponentProps<'input'> {
  typeMask?: TypeMaskTextField;
  highlight?: boolean;
}

interface InputMaskProps extends ComponentProps<'input'> {
  typeMask?: TypeMaskTextField;
}

const TextCurrencyBR = forwardRef<HTMLElement, any>(
  function TextCurrencyBR(props, ref) {
    const { onChange, ...other } = props;

    return (
      <NumericFormat
        {...other}
        getInputRef={ref}
        onChange={() => {}}
        onValueChange={(valueText) => {
          onChange({
            target: {
              id: props.id, 
              name: props.name,
              value: valueText.value,
            },
            currentTarget: { value: valueText.value }
          });
        }}
        thousandSeparator="."
        decimalSeparator=','
        decimalScale={2}
        //allowLeadingZeros
        //fixedDecimalScale 
        allowedDecimalSeparators={[',']}
        valueIsNumericString
        prefix="R$ "
      />
    );
  },
);

const TextMaskTelFixo = forwardRef<HTMLElement, any>(
  function TextMaskTelFixo(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="+55 (#0) 0000-0000"
        definitions={{
          '#': /[1-9]/,
          '9': /[9]/,
        }}
        ref={ref}
        onChange={() => {}}
        onAccept={(value: any) => onChange({ 
          target: { 
            id: props.id, 
            name: props.name, 
            value 
          },
          currentTarget: { value }
        })}
        overwrite
      />
    );
  },
);

const TextMaskCelular = forwardRef<HTMLElement, any>(
  function TextMaskCelular(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="+55 (#0) 90000-0000"
        definitions={{
          '#': /[1-9]/,
          '9': /[9]/,
        }}
        ref={ref}
        onChange={() => {}}
        onAccept={(value: any) => onChange({ 
          target: { 
            id: props.id, 
            name: props.name, 
            value,
          },
          currentTarget: { value }
        })}
        overwrite
      />
    );
  },
);

const TextMaskNup = forwardRef<HTMLElement, any>(
  function TextMaskCelular(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="0000000-00.0000.0.00.0000"
        // definitions={{
        //   '#': /[1-9]/,
        //   '9': /[9]/,
        // }}
        ref={ref}
        onChange={() => {}}
        onAccept={(value: any) => onChange({ 
          target: { 
            id: props.id, 
            name: props.name, 
            value 
          },
          currentTarget: { value }
        })}
        overwrite
      />
    );
  },
);

const TextMaskOAB = forwardRef<HTMLElement, any>(
  function TextMaskOAB(props, ref) {
    const { onChange, ...other } = props;

    const handleAccept = (value: string) => {
      const [uf, numero] = value.split('-');

      if (!UF.UFList.includes(uf.toUpperCase())) {
        //setError(true);
        //setTimeout(() => setError(false), 3000);
      } else {
        onChange({ 
          target: { 
            id: props.id, 
            name: props.name, 
            value: value.toUpperCase() 
          },
          currentTarget: { value: value.toUpperCase()  }
        });
      }
    };

    return (
      <IMaskInput
        {...other}
        mask="XX-000000" // Máscara para cobrir o formato da OAB.
        definitions={{
          // Customizações para as letras (X) e números (0)
          X: /\w/, // Permite apenas letras.
          0: /[0-9]/, // Permite apenas dígitos.
        }}
        ref={ref}
        //onChange={onChange}
        onAccept={handleAccept}
        overwrite
      />
    );
  },
);

const TextMaskCPF = forwardRef<HTMLElement, any>(
  function TextMaskCPF(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="000.000.000-00"
        // definitions={{
        //   '#': /[1-9]/,
        //   '9': /[9]/,
        // }}
        ref={ref}
        onAccept={(value: any) => {
          onChange({ 
            target: { 
              id: props.id, 
              name: props.name, 
              value 
            },
            currentTarget: { value }
          })
        }}
        overwrite
      />
    );
  },
);

const TextMaskCNPJ = forwardRef<HTMLElement, any>(
  function TextMaskCNPJ(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask="00.000.000/0000-00"
        ref={ref}
        onChange={() => {}}
        onAccept={(value: any) => onChange({ 
          target: { 
            id: props.id, 
            name: props.name, 
            value 
          },
          currentTarget: { value }
        })}
        overwrite
      />
    );
  },
);

const TextMaskCPFOrCNPJ = forwardRef<HTMLElement, any>(
  function TextMaskCPFOrCNPJ(props, ref) {
    const { onChange, ...other } = props;
    return (
      <IMaskInput
        {...other}
        mask={[
          {
            mask: '000.000.000-00',
            maxLength: 14,
          },
          {
            mask: '00.000.000/0000-00',
          },
        ]}
        ref={ref}
        onChange={() => {}}
        onAccept={(value: any) => onChange({ 
          target: { 
            id: props.id, 
            name: props.name, 
            value 
          },
          currentTarget: { value }
        })}
        overwrite
      />
    );
  }
)

const TextMaskEmail = forwardRef<HTMLElement, any>(
  function TextMaskEmail(props, ref) {
    const { onChange, ...other } = props;
    
    const handleAccept = (value: any) => {
      const emailPattern = /\S+@\S+\.\S+/;
      if (emailPattern.test(value)) {
        onChange({ 
          target: { 
            id: props.id, 
            name: props.name, 
            value 
          },
          currentTarget: { value } 
        });
      }
    };

    return (
      <IMaskInput
        {...other}
        mask={/^[a-zA-Z0-9@._-]*$/}
        ref={ref}
        autoComplete='email'
        onAccept={handleAccept}
        overwrite
      />
    );
  }
)

const TextMaskDate = forwardRef<HTMLElement, any>(function TextMaskDate(props, ref) {
  const { onChange, ...other } = props;

  const handleAccept = (value: any) => {
    const datePattern =
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (datePattern.test(value)) {
      onChange({
        target: {
          id: props.id,
          name: props.name,
          value,
        },
        currentTarget: { value },
      });
    }
  };

  return (
    <IMaskInput
      {...other}
      mask="d{/}m{/}Y"
      blocks={{
        d: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 31,
          autofix: 'pad', // Automatically add leading zero
          placeholderChar: 'd', // Placeholder character
        },
        m: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 12,
          autofix: 'pad',
          placeholderChar: 'm',
        },
        Y: {
          mask: IMask.MaskedRange,
          from: 1900,
          to: 9999,
          placeholderChar: 'Y',
        },
      }}
      ref={ref}
      onAccept={handleAccept}
      overwrite
      autofix // Enable autofix globally
    />
  );
});

const TextMaskDateTime = forwardRef<HTMLElement, any>(function TextMaskDate(props, ref) {
  const { onChange, ...other } = props;

  const handleAccept = (value: any) => {
    const dateTimePattern =
      /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4} ([01][0-9]|2[0-3]):([0-5][0-9])$/;
    if (dateTimePattern.test(value)) {
      onChange({
        target: {
          id: props.id,
          name: props.name,
          value,
        },
        currentTarget: { value },
      });
    }
  };

  return (
    <IMaskInput
      {...other}
      mask="d{/}m{/}Y H{:}M"
      blocks={{
        d: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 31,
          autofix: 'pad', // Automatically add leading zero
          placeholderChar: 'd', // Placeholder character
        },
        m: {
          mask: IMask.MaskedRange,
          from: 1,
          to: 12,
          autofix: 'pad',
          placeholderChar: 'm',
        },
        Y: {
          mask: IMask.MaskedRange,
          from: 1900,
          to: 9999,
          placeholderChar: 'Y',
        },
        H: {
          mask: IMask.MaskedRange,
          from: 0,
          to: 23,
          autofix: 'pad',
          placeholderChar: 'H',
        },
        M: {
          mask: IMask.MaskedRange,
          from: 0,
          to: 59,
          autofix: 'pad',
          placeholderChar: 'M',
        },
      }}
      ref={ref}
      onAccept={handleAccept}
      overwrite
      autofix // Enable autofix globally
    />
  );
});

const TextMaskDefault = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function TextMaskDefault(props, ref) {
    const { onChange, autoComplete, ...other } = props;

    return (
      <input
        {...other}
        ref={ref}
        //inputRef={ref}
        onChange={onChange}
      />
    );
  }
)

const InputMask = ({ typeMask, ...props }: InputMaskProps) => {
  switch(typeMask) {
    case 'cnpj':
      return <TextMaskCNPJ { ...props } />;
    case 'cpf':
      return <TextMaskCPF {...props} />;
    case 'cpf-cnpj':
      return <TextMaskCPFOrCNPJ {...props} />;
    case 'tel-fixo':
      return <TextMaskTelFixo {...props} />;
    case 'celular':
      return <TextMaskCelular {...props} />;
    case 'nup':
      return <TextMaskNup {...props} />;
    case 'oab':
      return <TextMaskOAB {...props} />;
    case 'currency-br':
      return <TextCurrencyBR {...props} />;
    case 'email':
      return <TextMaskEmail {...props} />;
    case 'date':
      return <TextMaskDate {...props} />;
    case 'date-time':
      return <TextMaskDateTime {...props} />;
    default:
      return <TextMaskDefault {...props} />;
  }
}

const InputFieldPrimitive = ({
  id,
  name,
  type = 'text',
  value = '',
  className,
  onBlur,
  onFocus,
  onChange,
  disabled = false,
  typeMask,
  highlight = false,
  ...props
}: InputProps) => {
  const { 
    updateIsFocused, 
    showPassword, 
    updateInputID, 
    updateHasValue, 
    updateIsDisabled,
    inputID,
    isFocused,
    hasValue, 
  } = useContext();

  const handleFocus = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    updateIsFocused(true);

    if(onFocus) {
      onFocus(event);
    }
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement, Element>) => {
    updateIsFocused(false)

    if(!onBlur) {
      return
    }

    onBlur(event);
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
    <InputMask
      { ...props }
      id={inputID}
      typeMask={typeMask}
      type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
      disabled={disabled}
      data-disabled={disabled} 
      data-focused={isFocused || hasValue}
      onFocus={handleFocus}
      onChange={onChange}
      onBlur={handleBlur}
      className={twMerge([
        'flex w-full text-sm resize-y', 
        'data-[disabled=true]:cursor-not-allowed', 
        'bg-red-500 min-w-[200px] bg-transparent z-10',
        'data-[disabled=true]:text-zinc-500',
        'data-[disabled=true]:dark:text-zinc-500',
        'data-[focused=false]:sr-only',
      ].join(' '), className)}
      value={value}
    />
  )
}

export const InputField = InputFieldPrimitive;

// export const InputField = React.memo(InputFieldPrimitive, (prevProps, nextProps) => {
//   //O React.memo foi utilizado para evitar renderizações desnecessárias no InputField, 
//   //causadas pelo DatePicker disparar o evento onChange do input mesmo quando o valor não foi alterado. 
//   //A comparação personalizada previne que o componente seja re-renderizado sem necessidade.
//   return (
//     prevProps?.onChange?.toString() === nextProps?.onChange?.toString() && 
//     prevProps?.onKeyDown?.toString() === nextProps?.onKeyDown?.toString() && 
//     prevProps?.value === nextProps?.value &&
//     prevProps?.name === nextProps?.name && 
//     prevProps?.id === nextProps?.id
//   );
// });