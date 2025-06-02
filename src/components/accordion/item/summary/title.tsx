import { twMerge } from "tailwind-merge";

export interface SummaryTitleProps {
  children?: React.ReactNode;
  className?: string;
}

export const SummaryTitle = ({ 
  children,
  className,
}: SummaryTitleProps) => {
  return (
    <div className={twMerge('text-black dark:text-white text-base font-sans font-medium', className)}>
      {children}
    </div>
  )
}
