// components/ui/date-time-picker.tsx
'use client';

import * as React from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export interface DateTimePickerProps {
  date?: Date;
  disabled?: boolean;
  onSelect?: (date: Date) => void;
}

export function DateTimePicker({ date, disabled = false, onSelect }: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(date);
  const [selectedHour, setSelectedHour] = React.useState<string>(
    selectedDate ? format(selectedDate, 'HH') : ''
  );
  const [selectedMinute, setSelectedMinute] = React.useState<string>(
    selectedDate ? format(selectedDate, 'mm') : ''
  );

  React.useEffect(() => {
    if (date) {
      setSelectedDate(date);
      setSelectedHour(format(date, 'HH'));
      setSelectedMinute(format(date, 'mm'));
    } else {
      setSelectedDate(undefined);
      setSelectedHour('');
      setSelectedMinute('');
    }
  }, [date]);

  const handleSelect = (newDate: Date | undefined) => {
    setSelectedDate(newDate);
    if (newDate) {
      setSelectedHour(format(newDate, 'HH'));
      setSelectedMinute(format(newDate, 'mm'));
      if (onSelect) {
        onSelect(newDate);
      }
    }
  };

  const handleHourChange = (hour: string) => {
    setSelectedHour(hour);
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setHours(parseInt(hour, 10));
      handleSelect(newDate);
    }
  };

  const handleMinuteChange = (minute: string) => {
    setSelectedMinute(minute);
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      newDate.setMinutes(parseInt(minute, 10));
      handleSelect(newDate);
    }
  };

  // Gerar opções para horas (0-23)
  const hoursOptions = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return { value: hour, label: hour };
  });

  // Gerar opções para minutos (0-59)
  const minutesOptions = Array.from({ length: 60 }, (_, i) => {
    const minute = i.toString().padStart(2, '0');
    return { value: minute, label: minute };
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          disabled={disabled}
          className={cn('w-full justify-start text-left font-normal bg-white dark:bg-black', !date && 'text-muted-foreground')}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR }) : <span>Selecione data e hora</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={selectedDate} onSelect={handleSelect} locale={ptBR} autoFocus />
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <div className="flex items-center gap-1 flex-1">
              <Select value={selectedHour} onValueChange={handleHourChange}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Hora" />
                </SelectTrigger>
                <SelectContent>
                  {hoursOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>:</span>
              <Select value={selectedMinute} onValueChange={handleMinuteChange}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Min" />
                </SelectTrigger>
                <SelectContent>
                  {minutesOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant='outline' 
              onClick={() => setOpen(false)} 
              className="ml-auto"
            >
              Fechar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
