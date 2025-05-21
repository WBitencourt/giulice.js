import {
  Tooltip as TooltipPrimitive,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
  <TooltipTrigger asChild={asChild}>
    {children}
  </TooltipTrigger>
);

const TooltipContentComponent = ({
  side,
  align,
  children,
}: TooltipContentComponentProps) => (
  <TooltipContent side={side} align={align}>
    {children}
  </TooltipContent>
);

export const Tooltip = {
  Root: TooltipRoot,
  Trigger: TooltipTriggerComponent,
  Content: TooltipContentComponent,
}
