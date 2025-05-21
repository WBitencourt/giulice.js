import { twMerge } from 'tailwind-merge';

export interface TabRootProps {
  className?: string;
  children: React.ReactNode;
}

export const TabRoot = ({ 
  className, 
  children 
}: TabRootProps) => {
  return (
    <ul 
      aria-label="Aba de navegação" 
      className={twMerge('flex items-center h-12', className)}
    >
      { children }
    </ul>
  )
}