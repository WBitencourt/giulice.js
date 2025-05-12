import * as React from 'react';
import { Skeleton as SkeletonPrimitive } from "@/components/ui/skeleton"

interface SkeletonRootProps extends React.ComponentProps<'div'> {
  children: React.ReactNode;
}

interface SkeletonCircularProps {
  width?: string | undefined;
  height?: string | undefined;
}

interface Skeleton {
  Root: (props: SkeletonRootProps) => JSX.Element,
  Linear: () => JSX.Element,
  Circular: (props: SkeletonCircularProps) => JSX.Element,
  Rounded: () => JSX.Element,
  RoundedFlex: () => JSX.Element,
}

const Root = ({children, ...props}: SkeletonRootProps) => {
  return (
    <div {...props}>
      {children}
    </div>
  );
}

const Paragraph = () => {
  return (
    <SkeletonPrimitive className="h-4" />
  );
}

const Circular = () => {
  return (
    <SkeletonPrimitive className="h-12 w-12 rounded-full" />
  );
}

const Card = () => {
  return (
    <SkeletonPrimitive className="h-[125px] rounded-xl" />
  );
}

const Input = () => {
  return (
    <SkeletonPrimitive className="h-[50px] rounded-md" />
  );
}

const Button = () => {
  return (
    <SkeletonPrimitive className="h-[30px] rounded-md" />
  );
}

export const Skeleton = {
  Root,
  Paragraph,
  Circular,
  Card,
  Input,
  Button,
  Custom: SkeletonPrimitive,
}
