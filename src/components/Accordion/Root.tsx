import { twMerge } from "tailwind-merge";

export interface AccordionRootProps {
  className?: string | undefined;
  children: NonNullable<React.ReactNode>;
}

export const Root = ({ className, children }: AccordionRootProps) => {
  return (
    <div className={twMerge('flex flex-col overflow-hidden gap-4', className)}>
      { children }
    </div>
  );
}