import { CheckedState } from "@radix-ui/react-checkbox";
import { Checkbox as CheckboxPrimitive } from "../ui/checkbox";
import { Label as LabelPrimitive } from "@/components/ui/label";
import { twMerge } from "tailwind-merge";

interface BoxProps {
  id?: string;
  name?: string;
  checked?: CheckedState;
  indeterminate?: boolean;
  onChange?(checked: CheckedState): void
}

function Root({ children, className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div className={twMerge("flex gap-2 items-center py-2", className)} {...props}>
      { children }
    </div>
  )
}

function Box({ id, name, checked, indeterminate = false, onChange }: BoxProps) {
  return (
    <CheckboxPrimitive
      id={id}
      name={name}
      checked={indeterminate ? 'indeterminate' : checked}
      onCheckedChange={onChange} 
    />
  )
}

function Label({ children, ...props }: React.ComponentProps<'label'>) {
  return (
    <LabelPrimitive {...props}>
      { children }
    </LabelPrimitive>
  )
}

export const Checkbox = {
  Root,
  Box,
  Label,
}
