import { useRef } from "react";
import { twMerge } from "tailwind-merge";

interface PDFViewer extends React.HTMLAttributes<HTMLIFrameElement> {
  className?: string;
  source: string | undefined;
}

export function PDFViewer({ source = '', className, ...props }: PDFViewer) { 
  const iframeRef = useRef<HTMLIFrameElement>(null);

  if(!source || source.trim().length === 0) {
    return (
      <div 
        className={twMerge("rounded w-full h-full bg-white dark:bg-zinc-900", className)} 
        { ...props }
      />
    )
  }

  const baseUrl = `${window.location.origin}`;
  const src = `${baseUrl}/pdfjs/web/viewer.html?file=${encodeURIComponent(source)}`;

  return (
    <iframe 
      ref={iframeRef} 
      className={twMerge('rounded w-full h-full', className)}
      src={src}
      { ...props }
    />
  )
  

}
