import { useEffect, useState } from "react";
import { Tooltip } from "../Tooltip2.0";
import { CircleCheck, Copy } from "lucide-react";
import { copyToClipBoard } from "@/utils/dom";

interface ClipboardProps {
  value: string | undefined;
}

export const Clipboard = ({ value = '' }: ClipboardProps) => {
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    if(!showCopied) {
      return;
    }

    setTimeout(() => {
      setShowCopied(false)
    }, 2000)
  }, [showCopied])

  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
      {
        showCopied ?
        <CircleCheck
          className="h-4 w-4 text-green-500 hover:text-green-700 dark:hover:text-green-300" 
        />  
        :
        <Copy 
          onClick={() => {
            copyToClipBoard(value);
            setShowCopied(true);
          }}
          className="h-4 w-4 shrink-0 opacity-50 cursor-pointer z-50" 
        />
      }
      </Tooltip.Trigger>
      <Tooltip.Content side='top'>
        {showCopied ? 'Texto copiado!' : 'Copiar para área de transferência'}
      </Tooltip.Content>
    </Tooltip.Root>
  )
}