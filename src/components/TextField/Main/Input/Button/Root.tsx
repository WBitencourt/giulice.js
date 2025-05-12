import { ComponentProps } from "react"
import { twMerge } from "tailwind-merge"


export const ButtonRoot = ({ className, children, ...props }: ComponentProps<'div'>) => {
  return (
    <div 
      { ...props } 
      className={twMerge('flex gap-2 items-center justify-center cursor-pointer z-10', className)} 
    >
      { children }
    </div>
  )
}