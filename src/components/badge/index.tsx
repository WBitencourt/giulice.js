import * as React from 'react';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps {
  value: number | undefined;
  valueMax?: number | undefined;
  showZero?: boolean;
  children: React.ReactNode;
}

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

interface ContentAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}


interface BadgeCountAreaProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number | undefined;
  valueMax?: number | undefined;
  showZero?: boolean;
}

const Root = ({ className, children, ...props }: RootProps) => {
  return (
    <div 
      className={twMerge('relative flex items-center justify-center', className)}
      { ...props} 
    >
      { children }
    </div>
  )
}

const ContentArea = ({ className, children, ...props }: ContentAreaProps) => {
  return (
    <div 
      className={twMerge('', className)}
      //className='pr-3' //data-[hasValue=true]:
      { ...props} 
    >
      { children }
    </div>
  )
}

const BadgeCountArea = ({ 
  value = 0, 
  valueMax = 999, 
  showZero = false,
  className,
  ...props
}: BadgeCountAreaProps) => {

  const getBadgeValue = () => {
    if(!showZero && value === 0) {
      return null;
    }

    if(value > valueMax) {
      return `${valueMax}+`;
    }

    return value;
  }

  const badgeValue = getBadgeValue();

  if(!badgeValue) {
    return null;
  }

  return (
    <span 
      data-threeunits={value > 99}
      className={twMerge('data-[threeunits=true]:-right-5 absolute flex items-center justify-center min-w-4 min-h-4 text-white dark:text-black dark:font-bold font-semibold text-[10px] px-1 -top-1 -right-3 bg-black dark:bg-white rounded-full', className)}
      { ...props }
    >
      { badgeValue }
    </span>
  )
}

export const Badge = {
  Root,
  ContentArea,
  BadgeCountArea,
}


// export function Badge({
//   value = 0,
//   valueMax = 999,
//   showZero = false,
//   children,
// }: BadgeProps) {
//   //value = 880;
//   const getBadgeValue = () => {
//     if(!showZero && value === 0) {
//       return null;
//     }

//     if(value > valueMax) {
//       return `${valueMax}+`;
//     }

//     return value;
//   }

//   const badgeValue = getBadgeValue();

//   return (
//     <div className='relative flex items-center justify-center'>
//       <div 
//         data-hasValue={value > 0} 
//         className='pr-3' //data-[hasValue=true]:
//       >
//         { children }
//       </div>
//       {
//         badgeValue && 
//         <span className='absolute flex items-center justify-center min-w-4 min-h-4 text-white dark:text-black text-[10px] px-1 -top-1 -right-2 bg-black dark:bg-white rounded-full'>
//           { badgeValue }
//         </span>
//       }
//       {
//         badgeValue && 
//         <span className='absolute flex items-center justify-center min-w-4 min-h-4 text-white text-[10px] px-1 top-3 -right-2 bg-red-500 rounded-full'>
//           { badgeValue }
//         </span>
//       }
//     </div>
//   )

//   // return (
//   //   <BadgePrimitive 
//   //     color={color} 
//   //     badgeContent={830} 
//   //     max={valueMax}    
//   //     showZero={showZero}
//   //   >
//   //     { children }
//   //   </BadgePrimitive>
//   // )
// }
