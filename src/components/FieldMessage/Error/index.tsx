import { twMerge } from "tailwind-merge";

export interface RootProps {
  className?: string | undefined;
  visible?: boolean | undefined;
  children?: React.ReactNode;
}

export interface TextProps {
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

const Text = ({ children, className, visible = true }: TextProps) => {
  if(!visible) return null;

  return (
    <>
      { 
        children ? (
          <span 
            className={twMerge("text-red-500 rounded pl-4 p-1 text-sm", className)}
          >
            { children }
          </span>
        ) : null 
      }
    </>
  )
}

export const Error = {
  Root,
  Text,
}