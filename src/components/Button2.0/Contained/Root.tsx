import { Button } from '@/components/ui/button';
import * as React from 'react';
import { twMerge } from 'tailwind-merge';

export interface ContainedRootDefaultProps extends React.ComponentProps<'button'> {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
  disabled?: boolean;
}

export function ContainedRoot({ 
  onClick,
  children,
  className,
  visible = true,
  disabled = false,
  ...props
}: ContainedRootDefaultProps) {
  
  const handleClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if(!onClick) {
      return
    }
    
    onClick(event);
  }

  if(!visible) {
    return null;
  }

  return (
    <Button 
      { ...props }
      
      disabled={disabled}
      className={twMerge(
        'bg-opacity-80 dark:bg-opacity-95',
        className
      )}
      onClick={handleClick}
    >
      { children }
    </Button>
  )
}
