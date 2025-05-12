import { ComponentProps } from "react";
import { twMerge } from "tailwind-merge";

export interface AlertMessageProps extends ComponentProps<'span'> {
  className?: string;
}

export const Message = ({ className, ...props }: AlertMessageProps) => {
  return (
    <span 
      { ...props }
      aria-label='Mensagem de alerta'
      className={twMerge("flex gap-2 w-full items-center text-white dark:text-black", className)}
    > 
      { props.children }
    </span>
  );

}