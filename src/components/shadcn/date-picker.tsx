// components/shadcn/date-picker.tsx
'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { ptBR } from 'date-fns/locale';

import { cn } from "@/utils/classname"
import { Button } from '@/components/shadcn/button';
import { Calendar } from '@/components/shadcn/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn/popover';

export interface DatePickerProps {
  date?: Date;
  disabled?: boolean;
  onSelect?: (date: Date | undefined) => void;
}

export function DatePicker({ date, disabled = false, onSelect }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          disabled={disabled}
          className={cn('w-full justify-start text-left font-normal bg-white dark:bg-black', !date && 'text-muted-foreground')}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'dd/MM/yyyy', { locale: ptBR }) : <span>Selecione uma data</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-transparent border-0 shadow-none" align="start">
        <Calendar 
          mode="single" 
          selected={date} 
          onSelect={onSelect} 
          locale={ptBR} 
          autoFocus 
        />
      </PopoverContent>
    </Popover>
  );
}
