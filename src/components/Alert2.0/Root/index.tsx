import { ComponentProps } from 'react';
import { twMerge } from 'tailwind-merge';
import * as Icon from '@phosphor-icons/react';

export type Severity = 'error' | 'info' | 'success' | 'warning' | 'default' | undefined;

export interface AlertRootProps extends ComponentProps<'div'> {
  severity?: Severity;
  className?: string;
  visible?: boolean;
}

export interface AlertTypeProps extends ComponentProps<'div'> {
  className?: string;
  visible?: boolean;
}

export const Default = ({ className, severity, visible = true, ...props }: AlertRootProps) => {
  if(!visible) {
    return null;
  }

  switch(severity) {
    case 'error':
      return <Error { ...props } className={className} />;
    case 'info':
      return <Info { ...props } className={className} />;
    case 'success':
      return <Success { ...props } className={className} />;
    case 'warning':
      return <Warning { ...props } className={className} />;
  }

  return (
    <div 
      { ...props }
      className={twMerge("flex gap-2 w-full items-center text-black dark:text-white bg-black dark:bg-white p-3 rounded", className)}
    > 
      { props.children }
    </div>
  );
}

export const Error = ({ className, visible = true, ...props }: AlertTypeProps) => {
  if(!visible) {
    return null;
  }

  return (
    <div 
      { ...props }
      className={twMerge("flex gap-2 w-full items-center text-white dark:text-black bg-red-500 dark:bg-red-700 p-3 rounded", className)}
    > 
      <Icon.WarningCircle weight="fill" />
      { props.children }
    </div>
  );
}

export const Info = ({ className, visible = true, ...props }: AlertTypeProps) => {
  if(!visible) {
    return null;
  }

  return (
    <div 
      { ...props }
      className={twMerge("flex gap-2 w-full items-center text-white dark:text-black bg-blue-500 dark:bg-blue-700 p-3 rounded", className)}
    > 
      <Icon.WarningCircle weight="fill" />
      { props.children }
    </div>
  );
}

export const Success = ({ className, visible = true, ...props }: AlertTypeProps) => {
  if(!visible) {
    return null;
  }

  return (
    <div 
      { ...props }
      className={twMerge("flex gap-2 w-full items-center text-white dark:text-black bg-green-500 dark:bg-green-700 p-3 rounded", className)}
    > 
      <Icon.CheckCircle weight="fill" />
      { props.children }
    </div>
  );
}

export const Warning = ({ className, visible = true, ...props }: AlertTypeProps) => {
  if(!visible) {
    return null;
  }

  return (
    <div 
      { ...props }
      className={twMerge("flex gap-2 w-full items-center bg-yellow-500 dark:bg-yellow-700 p-3 rounded", className)}
    > 
      <Icon.WarningCircle weight="fill" />
      { props.children }
    </div>
  );
}