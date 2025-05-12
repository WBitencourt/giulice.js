"use client";
 
import * as React from "react";
import { Clock as ClockIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { TimePickerInput } from "@/components/ui/time-picker-input";
import { cn } from "@/lib/utils";
 
interface TimePickerDemoProps {
  date: Date | undefined;
  className?: string;
  onChange?: (date: Date | undefined) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}
 
export function Clock({ 
  date, 
  className,
  onKeyDown,
  onChange = () => {},
}: TimePickerDemoProps) {
  const minuteRef = React.useRef<HTMLInputElement>(null);
  const hourRef = React.useRef<HTMLInputElement>(null);
  const secondRef = React.useRef<HTMLInputElement>(null);
 
  return (
    <div className={cn(`${className} flex items-end gap-2`)}>
      <div className="grid gap-1 text-center">
        <Label htmlFor="hours" className="text-xs">
          Horas
        </Label>
        <TimePickerInput
          picker="hours"
          date={date}
          setDate={onChange}
          ref={hourRef}
          onKeyDown={onKeyDown}
          onRightFocus={() => minuteRef.current?.focus()}
        />
      </div>
      <div className="grid gap-1 text-center">
        <Label htmlFor="minutes" className="text-xs">
          Minutos
        </Label>
        <TimePickerInput
          picker="minutes"
          date={date}
          setDate={onChange}
          ref={minuteRef}
          onLeftFocus={() => hourRef.current?.focus()}
          onRightFocus={() => secondRef.current?.focus()}
          onKeyDown={onKeyDown}
        />
      </div>
      {/* <div className="grid gap-1 text-center">
        <Label htmlFor="seconds" className="text-xs">
          Segundos
        </Label>
        <TimePickerInput
          picker="seconds"
          date={date}
          setDate={onChange}
          ref={secondRef}
          onLeftFocus={() => minuteRef.current?.focus()}
        />
      </div> */}
      <div className="flex h-10 items-center">
        <ClockIcon className="ml-2 h-4 w-4" />
      </div>
    </div>
  );
}