"use client";

import * as React from "react";
import { add, format, isValid, parse } from "date-fns";
import { Eraser } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ptBR } from 'date-fns/locale'

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Clock } from "../Clock";
import { Input } from "@/components/ui/input";
import { Clock as ClockIcon } from "lucide-react";

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

export function Time({ 
  id,
  name,
  label,
  highlight = false,
  className,
  value,
  onChange,
  visible = true,
  disabled = false,
}: DateTimeProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false)
  const [inputValue, setInputValue] = useState("");

  const hasValue = !!value;

  const normalizeStringTime = (time: string): string => {
    const digitsOnly = time.replace(/\D/g, "");
  
    let hour = digitsOnly.slice(0, 2);
    let minute = digitsOnly.slice(2, 4);
  
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
  
    // Monta a string formatada de hora e minuto
    let formattedTime = hour;
    if (minute.length > 0) {
      formattedTime += `:${minute}`;
    }
  
    return formattedTime;
  };
  
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = normalizeStringTime(e.target.value);
    setInputValue(value);

    if(value.length === 5) {
      const parsedDate = parse(value, "HH:mm", new Date(), { locale: ptBR });
      
      if (onChange && isValid(parsedDate)) {
        onChange(parsedDate);
      }
    }
  };

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

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
            <ClockIcon className="mr-2 h-4 w-4" />
            <span 
              data-highlight={highlight}
              className="data-[highlight=true]:text-red-500"
            >
              {
                value ? 
                format(value, "HH:mm", { locale: ptBR }) 
                : 
                <span>{ label }</span>
              }
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="flex gap-2 items-center mb-2">
          <Input
            ref={inputRef}
            placeholder="hh:mm"
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
        <div className="flex justify-center p-3 border-t border-border">
          <Clock
            onChange={(value) => {
              if (onChange) {
                onChange(value);
              }

              if (value && isValid(value)) {
                setInputValue(format(value, "HH:mm", { locale: ptBR }));
              }
            }} 
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