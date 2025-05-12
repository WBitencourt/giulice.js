import React from "react";
import { FileRejection } from "react-dropzone";
import { twMerge } from "tailwind-merge";
import { DropzoneBag } from "..";
import { useContext } from "@/components/Upload2.0/contexts";

export interface StatusDropzone {
  isActive: boolean;
  isReject: boolean;
  isDisabled: boolean;
  acceptedFiles: File[];
  fileRejections: FileRejection[];
}

interface DragProps {
  className?: string;
  children?: React.ReactNode | React.ReactNode[];
}

interface DragViewProps {
  disabled?: boolean;
  dropzoneBag: DropzoneBag;
}

export const DragPrettierLayout = ({ className, children }: DragProps) => {
  return (
    <p 
      className={twMerge([
        "flex items-center justify-center text-center p-2 min-h-10 cursor-pointer w-full",
        "rounded border-2 border-dashed font-sans",
      ].join(' '), className)}
    >
      { children }
    </p>
  )
}

const DragDisabled = ({ className, children }: DragProps) => {
  return (
    <DragPrettierLayout
      className={twMerge([
        "border-zinc-300 dark:border-zinc-600",
        "text-zinc-500  dark:text-zinc-400",
      ].join(' '), className)}
    >
      { children ? children : 'Formulário bloqueado para upload' }
    </DragPrettierLayout>
  )
}

const DragStandby = ({ className, children }: DragProps) => {
  return (
    <DragPrettierLayout
      className={twMerge([
        "border-zinc-300 hover:border-zinc-600",
        "dark:border-zinc-600 dark:hover:border-zinc-300",
        "text-zinc-500 dark:text-zinc-400",
        "hover:text-zinc-900  dark:hover:text-white",
      ].join(' '), className)}
    >
      { children ? children : 'Clique aqui para adicionar arquivos' } 
    </DragPrettierLayout>
    //Clique ou arraste seus arquivos aqui...
  )
}

const DragActive = ({ className, children }: DragProps) => {
  return (
    <DragPrettierLayout
      className={twMerge([
        "border-green-600 text-green-400",
      ].join(' '), className)}
    >
      { children ? children : 'Solte os arquivos aqui...'}
    </DragPrettierLayout>
  )
}

const DragReject = ({ className, children }: DragProps) => {
  return (
    <DragPrettierLayout
      className={twMerge([
        "border-orange-600 text-orange-400",
      ].join(' '), className)}
    >
      { children ? children: 'Todos os anexos ou parte deles podem não ser aceitos. Verifique o formato, a quantidade e o tamanho dos arquivos permitidos.' }
    </DragPrettierLayout>
  )
}

export const DragRoot = ({ className, children }: DragProps) => {
  return (
    <div className={twMerge("flex items-center gap-2", className)}>
      { children }
    </div>
  )
}

export const DragView = ({ dropzoneBag }: DragViewProps) => {
  const { disabledGlobal } = useContext();
  const { isDragActive, isDragReject } = dropzoneBag;

  if(dropzoneBag.disabled || disabledGlobal) return (
    <DragDisabled>
      Formulário bloqueado para upload
    </DragDisabled>
  )

  if(isDragActive && isDragReject) return (
    <DragReject>
      Todos os arquivos ou parte deles podem não ser aceitos. Verifique o formato, a quantidade e o tamanho dos arquivos permitidos.
    </DragReject>
  )

  if(isDragActive && !isDragReject) return (
    <DragActive>
      Solte seus arquivos aqui
    </DragActive>
  )

  return (
    <DragStandby>
      Clique aqui para adicionar arquivos
    </DragStandby>
    // <DragStandby>
    //   Clique ou arraste seus arquivos aqui...
    // </DragStandby>
  )
}