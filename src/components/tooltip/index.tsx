'use client';

import {
  Tooltip as TooltipPrimitive,
  TooltipContent as TooltipContentPrimitive,
  TooltipProvider,
  TooltipTrigger as TooltipTriggerPrimitive,
} from "@/components/shadcn/tooltip"

export interface TooltipProps {
  children: React.ReactNode;
}

export interface TooltipTriggerComponentProps {
  asChild?: boolean;
  children: React.ReactNode;
}

export type TooltipDirection = "bottom" | "left" | "right" | "top";
export type TooltipAlign = "center" | "end" | "start";

export interface TooltipContentComponentProps {
  side?: TooltipDirection;
  align?: TooltipAlign;
  children: React.ReactNode | React.ReactNode[] | string ;
}

const TooltipRoot = ({ children }: TooltipProps) => (
  <TooltipProvider>
    <TooltipPrimitive>
      {children}
    </TooltipPrimitive>
  </TooltipProvider>
);

const TooltipTriggerComponent = ({ asChild = true, children }: TooltipTriggerComponentProps) => (
  <TooltipTriggerPrimitive asChild={asChild}>
    {children}
  </TooltipTriggerPrimitive>
);

const TooltipContentComponent = ({
  side,
  align,
  children,
}: TooltipContentComponentProps) => (
  <TooltipContentPrimitive side={side} align={align}>
    {children}
  </TooltipContentPrimitive>
);

export const Tooltip = {
  Root: TooltipRoot,
  Trigger: TooltipTriggerComponent,
  Content: TooltipContentComponent,
}
