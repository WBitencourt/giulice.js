import { twMerge } from "tailwind-merge";
import { ComponentProps } from "react";

export interface SummaryRootProps extends ComponentProps<'div'> {
  children?: React.ReactNode | React.ReactNode[];
  className?: string;
}

export const SummaryRoot = ({ 
  children,
  className,
  ...props
}: SummaryRootProps) => {
  return (
    <div 
      { ...props }
      className={twMerge('grid grid-cols-[1fr_auto] p-3 col-start-1 col-end-1 text-zinc-500 dark:text-zinc-400 ', className)}
    >
      {children}    
    </div>
  )
}

// export const SummaryRoot = ({ 
//   children,
//   className,
// }: SummaryRootProps) => {
//   return (
//     <AccordionPrimitiveSummary 
//       className={twMerge('text-zinc-500 dark:text-zinc-400 bg-zinc-100/10 dark:bg-zinc-900/90', className)}
//       expandIcon={<Icon.CaretDown className='text-black dark:text-white w-min' />}
//     >
//       <div className='grid grid-cols-[1fr_auto] gap-2'>
//        {children}
//       </div>
//     </AccordionPrimitiveSummary>
//   )
// }