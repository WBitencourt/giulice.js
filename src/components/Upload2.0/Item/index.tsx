import { Tooltip } from "@/components/Tooltip2.0"
import * as Icon from "@phosphor-icons/react"
import { CircularProgressbar } from "react-circular-progressbar";
import { twMerge } from "tailwind-merge"
import { useContext } from "../contexts";

interface RootProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
}

interface RowNameProps {
  tooltip?: string | React.ReactNode;
  selected?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

interface RowActionRootProps {
  className?: string;
  children: React.ReactNode;
}

interface RowActionDownloadProps {
  tooltip?: string | React.ReactNode;
  disabled?: boolean;
  fileName: string;
  url: string;
  className?: string;
  children?: React.ReactNode;
}

interface RowActionLinkProps {
  tooltip?: string | React.ReactNode;
  disabled?: boolean;
  url: string;
  className?: string;
  children?: React.ReactNode;
}

interface RowActionStatusProps {
  tooltip?: string | React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}

interface RowStatusPendingProps {
  tooltip?: string | React.ReactNode;
  progress: number;
  className?: string;
  children?: React.ReactNode;
}

interface RowPreviewProps {
  className?: string;
  children: React.ReactNode;
}

interface RowDescriptionProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

interface RowSizeProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

interface RowRemoveProps {
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

interface RowRetryProps {
  tooltip?: string | React.ReactNode;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

interface PreviewImageProps {
  src: string;
}

const Root = ({ className, children, ...props }: RootProps) => {
  if(!children ) {
    return null;
  }
  
  return (
    <div 
      className={twMerge("grid grid-cols-[auto_1fr_auto] grid-rows-[min_auto] gap-2 p-2 bg-zinc-100 dark:bg-zinc-900 rounded", className)}
      {...props}
    >
      { children }
    </div>
  )
}

const RowName = ({ tooltip, selected, onClick, className, children }: RowNameProps) => {
  return (
    <div 
      onClick={onClick} 
      className={twMerge('truncate col-start-2 col-end-2 ', className)}>
      <Tooltip.Root>
        <Tooltip.Trigger>
          <div 
            data-selected={selected}
            className='font-bold text-sm truncate text-zinc-400 data-[selected=true]:text-black dark:data-[selected=true]:text-white'
          >
            { children }
          </div>
        </Tooltip.Trigger>
        <Tooltip.Content side='bottom'>
          {tooltip}
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
  )
}

const RowActionRoot = ({ className, children }: RowActionRootProps) => {
  return (
    <div className={twMerge('flex justify-end gap-1 col-start-3 col-end-3 sm-max:flex-col sm-max:row-start-2 sm-max:row-end-2', className)}>
      { children }
    </div>
  )
}

const RowDownload = ({ tooltip, disabled = undefined, fileName, url, className, children }: RowActionDownloadProps) => {
  const { disabledGlobal } = useContext();

  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        {
          children ? children : 
          <a 
            href={disabled ?? disabledGlobal ? undefined : url} 
            download={fileName}
            rel="noreferrer"
            target="_blank"
          >
            <Icon.DownloadSimple 
              data-disabled={disabled ?? disabledGlobal}
              className={twMerge('data-[disabled=true]:cursor-not-allowed text-xl cursor-pointer z-10 text-cyan-500', className)} 
            />
          </a> 
        }
      </Tooltip.Trigger>
      <Tooltip.Content side='bottom'>
        {tooltip ? tooltip : 'Baixar'}
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

const RowLink = ({ tooltip, disabled = undefined, url, className, children }: RowActionLinkProps) => {
  const { disabledGlobal } = useContext();

  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        {
          children ? children : 
          <a
            rel="noreferrer"
            href={disabled ?? disabledGlobal ? undefined : url} 
            target="_blank"
            
          >
            <Icon.LinkSimple 
              data-disabled={disabled ?? disabledGlobal}
              className={twMerge('data-[disabled=true]:cursor-not-allowed text-xl cursor-pointer z-10 text-cyan-500', className)} 
            />
          </a>
        }
      </Tooltip.Trigger>
      <Tooltip.Content side='bottom'>
        {tooltip ? tooltip : 'Abrir arquivo em uma nova aba'}
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

const RowStatusSuccess = ({ tooltip, className, children }: RowActionStatusProps) => {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        {
          children ? children : 
          <Icon.CheckCircle 
            className={twMerge('text-xl z-10 text-green-500', className)} 
            weight='fill' 
          />
        }
      </Tooltip.Trigger>
      <Tooltip.Content side='bottom'>
        {tooltip ? tooltip : 'Upload realizado com sucesso'}
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

const RowStatusFailure = ({ tooltip, className, children }: RowActionStatusProps) => {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        {
          children ? children : 
          <Icon.WarningCircle 
            className={twMerge('text-xl z-10 text-red-500', className)} 
            weight='fill' 
          />
        }
      </Tooltip.Trigger>
      <Tooltip.Content side='bottom'>
       {tooltip ? tooltip : 'Falha ao fazer o upload'}
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

const RowStatusPending = ({ tooltip, progress, className, children }: RowStatusPendingProps) => {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        {
          children ? children : 
          <CircularProgressbar 
            styles={{
              root: { width: 20, height: 20 },
              path: { stroke: '#ff9c31'}
            }}
            className='bg-zinc-950 border-1 border-zinc-700 rounded-full'
            strokeWidth={10}
            value={progress}
          />
        }
      </Tooltip.Trigger>
      <Tooltip.Content side='bottom'>
        {tooltip ? tooltip : `Upload em ${progress}%`}
      </Tooltip.Content>
    </Tooltip.Root>
  )
}

const RowPreview = ({ className, children }: RowPreviewProps) => {
  return (
    <div className={twMerge('col-start-1 col-end-1 sm-max:sr-only', className)}>
      { children }
    </div>
  )
}

const RowPreviewImage = ({ src }: PreviewImageProps) => {
  return (
    <div
      className="w-9 h-9 rounded-md bg-no-repeat bg-cover bg-center mr-2"
      style={{ backgroundImage: `url(${src})` }}
    />
  );
};

const RowDescription = ({ className, onClick, children }: RowDescriptionProps) => {
  return (
    <p 
      onClick={onClick}
      className={twMerge('col-start-2 col-end-2 text-xs text-gray-500 dark:text-gray-400', className)}>
      { children }
    </p>
  )
}

const RowSize = ({ className, onClick, children }: RowSizeProps) => {
  return (
    <span 
      onClick={onClick}
      className={twMerge('flex text-xs col-start-3 col-end-3 items-center justify-end sm-max:sr-only z-10', className)}>
      { children }
    </span>
  )
}

const RowRemove = ({ className, disabled = undefined, onClick, children }: RowRemoveProps) => {
  const { disabledGlobal } = useContext();

  return (
    <span 
      onClick={disabled ?? disabledGlobal ? undefined : onClick} 
      data-disabled={disabled ?? disabledGlobal}
      className={twMerge('data-[disabled=true]:cursor-not-allowed col-start-2 col-end-3 text-xs w-fit text-red-700 cursor-pointer hover:text-red-500', className)}
    >
      { children }
    </span>
  )
}

const RowRetry = ({ tooltip, disabled = undefined, onClick, className, children }: RowRetryProps) => {
  const { disabledGlobal } = useContext();

  return (
    <Tooltip.Root>
      <Tooltip.Trigger>
        {
          children ? children : 
          <Icon.ArrowClockwise
            onClick={(disabled ?? disabledGlobal) ? () => {} : onClick} 
            data-disabled={disabled ?? disabledGlobal}
            className={twMerge('data-[disabled=true]:cursor-not-allowed text-lg z-10 text-black dark:text-white', className)} 
            weight='fill' 
          />
        }
      </Tooltip.Trigger>
      <Tooltip.Content side='bottom'>
        {tooltip ? tooltip : 'Tentar enviar o arquivo novamente'}
      </Tooltip.Content>
    </Tooltip.Root>
  )

}

export const Row = {
  Root: Root,
  Name: RowName,
  Action: {
    Root: RowActionRoot,
    Download: RowDownload,
    Link: RowLink,
    Retry: RowRetry,
    Status: {
      Success: RowStatusSuccess,
      Failure: RowStatusFailure,
      Pending: RowStatusPending,
    },
  },
  Preview: {
    Root: RowPreview,
    Image: RowPreviewImage,
  },
  Description: RowDescription,
  Size: RowSize,
  Remove: RowRemove,
}