"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect } from "react";
import { ptBR } from 'date-fns/locale'

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DateTimeProps {
  id?: string;
  name?: string;
  label?: string;
  className?: string;
  highlight?: boolean;
  value: Date | null;
  visible?: boolean;
  disabled?: boolean;
  onChange?: (value: Date | null) => void;
}

export function DateTime({ 
  label,
  highlight = false,
  className,
  value,
  disabled = false,
  visible = true,
  onChange,
}: DateTimeProps) {
  const hasValue = !!value;

  const [open, setOpen] = React.useState(false);

  const [selectedDate, setSelectedDate] = React.useState<Date | null>(value);

  const [selectedHour, setSelectedHour] = React.useState<string>(
    selectedDate ? format(selectedDate, 'HH') : ''
  );

  const [selectedMinute, setSelectedMinute] = React.useState<string>(
    selectedDate ? format(selectedDate, 'mm') : ''
  );

  const handleSelect = (newDate: Date | null) => {
    if (newDate) {
      setSelectedDate(newDate);
      setSelectedHour(format(newDate, 'HH'));
      setSelectedMinute(format(newDate, 'mm'));
    } else {
      setSelectedDate(null);
      setSelectedHour('');
      setSelectedMinute('');
    }

    onChange?.(newDate);
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

  useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setSelectedHour(format(value, 'HH'));
      setSelectedMinute(format(value, 'mm'));
    } else {
      setSelectedDate(null);
      setSelectedHour('');
      setSelectedMinute('');
    }
  }, [value]);

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

  if (!visible) {
    return null;
  }

  return (
    <Popover
      open={open} 
      onOpenChange={setOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            `${className} flex flex-col items-start justify-center gap-1 min-w-[200px] h-14 text-left font-normal`,
            !value && "text-muted-foreground"
          )}
        >
          {
            value ? (
              <label 
                data-has-value={hasValue}
                data-highlight={highlight}
                className="text-sm data-[has-value=true]:text-xs data-[highlight=true]:text-red-500"
              >
                { label }
              </label>
            ) : null
          }

          <div className="flex">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span 
              data-highlight={highlight}
              className="data-[highlight=true]:text-red-500"
            >
              {
                value ? 
                format(value, "P HH:mm", { locale: ptBR }) 
                : 
                <span>{ label }</span>
              }
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <Calendar 
          mode="single" 
          selected={value || undefined} 
          onSelect={(newDate) => handleSelect(newDate || null)} 
          locale={ptBR} 
          autoFocus 
        />
        <div className="flex flex-col justify-center items-center gap-3 pt-3 border-t border-border">
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
          </div>
          <div className="flex gap-2 items-center">
            <Clock className="h-4 w-4 sr-only"  />
            <Button 
              variant='outline' 
              onClick={() => setOpen(false)} 
              className="ml-auto"
            >
              Fechar
            </Button>
            <Button 
              variant='outline' 
              onClick={() => handleSelect(null)} 
              className="ml-auto"
            >
              Limpar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}