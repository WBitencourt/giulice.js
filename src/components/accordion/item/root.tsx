import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';

export interface AccordionItemRootProps extends ComponentProps<'div'> {
  disabled?: boolean;
  visible?: boolean;
}

export const ItemRoot = ({ 
  disabled = false, 
  visible = true,
  className, 
  children,
  ...props
}: AccordionItemRootProps) => {

  if(!visible) {
    return null;
  }

  return (
    <div 
      { ...props }
      data-disabled={disabled}
      className={twMerge('group flex flex-col gap-2 rounded no-underline data-[disabled=true]:cursor-not-allowed data-[disabled=false]:cursor-pointer bg-white dark:bg-zinc-800', className) }
    >
      { children }
    </div>
  );
}

// export const ItemRoot = ({ 
//   id,
//   expanded = false, 
//   disabled = false, 
//   className, 
//   children,
//   onChange,
// }: AccordionItemRootProps) => {
//   return (
//     <AccordionPrimitive 
//       id={id}
//       disabled={disabled}
//       data-disabled={disabled}
//       className={ twMerge('group flex flex-1 flex-col no-underline data-[disabled=true]:cursor-not-allowed data-[disabled=false]:cursor-pointer', className) }
//       expanded={expanded} 
//       onChange={onChange}>
//       { children ?? <></> }
//     </AccordionPrimitive>
//   );
// }
