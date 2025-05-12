import * as React from 'react';
import { twMerge } from 'tailwind-merge';

export interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  className?: string;
  label: string;
  value: string;
  visible?: boolean;
  disabled?: boolean;
  highlight?: boolean;
  onBlur?: (event: React.FocusEvent<HTMLTextAreaElement>) => void;
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export function TextArea({
  id,
  className,
  label,
  value,
  visible = true,
  disabled = false,
  highlight = false,
  onChange,
  onBlur,
  ...props
}: TextAreaProps) {
  const [isFocused, setIsFocused] = React.useState(false);

  const handleFocus = () => setIsFocused(true);
  
  const handleBlur = (event: React.FocusEvent<HTMLTextAreaElement, Element>) => {
    setIsFocused(value.length > 0)

    if(!onBlur) {
      return
    }

    onBlur(event);
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if(!onChange) {
      return
    }

    onChange(event);
  };

  if(!visible) {
    return null;
  }

  const textareaID = id ?? props.name ?? 'textarea-' + Math.random().toString(36).substring(7);

  return (
    <div 
      className='relative flex flex-col w-full'
    >
      <label
        data-textarea-focused={isFocused || value.trim().length > 0}
        data-highlight={highlight}
        className={twMerge(
          [
            'data-[highlight=true]:text-red-500',
            'data-[highlight=true]:dark:text-red-400',
            'absolute left-3 pr-6 transition-all duration-300 ease-in-out truncate w-full max-w-[95%]',
            'text-zinc-400',
            'text-sm top-4 z-0',
            'data-[textarea-focused=true]:text-xs',
            'data-[textarea-focused=true]:top-[1px]',
            'data-[textarea-focused=true]:py-2',
            'data-[textarea-focused=true]:z-50',
          ].join(' '), className
        )}
        htmlFor={textareaID}
      >
        { label }
      </label>
      <textarea
        { ...props }
        id={textareaID}
        disabled={disabled}
        data-label={label.trim().length > 0}
        data-disabled={disabled} 
        className={twMerge('hover:text-accent-foreground hover:bg-accent hover:dark:text-accent-foreground hover:dark:bg-accent border text-sm resize-y data-[disabled=true]:cursor-not-allowed data-[label=true]:pt-7 pt-2 px-3 min-w-[200px] min-h-[125px] rounded bg-white dark:bg-zinc-950', className)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleChange}
        value={value}
      >
      </textarea>
    </div>
  );
}
