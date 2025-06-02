"use client";

import { Tooltip } from "@/components/tooltip";
import { Sun, Moon }  from "lucide-react";
import { HtmlHTMLAttributes, useEffect } from "react";
import { useThemeStore } from "@/zustand-store/theme.store";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/utils/classname";

interface ToggleThemeRootProps extends HtmlHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode | React.ReactNode[],
  overRideCSSClass?: boolean,
}

interface ToggleThemeTextProps extends HtmlHTMLAttributes<HTMLSpanElement> {
  text: string,
  overRideCSSClass?: boolean,
}

function ToggleThemeStartRoot({ children, ...props }: ToggleThemeRootProps) { 
  const { startThemeStore } = useThemeStore(
    useShallow((state) => ({
      startThemeStore: state.startThemeStore,
    }))
  );

  useEffect(() => {
    startThemeStore();
  }, [startThemeStore]);

  return (
    <ToggleThemeRoot {...props}>
      {children}
    </ToggleThemeRoot>
  )
}

function ToggleThemeRoot({ children, className, ...props }: ToggleThemeRootProps) { 
  const { toggleTheme } = useThemeStore(
    useShallow((state) => ({
      toggleTheme: state.toggleTheme,
    }))
  );

  return (
    <div 
      {...props}
      className={cn('cursor-pointer', className)} 
      onClick={toggleTheme}
    >
      {children}
    </div>
  )
}

function ToggleThemeIcon() { 
  const theme = useThemeStore((state) => state.theme);

  return (
    <div>
      <Tooltip.Root>
        <Tooltip.Trigger>
          {
            theme === 'light' ?
            <Sun 
              className="text-yellow-500 text-3xl" 
            /> 
            :
            <Moon 
              className="text-blue-700 text-3xl"  
            /> 
          }
        </Tooltip.Trigger>
        <Tooltip.Content side='left'>
          {theme === 'light' ? 'Mudar para tema escuro' : 'Mudar para tema claro'}
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
  )
}

function ToggleThemeText({ text, className, overRideCSSClass, ...props }: ToggleThemeTextProps) { 
  return (
    <span 
      {...props}
      className={overRideCSSClass ? className : `flex-1 ${className}`} >
      {text}
    </span>
  )
}

export const ToggleTheme = {
  Root: ToggleThemeStartRoot,
  Icon: ToggleThemeIcon,
  Text: ToggleThemeText,
}
