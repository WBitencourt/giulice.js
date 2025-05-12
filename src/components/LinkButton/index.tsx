import * as React from 'react';
import * as Icon from '@phosphor-icons/react'
import { IconProps } from '@phosphor-icons/react';
import { ForwardRefExoticComponent } from 'react';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';

export interface LinkButtonProps extends React.ButtonHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  classNameDisabled?: string;
  href?: string;
  onClick?: () => void;
}

export interface LinkButtonLabelProps extends React.ButtonHTMLAttributes<HTMLSpanElement> {
  children?: React.ReactNode;
  text?: string;
}

export interface LinkButtonIconProps extends ForwardRefExoticComponent<IconProps> {
  className?: string;
}

interface LinkButtonDisabledProps extends React.ButtonHTMLAttributes<HTMLAnchorElement> {
  size?: string | undefined;
}

const DisabledLink = ({ children, className, ...props }: LinkButtonDisabledProps) => {
  return (
    <a
      href="#"
      style={{ pointerEvents: 'none' }}
      disabled={true}
      className={!className ? 'flex gap-2 items-center text-blue-800' : className}
      {...props}
    >
      {children}
    </a>
  );
};

export const LinkButtonRoot = ({ 
  children,
  className, 
  disabled,
  onClick,
  classNameDisabled,
  href = '',
  ...props 
}: LinkButtonProps) => {
  return (
    disabled ? 
    <DisabledLink className={classNameDisabled}>{children}</DisabledLink> 
    :
    <Link 
      href={href}
      onClick={onClick}
      className={twMerge('flex gap-2 items-center cursor-pointer text-blue-500 hover:text-blue-500/80', className)}
      { ...props }
    >
      {children}
    </Link>
  );
}

export const LinkButtonLabel = ({ text, children, className, ...props }: LinkButtonLabelProps) => {
  return (
    <span className={className} { ...props }>
      { [text, children] }
    </span>
  );
}

export const LinkButton = {
  Root: LinkButtonRoot,
  Icon: Icon,
  Label: LinkButtonLabel,
}
