"use client"

import { format, isValid, parse } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { ptBR } from 'date-fns/locale'
import { useEffect, useRef, useState } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Value {
  from: Date | undefined;
  to: Date | undefined;
}

interface DateProps {
  id?: string;
  name?: string;
  label?: string;
  className?: string;
  highlight?: boolean;
  value: Value;
  visible?: boolean;
  disabled?: boolean;
  onChange?: (value: Value) => void;
}

export function DateRange({
  id,
  name,
  label,
  highlight = false,
  className,
  value,
  onChange,
  visible = true,
  disabled = false,
}: DateProps) {
  const inputFromRef = useRef<HTMLInputElement>(null);
  const inputToRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false)
  const [inputFromValue, setInputFromValue] = useState("");
  const [inputToValue, setInputToValue] = useState("");

  const hasValue = !!value;

  const normalizeStringDate = (date: string): string => {
    const digitsOnly = date.replace(/\D/g, "")
  
    let day = digitsOnly.slice(0, 2);
    let month = digitsOnly.slice(2, 4);
    const year = digitsOnly.slice(4, 8);
  
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
      const maxDays = new Date(yearNum, monthNum, 0).getDate(); // Dia 0 do mês seguinte retorna o último dia do mês atual
      if (dayNum < 1) day = "01";
      else if (dayNum > maxDays) day = maxDays.toString().padStart(2, "0");
    }
  
    let formattedDate = day;
    if (month.length > 0) {
      formattedDate += `/${month}`;
    }
    if (year.length > 0) {
      formattedDate += `/${year}`;
    }
  
    return formattedDate;
  };
  
  const handleInputFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = normalizeStringDate(e.target.value);
    setInputFromValue(newValue);

    if(newValue.length === 10) {
      const parsedDate = parse(newValue, "dd/MM/yyyy", new Date(), { locale: ptBR });
      
      if (onChange && isValid(parsedDate)) {
        onChange({
          from: parsedDate,
          to: value?.to,
        });
      }

      if (inputToRef.current) {
        inputToRef.current.focus()
      }
    }
  };

  const handleInputToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = normalizeStringDate(e.target.value);
    setInputToValue(newValue);

    if(newValue.length === 10) {
      const parsedDate = parse(newValue, "dd/MM/yyyy", new Date(), { locale: ptBR });
      
      if (onChange && isValid(parsedDate)) {
        onChange({
          from: value?.from,
          to: parsedDate,
        });
      }
    }
  };

  useEffect(() => {
    if (open && inputFromRef.current) {
      inputFromRef.current.focus();
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
          id={id}
          name={name}
          variant="outline"
          disabled={disabled}
          className={cn(
            `${className} flex flex-col items-start justify-center gap-1 min-w-[200px] h-14 text-left font-normal`,
            !value && "text-muted-foreground"
          )}
        >
          {
            value?.from ? (
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
                value?.from ? (
                  value.to ? (
                    <>
                      { format(value.from, "P", { locale: ptBR }) } 
                      {" - "}
                      { format(value.to, "P", { locale: ptBR }) }
                    </>
                  ) : (
                    format(value.from, "P", { locale: ptBR })
                  )
                ) : (
                  <span>{ label }</span>
                )
              }
            </span>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="flex gap-2 items-center">
          <Input
            ref={inputFromRef}
            placeholder="dd/mm/aaaa"
            value={inputFromValue}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setOpen(false);
              }
            }}
            onChange={handleInputFromChange}
          />
          <Input
            ref={inputToRef}
            placeholder="dd/mm/aaaa"
            value={inputToValue}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                setOpen(false);
              }
            }}
            onChange={handleInputToChange}
          />
          {/* <Eraser 
            onClick={() => {
              setInputFromValue("");
              setInputToValue("");
              
              if (onChange) {
                onChange({
                  from: undefined,
                  to: undefined,
                });
              }
            }}
            className="h-6 w-6 cursor-pointer text-blue-500 hover:text-blue-700" 
          /> */}
        </div>
        <Calendar
          mode="range"
          selected={value}
          defaultMonth={value?.from}
          numberOfMonths={2}
          locale={ptBR}
          onSelect={(value) => {
            inputToRef.current?.focus();
            
            if (onChange) {
              onChange({
                from: value?.from,
                to: value?.to,
              });
            }

            if (value?.from && value?.to) {
              setOpen(false);
            }

            if (value?.from && isValid(value?.from)) {
              setInputFromValue(format(value.from, "dd/MM/yyyy", { locale: ptBR }));
            }

            if (value?.to && isValid(value?.to)) {
              setInputToValue(format(value.to, "dd/MM/yyyy", { locale: ptBR }));
            }
          }}
          autoFocus={false}
        />
        <button
          className="w-full mt-2 p-2 text-sm text-white bg-blue-700 rounded-md"
          onClick={() => {
            setInputFromValue("");
            setInputToValue("");

            if (onChange) {
              onChange({
                from: undefined,
                to: undefined,
              });
            }

            //setOpen(false);
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
  )
}
