import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

export interface AccordionContentItemProps extends ComponentProps<'div'> {
  className?: string | undefined;
  expanded?: boolean;
  children?: React.ReactNode | React.ReactNode[] | undefined;
}

export const ContentItem = ({ 
  className,
  expanded = false,
  children, 
  ...props
}: AccordionContentItemProps) => {
  if(!expanded) {
    return null;
  }
  
  return (
    <div 
      { ...props }
      className={twMerge([
        'flex flex-col gap-4 px-3 pb-3 cursor-default', 
        'text-black dark:text-white', 
        'group-data-[disabled=true]:text-zinc-500', 
        'group-data-[disabled=true]:dark:text-zinc-500', 
        'group-data-[disabled=true]:cursor-not-allowed'
      ].join(' '), className) }
    >
      { children }
    </div>
  )
}

// export const ContentItem = ({ 
//   className,
//   children, 
// }: AccordionContentItemProps) => {
//   return (
//     <AccordionPrimitiveContent 
//       className={ 
//         twMerge([
//           'flex flex-col gap-4 cursor-default', 
//           'text-black dark:text-white', 
//           'group-data-[disabled=true]:text-zinc-500', 
//           'group-data-[disabled=true]:dark:text-zinc-500', 
//           'group-data-[disabled=true]:cursor-not-allowed'
//         ].join(' '), className) }
//     >
//       { children }
//     </AccordionPrimitiveContent>
//   )
// }