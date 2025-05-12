import "react-datepicker/dist/react-datepicker.css";

import { ComponentProps, JSXElementConstructor } from 'react';
import DatePickerPrimitive from 'react-datepicker';
import { twMerge } from 'tailwind-merge';
import { ptBR } from "date-fns/locale";
import { type Placement } from "@floating-ui/react";

interface DatePickerProps {
  popperPlacement?: Placement | undefined; 
  showTimeSelect?: boolean;
  children?: React.ReactElement<unknown, string | JSXElementConstructor<any>>;
  value: Date | null;
  onChange?: (date: Date | null) => void;
}

export const ButtonDatePicker = ({ 
  popperPlacement = 'bottom-end',
  showTimeSelect = false,
  children,
  value,
  onChange
}: DatePickerProps) => {
  return (
    <DatePickerPrimitive
      selected={value}
      onChange={onChange}
      customInput={children}
      popperPlacement={popperPlacement}
      locale={ptBR}
      dateFormat="yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
      showTimeSelect={showTimeSelect}
      timeFormat="HH:mm"
      timeIntervals={10}
      timeCaption="Hora"
      placeholderText="Selecione a data e hora"
    />
  );
}