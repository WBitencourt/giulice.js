import { Tooltip } from "@/components/Tooltip2.0"
import { useContext } from "@/components/Upload2.0/contexts";
import * as Icon from "@phosphor-icons/react"

export interface DropzoneInfoTooltipIconProps {
  visible?: boolean;
}

export const DropzoneInfoTooltipIcon = ({
  visible = true,
}: DropzoneInfoTooltipIconProps) => {
  const { list, info } = useContext();
  const { filesAccept, maxFiles, maxSizeFile, maxSizeListFile } = info;

  const totalFiles = list?.length ?? 0;

  const fileExtensionAllow = Object.keys(filesAccept ?? []).reduce((acc, object) => {
    const valueKey = (filesAccept && filesAccept[object]) ?? []
    return [ ...acc, ...valueKey]
  }, [] as string[]);

  const TooltipTitleInfo = (
    <div className="flex flex-col gap-2">
      <span>Extensões permitidas: <strong className="font-bold text-green-700">{ fileExtensionAllow.join(', ') }</strong></span>
      <span>Itens na lista: <strong className="font-bold text-green-700">{ totalFiles }</strong></span> 
      <span>Limite de itens na lista: <strong className="font-bold text-green-700">{ maxFiles ? maxFiles : 'Ilimitado' }</strong></span> 
      <span>Tamanho limite de cada arquivo: <strong className="font-bold text-green-700">{ maxSizeFile ? maxSizeFile : 'N/A' }</strong></span> 
      <span>Tamanho limite de cada arquivo na lista: <strong className="font-bold text-green-700">{ maxSizeListFile ? maxSizeListFile : 'N/A' }</strong></span> 
    </div>
  )

  if(!visible) {
    return null
  }

  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        <Icon.Info 
          className="text-2xl text-blue-500" 
          weight="duotone" 
        />
      </Tooltip.Trigger>
      <Tooltip.Content side='left'>
        {TooltipTitleInfo}
      </Tooltip.Content>
    </Tooltip.Root>
  )
}
