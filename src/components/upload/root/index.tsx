import { twMerge } from 'tailwind-merge';
import { UploadProvider, ProviderBagProps, UploadRootHandles } from '../contexts';
import { forwardRef } from 'react';

export interface UploadRootProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode | React.ReactNode[];
}

export const UploadRoot = ({ className, children, ...props }: UploadRootProps) => {
  return (
    <div 
      className={twMerge("flex flex-col gap-2 p-2 rounded overflow-y-hidden bg-white dark:bg-zinc-950", className)}
      { ...props }
    >
      { children }
    </div>
  );
}

const UploadProviderBagRef = <T,>({ 
  initialList,
  visible = true,
  disabled = false,
  onProcessUpload,
  onChange,
  children,
}: ProviderBagProps<T>, ref: React.Ref<UploadRootHandles<T>>) => {
  if (!visible) return null;

  return (
    <UploadProvider 
      ref={ref}
      initialList={initialList}
      disabledGlobal={disabled}
      onChange={onChange}
      onProcessUpload={onProcessUpload}
    >
      { children }
    </UploadProvider>
  );
}

export const UploadProviderBag = forwardRef(UploadProviderBagRef) as <T>(props: ProviderBagProps<T> & { ref?: React.Ref<UploadRootHandles<T>> }) => ReturnType<typeof UploadProviderBagRef>;
