import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"

export const InputRoot = ({ className, children, ...props }: ComponentProps<'div'>) => {
  return (
    <div 
      {...props} 
      className={twMerge('flex w-full items-center gap-2', className)}
    >
      { children }
    </div>
  )
}