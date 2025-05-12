import { twMerge } from "tailwind-merge";

export interface RootProps {
  className?: string | undefined;
  visible?: boolean | undefined;
  children?: React.ReactNode;
}

export interface TipProps {
  className?: string | undefined;
  visible?: boolean | undefined;
  children?: React.ReactNode;
}

const Root = ({ children, className, visible = true }: RootProps) => {
  if(!visible) return null;

  return (
    <div 
      className={twMerge("flex flex-col gap-1", className)} 
    >
      { children }
    </div>
  )
}

const Text = ({ children, className, visible = true }: TipProps) => {
  if(!visible) return null;

  return (
    <>
      { 
        children ? (
          <span 
            className={twMerge("text-blue-500 dark:text-blue-600 rounded pl-4 p-1 text-sm bg-zinc-200 dark:bg-zinc-950", className)}
          >
            { children }
          </span>
        ) : null 
      }
    </>
  )
}

export const Tip = {
  Root,
  Text,
}