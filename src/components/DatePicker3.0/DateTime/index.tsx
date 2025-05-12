"use client";

import * as React from "react";
import { add, format, isValid, parse } from "date-fns";
import { Calendar as CalendarIcon, Eraser } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ptBR } from 'date-fns/locale'

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Clock } from "../Clock";
import { Input } from "@/components/ui/input";

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
  value: Date | undefined;
  visible?: boolean;
  disabled?: boolean;
  onChange?: (value: Date | undefined) => void;
}

export function DateTime({ 
  id,
  name,
  label,
  highlight = false,
  className,
  value,
  disabled = false,
  visible = true,
  onChange,
}: DateTimeProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState("");

  const hasValue = !!value;

  const normalizeStringDateTime = (dateTime: string): string => {
    const digitsOnly = dateTime.replace(/\D/g, "");
  
    let day = digitsOnly.slice(0, 2);
    let month = digitsOnly.slice(2, 4);
    const year = digitsOnly.slice(4, 8);
    let hour = digitsOnly.slice(8, 10);
    let minute = digitsOnly.slice(10, 12);
  
    // Limita o valor do mês para 1-12
    if (month.length === 2) {
      const monthNum = parseInt(month, 10);
      if (monthNum < 1) month = "01";
      else if (monthNum > 12) month = "12";
    }
  
    // Validação do dia baseado no mês e ano
    if (day.length === 2 && month.length === 2) {
      const dayNum = parseInt(day, 10);
      const monthNum = parseInt(month, 10);
      const yearNum = parseInt(year || "2023", 10); // Ano padrão para verificação se não estiver completo
  
      // Define o número máximo de dias no mês considerando anos bissextos para fevereiro
      const maxDays = new Date(yearNum, monthNum, 0).getDate();
      if (dayNum < 1) day = "01";
      else if (dayNum > maxDays) day = maxDays.toString().padStart(2, "0");
    }
  
    // Limita o valor da hora para 0-23
    if (hour.length === 2) {
      const hourNum = parseInt(hour, 10);
      if (hourNum < 0) hour = "00";
      else if (hourNum > 23) hour = "23";
    }
  
    // Limita o valor dos minutos para 0-59
    if (minute.length === 2) {
      const minuteNum = parseInt(minute, 10);
      if (minuteNum < 0) minute = "00";
      else if (minuteNum > 59) minute = "59";
    }
  
    // Monta a string formatada de data e hora
    let formattedDateTime = `${day}`;
    if (month.length > 0) {
      formattedDateTime += `/${month}`;
    }
    if (year.length > 0) {
      formattedDateTime += `/${year}`;
    }
    if (hour.length > 0) {
      formattedDateTime += ` ${hour}`;
    }
    if (minute.length > 0) {
      formattedDateTime += `:${minute}`;
    }
  
    return formattedDateTime;
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = normalizeStringDateTime(e.target.value);
    setInputValue(value);

    if(value.length === 16) {
      const parsedDate = parse(value, "dd/MM/yyyy HH:mm", new Date(), { locale: ptBR });
      
      if (onChange && isValid(parsedDate)) {
        onChange(parsedDate);
      }
    }
  };

  const handleSelect = (newDay: Date | undefined) => {
    if (!newDay) {
      return
    }

    if (!value) {
      if (onChange) {
        onChange(newDay);
      }

      return;
    }

    if (!onChange) {
      return
    }

    const diff = newDay.getTime() - value.getTime();
    const diffInDays = diff / (1000 * 60 * 60 * 24);
    const newDateFull = add(value, { days: Math.ceil(diffInDays) });

    onChange(newDateFull);
  };

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (value && isValid(value)) {
      setInputValue(format(value, "dd/MM/yyyy HH:mm", { locale: ptBR }));
    }
  }, [value]);

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
        <div className="flex gap-2 items-center">
          <Input
            ref={inputRef}
            placeholder="dd/mm/aaaa hh:mm"
            value={inputValue}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setOpen(false);
              }
            }}
            onChange={handleInputChange}
          />
          <Eraser 
            onClick={() => {
              setInputValue("");
              
              if (onChange) {
                onChange(undefined);
              }
            }}
            className="h-6 w-6 cursor-pointer text-blue-500 hover:text-blue-700" 
          />
        </div>
        <Calendar
          mode="single"
          selected={value}
          locale={ptBR}
          onSelect={(d) => handleSelect(d)}
          autoFocus={false}
        />
        <div className="flex justify-center p-3 border-t border-border">
          <Clock
            onChange={onChange} 
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setOpen(false);
              }
            }}
            date={value} 
          />
        </div>
        <button
          className="w-full mt-2 p-2 text-sm text-white bg-blue-700 rounded-md"
          onClick={() => {
            setInputValue("");

            if (onChange) {
              onChange(undefined);
            }
          }}
        >
          Limpar
        </button>
        <button
          className="w-full mt-2 p-2 text-sm text-white bg-green-700 rounded-md"
          onClick={() => {
            setOpen(false);
          }}
        >
          Confirmar
        </button>
      </PopoverContent>
    </Popover>
  );
}