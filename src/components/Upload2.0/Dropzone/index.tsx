'use client'

import DropzonePrimitive, { Accept, DropEvent, DropzoneState, FileError, FileRejection, useDropzone } from "react-dropzone";
import React, { useEffect } from "react";
import { useContext } from "../contexts";

export interface DropzoneBag extends DropzoneState {
  disabled: boolean;
}

export interface BagDropzoneProps {
  isDragActive: boolean;
  isDragReject: boolean;
  isDragDisable: boolean;
  fileRejections: FileRejection[];
  acceptedFiles: File[];
}

export interface DropzoneToggleOpenProps {
  children: React.ReactNode;
  show?: boolean;
  className?: string;
}

export interface DropzoneProps {
  filesAccept?: Accept | undefined;
  disabled?: boolean;
  multiple?: boolean;
  visible?: boolean;
  maxFiles?: number | undefined;
  maxSizeFile?: string | undefined;
  maxSizeListFile?: string | undefined;
  children: (bag: DropzoneBag) => React.ReactNode | React.ReactNode[];
  onDropAccepted?: (event: DropEvent, files: File[]) => void;
  onDropRejected?: (event: DropEvent, files: FileRejection[]) => void;
}

export interface DropzoneRootProps {
  children: React.ReactNode | React.ReactNode[];
  visible?: boolean;
}

export interface DropzoneToggleOpenProps {
  show?: boolean;
  children: React.ReactNode;
  visible?: boolean;
}

function exampleValidator(file: File) {
  if (file.name.length > 10) {
    return {
      code: "file-invalid-type",
      message: `Name is larger than 10 characters`
    };
  }

  return null
}

export const DropzoneRoot = ({ children, visible = true }: DropzoneRootProps) => {
  if(!visible) {
    return null;
  }
  
  return (
    <div className="flex items-center gap-2">
      { children }
    </div>
  );
}

export const Dropzone = ({ 
  filesAccept,
  disabled = false,
  multiple = true,
  visible = true,
  maxFiles = undefined,
  maxSizeFile = undefined,
  maxSizeListFile = undefined,
  children,
  onDropAccepted,
  onDropRejected,
}: DropzoneProps) => {
  const { updateInfo, disabledGlobal } = useContext();

  const dropzoneBag = useDropzone({
    accept: filesAccept,
    disabled,
    multiple,
    maxFiles,
    onDropAccepted: (files, event) => handleOnDropAccepted(files, event),
    onDropRejected: (files, event) => handleOnDropRejected(files, event),
    validator: exampleValidator,
  });

  const updateMessageError = (error: readonly FileError[]) => {
    const newMessage = error.map((error) => {
      if(error.code === 'file-invalid-type') {
        return {
          code: error.code,
          message: 'Tipo de arquivo inválido',
        };
      }

      if(error.code === 'file-too-large') {
        return {
          code: error.code,
          message: 'Arquivo muito grande',
        };
      }

      if(error.code === 'file-too-small') {
        return {
          code: error.code,
          message: 'Arquivo muito pequeno',
        };
      }

      if(error.code === 'too-many-files') {
        return {
          code: error.code,
          message: 'Limite de arquivos excedido',
        };
      }

      return {
        code: error.code,
        message: error.message,
      };
    });

    return newMessage;
  };

  const handleOnDropAccepted = (acceptedFiles: File[], event: DropEvent) => {
    if(onDropAccepted) {
      onDropAccepted(event, acceptedFiles);
    }
  }

  const handleOnDropRejected = (fileRejections: FileRejection[], event: DropEvent) => {

    const newFileRejections = fileRejections.map((file) => {
      return {
        ...file,
        errors: updateMessageError(file.errors),
      }
    });

    if(onDropRejected) {
      onDropRejected(event, newFileRejections);
    }
  }

  useEffect(() => {
    updateInfo({
      filesAccept,
      maxFiles,
      maxSizeFile,
      maxSizeListFile,
    });
  }, [])

  if(!visible) {
    return null;
  }

  return (
    // <section className="container">
    //   <div {...dropzoneBag.getRootProps({ className: 'dropzone' })}>
    //     <input {...dropzoneBag.getInputProps()}  />
    //     { children(dropzoneBag) }
    //   </div>
    // </section>

    <DropzonePrimitive 
      accept={filesAccept}
      multiple={multiple}  
      maxFiles={maxFiles}
      disabled={disabledGlobal || disabled}
      noDrag
      // validator={(file) => {
      //   if (file.name.length > 10) {
      //     return {
      //       code: "file-invalid-type",
      //       message: `Name is larger than 10 characters`
      //     };
      //   }
      
      //   return null
      // }}
      onDropAccepted={handleOnDropAccepted}
      onDropRejected={handleOnDropRejected}
    >
      {(dropzoneBag) => {
        return (
          <div 
            className="dropzone w-full"
            { ...dropzoneBag.getRootProps() } 
          >
            <input { ...dropzoneBag.getInputProps() } />
            { 
              children({ disabled, ...dropzoneBag }) 
            }
          </div>
        )
      }}
    </DropzonePrimitive>
  );
}

