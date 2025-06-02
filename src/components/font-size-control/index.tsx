import { Tooltip } from "@/components/tooltip";
import { MinusCircle, PlusCircle } from "phosphor-react";
import { HtmlHTMLAttributes, useEffect } from "react";
import { useFontSizeStore } from "@/zustand-store/font-size.store";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/utils/classname";

interface FontSizeControlRootProps extends HtmlHTMLAttributes<HTMLDivElement> {
  children: React.ReactNode | React.ReactNode[],
}

function FontSizeControlRoot({ 
  children, 
  ...props
}: FontSizeControlRootProps) {
  return (
    <div 
      {...props} 
      className={cn('flex', props.className)}
    >
      { children }
    </div>
  )
}

function FontSizeControlActions() {
  const { 
    fontSize, 
    increaseFontSize, 
    decreaseFontSize,
    startFontSizeStore
  } = useFontSizeStore(
    useShallow(state => ({
      fontSize: state.fontSize,
      increaseFontSize: state.increaseFontSize,
      decreaseFontSize: state.decreaseFontSize,
      startFontSizeStore: state.startFontSizeStore
    }))
  );

  useEffect(() => {
    startFontSizeStore();
  }, [startFontSizeStore]);

  return (
    <div className="flex items-center gap-1 px-2 py-1 rounded-md ">
      <Tooltip.Root>
        <Tooltip.Trigger>
          <button 
            onClick={decreaseFontSize}
            className="flex items-center justify-center h-8 w-8 rounded-full cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            aria-label="Diminuir tamanho da fonte"
          >
            <MinusCircle className="h-4 w-4" weight="fill" />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Content side='bottom'>
          Diminuir tamanho do texto
        </Tooltip.Content>
      </Tooltip.Root>

      <span className="text-xs text-muted-foreground">{fontSize}px</span>

      <Tooltip.Root>
        <Tooltip.Trigger>
          <button 
            onClick={increaseFontSize}
            className="flex items-center justify-center h-8 w-8 rounded-full cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
            aria-label="Aumentar tamanho da fonte"
          >
            <PlusCircle className="h-4 w-4" weight="fill" />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Content side='bottom'>
          Aumentar tamanho do texto
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
  )
}

export const FontSizeControl = {
  Root: FontSizeControlRoot,
  Actions: FontSizeControlActions
} 