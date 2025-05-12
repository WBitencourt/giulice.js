import * as React from 'react';
import Link from 'next/link'
import { Tooltip, TooltipDirection } from '../Tooltip2.0';
import { twMerge } from 'tailwind-merge';

export interface BreadcrumbsRootProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode | React.ReactNode[],
}

export interface BreadcrumbsSeparatorProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
  children?: string | React.ReactNode,
}

export interface BreadcrumbsLinkProps {
  label?: string, 
  icon: React.ReactNode,
  navigateTo: string,
}

export interface BreadcrumbsNoLinkProps {
  label?: string, 
  icon: React.ReactNode,
  toolTipDirection?: TooltipDirection;
}

function BreadcrumbsRoot({ className, children, ...props }: BreadcrumbsRootProps) {
  return (
    <div className={twMerge('flex items-center space-x-2', className)}{...props}>
      {children}
    </div>
  );
}

function BreadcrumbsSeparator({ className, children, ...props }: BreadcrumbsSeparatorProps) {
  return (
    <div {...props} className={twMerge('text-nowrap font-semibold text-sm text-zinc-800 dark:text-zinc-200', className)}>
      {children ?? '->'}
    </div>
  );
}

function BreadcrumbsLink({ label, icon, navigateTo }: BreadcrumbsLinkProps) {
  return (
    <Link 
      href={navigateTo}  
      className='flex no-underline'
    >
      {icon}
      <span className="text-zinc-800 dark:text-zinc-200">{label}</span>
    </Link>
  )
}

function BreadcrumbsNoLink({ label, icon, toolTipDirection = "right" }: BreadcrumbsNoLinkProps) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        <div className='flex'>
          {icon}
          <span className="text-zinc-800 dark:text-zinc-200 font-bold">{label}</span>
        </div>
      </Tooltip.Trigger>
      <Tooltip.Content side={toolTipDirection}>
        Página atual
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

export const Breadcrumbs = {
  Root: BreadcrumbsRoot,
  Link: BreadcrumbsLink,
  Text: BreadcrumbsNoLink,
  Separator: BreadcrumbsSeparator
}
