import { Tooltip } from "@/components/Tooltip2.0";
import * as IconPrimitive from "phosphor-react";
import { HtmlHTMLAttributes } from "react";
import { useThemeStore } from "@/zustand-store/theme.store";

interface ToggleThemeRootProps extends HtmlHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode | React.ReactNode[],
  overRideCSSClass?: boolean,
}

interface ToggleThemeTextProps extends HtmlHTMLAttributes<HTMLSpanElement> {
  text: string,
  overRideCSSClass?: boolean,
}

function ToggleThemeRoot({ children, className, overRideCSSClass, ...props }: ToggleThemeRootProps) { 
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  return (
    <div 
      {...props}
      className={overRideCSSClass ? className : `flex flex-1 ${className}`} 
      onClick={toggleTheme}>
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
            <IconPrimitive.Sun 
              className="text-yellow-500 text-3xl" 
              weight="fill" 
            /> 
            :
            <IconPrimitive.MoonStars 
              className="text-blue-700 text-3xl" 
              weight="fill" 
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
  Root: ToggleThemeRoot,
  Icon: ToggleThemeIcon,
  Text: ToggleThemeText,
}
