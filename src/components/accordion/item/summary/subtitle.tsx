import { twMerge } from "tailwind-merge";

export interface SummarySubTitleProps {
  children?: React.ReactNode;
  className?: string;
}

export const SummarySubTitle = ({ 
  children,
  className,
}: SummarySubTitleProps) => {
  return (
    <p className={twMerge('text-black dark:text-white row-start-2 col-start-1 col-end-3 text-base font-sans', className)}>
      {children}
    </p>
  )
}