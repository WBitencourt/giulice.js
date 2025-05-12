"use client"

import { useEffect, useRef, useState } from "react"
import { Check, CheckCircle, ChevronsUpDown, CircleCheck, CirclePlus, Copy } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Clipboard } from "@/components/Clipboard"
import { v4 as uuid } from "uuid"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

export interface AutocompleteSingleOption {
  label: string;
  value: string;
}

export interface AutocompleteSingleProps {
  id?: string
  name?: string,
  options: AutocompleteSingleOption[] | undefined,
  label: string,
  selectedOption: AutocompleteSingleOption | undefined,
  disabled?: boolean;
  freeSolo?: boolean;
  visible?: boolean;
  className?: string;
  showClipBoard?: boolean;
  highlight?: boolean;
  isLoadingOptions?: boolean;
  onChange?: (selectedOption: AutocompleteSingleOption | undefined) => void;
}

export function AutocompleteSingle({ 
  id,
  name,
  options = [],
  label,
  selectedOption,
  disabled = false,
  freeSolo,
  visible = true,
  className,
  showClipBoard,
  highlight,
  onChange,
  isLoadingOptions 
 }: AutocompleteSingleProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const labelItem = freeSolo || disabled ? selectedOption?.label : options
    .find((item) => item.value === selectedOption?.value)?.label;

  const hasValue = selectedOption?.value && selectedOption?.value?.length > 0;

  if (!visible) {
    return null
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);

    if (onChange) {
      onChange({
        label: e.target.value,
        value: e.target.value,
      });
    }
  };

  return (
    <Popover 
      open={open} 
      onOpenChange={(open) => {
        setOpen(open)

        if(open && inputRef.current) {
          inputRef.current.focus();
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          id={id}
          name={name}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          data-disabled={disabled}
          className={cn(
            `flex ${className} min-w-[200px] h-14 justify-between`, 
          )}
        >
          <div className="flex flex-col items-start truncate w-full max-w-full">
            <label 
              data-has-value={hasValue}
              data-highlight={highlight}
              className="text-sm data-[has-value=true]:text-xs text-zinc-500 data-[highlight=true]:text-red-500"
            >
              { label  }
            </label>
            <span 
              data-highlight={highlight}
              className="data-[highlight=true]:text-red-500 text-black dark:text-white "
            >
              { labelItem }
            </span>
          </div>
          <div className="flex gap-2 ml-2">
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      
      {
        showClipBoard ? (
          <Clipboard value={selectedOption?.label}/>
        ) : null
      }

      <PopoverContent className="w-full p-4">
        {
          freeSolo ? (
            <div className="flex flex-col gap-4 p-4 items-center">
              <label className="text-xs">
                {label}
              </label>
              <Input
                ref={inputRef}
                placeholder='Digite aqui para alterar o texto'
                onKeyDown={(e) => {
                  if(e.key === 'Enter') {
                    setOpen(false);
                  }
                }}
                value={inputValue}
                onChange={handleInputChange}
              />
            </div>
          ) : null
        }
        <Command>
          {
            isLoadingOptions ? (
              <span className="flex items-center justify-center text-sm mb-4">
                Carregando lista...
              </span>
            ) : (
              <>
                <CommandInput 
                  placeholder='Digite aqui para filtrar' 
                />
                <CommandList>
                  <CommandEmpty>Nenhum item encontrado.</CommandEmpty>
                  <CommandGroup>
                    {options.map(option => {
                      return {
                        ...option,
                        id: uuid(),
                      }
                    }).map((option) => (
                      <CommandItem
                        key={option.id}
                        value={option.value}
                        onSelect={(currentValue) => {
                          if(onChange) {
                            onChange(options.find((option) => option.value === currentValue))
                          }

                          setOpen(false)
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedOption?.value === option.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        { option.label }
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </>
            )
          }
        </Command>
        <button
          className="w-full mt-4 p-2 text-sm text-white bg-blue-700 rounded-md"
          onClick={() => {
            setInputValue("");

            if (onChange) {
              onChange(undefined);
            }

            setOpen(false);
          }}
        >
          Limpar e fechar
        </button>
      </PopoverContent>
    </Popover>
  )
}
