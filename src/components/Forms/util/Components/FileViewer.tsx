import { Skeleton } from "@/components/Skeleton2.0";
import { Upload } from "@/components/Upload2.0";
import { FileItem, RemoveFile, RetryUpload, UpdateFile, UploadFile, UploadRootHandles } from "@/components/Upload2.0/contexts";
import { arquivo } from "@/services/arquivo";
import { fileHelper } from "@/utils/File";
import { toast } from "@/utils/toast";
import { Unit } from "bytes";
import { memo, useEffect, useRef, useState } from "react";
import { FileRejection } from "react-dropzone/.";
import * as Icon from '@phosphor-icons/react';
import { v4 as uuid } from 'uuid';
import { PDFViewer } from "@/components/PDFViewer";
import { object } from "@/utils/Object";
import { isEqual } from "@/utils/Array";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface FormFile {
  id: string;
  info: {
    name: string;
    size: number;
    sizeFormatted: string;
    url: string; 
    unit: Unit;
    s3Key: string;
    s3Bucket: string;
    tipo?: string;
  };
  status: {
    success: boolean | undefined;
    progress: number;
    message: string | undefined;
    isDeleting?: boolean;
  };
  allow: {
    delete: boolean;
    download: boolean;
    retryUpload: boolean;
    link: boolean;
  };
  dropzoneFile: File | FileRejection | undefined;
}

export interface OnUploadErrorParams {
  file: FileItem<FormFile>;
  message?: string;
}

export interface OnDropAcceptedParams {
  files: File[];
  uploadFiles: UploadFile<FormFile>
}

export interface OnDropRejectedParams {
  files: FileRejection[];
  uploadFiles: UploadFile<FormFile>
}

export interface OnProcessUpdateParams {
  file: FileItem<FormFile>;
  updateFile: UpdateFile<FormFile>
}

export interface OnProcessUploadErrorParams {
  file: FileItem<FormFile>;
  message: string;
  updateFile: UpdateFile<FormFile>;
}

export interface OnUploadProgressParams {
  file: FileItem<FormFile>;
  event: any;
  updateFile: UpdateFile<FormFile>;
}

interface HandleClickFileParams {
  file: FormFile;
  updateFile: UpdateFile<FormFile>
}

export interface HandleClickDeleteFileParams {
  file: FileItem<FormFile>;
  removeFile: RemoveFile<FormFile>;
  updateFile: UpdateFile<FormFile>;
}

export interface HandleClickRetryUploadParams {
  file: FileItem<FormFile>;
  retryUpload: RetryUpload<FormFile>;
}

export interface HandleChangeTipoArquivoProps {
  file: FileItem<FormFile>;
  updateFile: UpdateFile<FormFile>;
  value: string;
}

interface FileViewerProps {
  pk: string;
  initialUploadList: FormFile[] | null;
  isLoadingFileViewer: boolean;
  showTipo?: boolean;
  onChange: (files: FormFile[]) => void;
  onStartProcessUpload?: () => void;
  onEndProcessUpload?: () => void;
}

const sortFileViewer = (a: FormFile, b: FormFile) => {
  if (a.status.success === true && a.status.progress === 0 && b.status.success === false) {
    return -1;
  }

  if (a.status.success === true && a.status.progress === 100 && b.status.success === false) {
    return 1;
  }

  if (a.status.success === false && b.status.success === true && b.status.progress === 0) {
    return 1;
  }

  if (a.status.success === false && b.status.success === true && b.status.progress === 100) {
    return -1;
  }

  if (a.status.success === true && b.status.success === true) {
    return a.status.progress - b.status.progress;
  }

  if (a.status.success === false && b.status.success === false) {
    return 0;
  }

  return 0;
};

const FileViewerComponent = ({ 
  pk,
  initialUploadList = [],
  isLoadingFileViewer,
  showTipo = false,
  onChange,
  onStartProcessUpload,
  onEndProcessUpload,
}: FileViewerProps) => {
  const uploadRef = useRef<UploadRootHandles<FormFile>>(null);

  console.log('Componente FileViewer renderizado');

  const [isLoadingPdfViewer, setIsLoadingPdfViewer] = useState(false);
  const [isUploadLimitReached, setIsUploadLimitReached] = useState(false);
  const [isOpenInitialUploadList, setIsOpenInitialUploadList] = useState(false);

  const [fileViewer, setFileViewer] = useState({
    url: '',
  });

  const handleClickFile = async (params: HandleClickFileParams) => {
    if (params.file.info.url.length > 0) {
      setFileViewer({
        url: params.file.info.url,
      });

      return;
    }

    if (!params.file.status.success) {
      return;
    }

    setIsLoadingPdfViewer(true);

    try {
      const urlFile = await arquivo.getFileUrlFromS3({
        s3Key: params.file.info.s3Key,
        s3Bucket: params.file.info.s3Bucket,
      });
  
      setFileViewer({
        url: urlFile,
      });

      params.updateFile(params.file.id, {
        newFile: {
          ...params.file,
          info: {
            ...params.file.info,
            url: urlFile,
          }
        },
      });
    } catch (error: any) {
      toast.error({
        title: 'Falha ao consultar o arquivo',
        description: error?.message,
      });
    } finally {
      setIsLoadingPdfViewer(false);
    }
  };

  const onUploadError = ({ file, message }: OnUploadErrorParams) => {
    const updateFile = uploadRef.current?.updateFile as UpdateFile<FormFile>;

    const newFile: FileItem<FormFile> = {
      ...file,
      status: {
        ...file.status,
        success: false,
        progress: 0,
        message: message ? message : file.status.message,
      },
      allow: {
        ...file.allow,
        retryUpload: true,
        delete: true,
      },
    };

    updateFile(file.id, {
      newFile,
    });

    return newFile;
  };

  const onUploadProgress = ({ file, event, updateFile }: OnUploadProgressParams) => {
    const progress = parseInt(Math.round((event.loaded * 100) / event.total).toString());

    const newFile: FileItem<FormFile> = {
      ...file,
      status: {
        ...file.status,
        success: undefined,
        progress,
      },
    };

    updateFile(file.id, {
      newFile,
    });
  };

  const onProcessUploadError = ({ file, updateFile, message }: OnProcessUploadErrorParams) => {
    const newFile: FileItem<FormFile> = {
      ...file,
      status: {
        ...file.status,
        success: false,
        progress: 100,
        message,
      },
      allow: {
        ...file.allow,
        retryUpload: true,
        delete: true,
      },
    };

    updateFile(file.id, {
      newFile,
    });
  };

  const processUpload = async ({ file, updateFile }: OnProcessUpdateParams) => {
    try {
      if (file.status.success === false) {
        return onUploadError({ file });
      }

      const currentList = uploadRef.current?.list ?? [];

      if (currentList.some(item => item.info.name === file.info.name && item.status.success === true)) {
        return onUploadError({ file, message: 'Arquivo já enviado anteriormente' });
      }

      const totalFilesSizeInBytes = currentList.reduce(
        (acc, file) =>
          acc +
          fileHelper.convertToBytes({
            size: file.info.size,
            unit: file.info.unit,
          }),
        0
      );

      const isFileSizeExceeded = fileHelper.isFileSizeExceeded({
        unit: 'B',
        size: totalFilesSizeInBytes,
        limit: {
          unit: 'B',
          size: fileHelper.convertToBytes({ size: 20, unit: 'MB' }),
        },
      });

      setIsUploadLimitReached(isFileSizeExceeded);

      if (isFileSizeExceeded) {
        toast.warning({
          title: 'Aviso',
          description: 'Limite total de 20MB de arquivos atingido.',
        });
      }

      const submittedFile = await arquivo.submitFile({
        demandaPk: pk,
        file: {
          name: file.info.name,
          dropzoneFile: file.dropzoneFile as File,
        },
        onUploadProgress: (event) =>
          onUploadProgress({
            file,
            event,
            updateFile,
          }),
      });

      const urlFile = file?.dropzoneFile ? URL.createObjectURL(file?.dropzoneFile as File) : '';

      const newFile: FormFile = {
        ...file,
        id: submittedFile?.id,
        info: {
          ...file.info,
          url: urlFile,
          s3Key: submittedFile?.s3Key,
          s3Bucket: submittedFile?.s3Bucket,
        },
        status: {
          ...file.status,
          success: true,
          progress: 100,
          message: 'Arquivo enviado com sucesso',
        },
        allow: {
          delete: true,
          download: true,
          retryUpload: false,
          link: true,
        },
      };

      updateFile(file.id, {
        newFile,
      });

      const updatedList = currentList.filter((item) => item.id !== file.id);
      const newList = [...updatedList, newFile];

      onChange(newList);
    } catch (error: any) {
      onProcessUploadError({
        file,
        updateFile,
        message: error?.message,
      });

      throw error;
    }
  };

  const handleOnDropAccepted = ({ files, uploadFiles }: OnDropAcceptedParams) => {
    setIsOpenInitialUploadList(true);

    const newFiles: FormFile[] = files.map((file) => {
      return {
        id: uuid(),
        info: {
          name: file.name,
          size: file.size,
          sizeFormatted: fileHelper.convertToLiteralString({
            size: file.size,
            unit: 'B',
            newUnit: 'MB',
          }),
          unit: 'B',
          url: '',
          tipo: '',
          s3Key: '',
          s3Bucket: '',
        },
        status: {
          success: undefined,
          progress: 0,
          message: undefined,
        },
        allow: {
          delete: false,
          download: false,
          retryUpload: false,
          link: false,
        },
        dropzoneFile: file,
      };
    });

    uploadFiles({
      files: newFiles,
    });
  };

  const handleOnDropRejected = ({ files, uploadFiles }: OnDropRejectedParams) => {
    setIsOpenInitialUploadList(true);

    const newFiles: FormFile[] = files.map((item) => {
      const messageError = item.errors.map((error) => error.message).join('; ');

      return {
        id: uuid(),
        info: {
          name: item.file.name,
          size: item.file.size,
          sizeFormatted: fileHelper.convertToLiteralString({
            size: item.file.size,
            unit: 'B',
            newUnit: 'KB',
          }),
          unit: 'KB',
          url: '',
          tipo: '',
          s3Key: '',
          s3Bucket: '',
        },
        status: {
          success: false,
          progress: 100,
          message: messageError,
        },
        allow: {
          delete: true,
          download: false,
          retryUpload: true,
          link: false,
        },
        dropzoneFile: item.file,
      };
    });

    uploadFiles({
      files: newFiles,
    });
  };

  const handleProcessUpload = async ({ file, updateFile }: OnProcessUpdateParams) => {
    try {
      onStartProcessUpload?.();

      await processUpload({ file, updateFile });
    } catch (error: any) {
      toast.error({
        title: 'Falha ao enviar o arquivo, verifique a lista de arquivos',
        description: error?.message,
      });
    } finally {
      onEndProcessUpload?.();
    }
  };

  const handleClickDeleteFile = async ({ file, removeFile, updateFile }: HandleClickDeleteFileParams) => {
    try {
      if (file.status.success === undefined && file.status.progress < 100) {
        removeFile(file.id);
        //abort upload
        return;
      }

      if (file.status.success === false) {
        removeFile(file.id);
        return;
      }

      updateFile(file.id, {
        newFile: { ...file, status: { ...file.status, isDeleting: true } },
      });

      await arquivo.deleteFile({
        demandaPk: pk,
        demandaSk: file.id,
      });

      removeFile(file.id);

      setFileViewer({
        url: '',
      });

      const currentList = uploadRef.current?.list ?? [];
      const newList = currentList.filter((item) => item.id !== file.id);

      onChange(newList);
    } catch (error: any) {
      toast.error({
        title: 'Falha ao excluir o arquivo',
        description: error?.message,
      });

      updateFile(file.id, {
        newFile: { 
          ...file, 
          status: { 
            ...file.status, 
            isDeleting: false,
            success: false,
            progress: 100,
            message: error?.message,
          } 
        },
      });
    } finally {
      updateFile(file.id, {
        newFile: { ...file, status: { ...file.status, isDeleting: false } },
      });
    }
  };

  const handleClickRetryUpload = async ({ file, retryUpload }: HandleClickRetryUploadParams) => {
    retryUpload(file.id, {
      newFile: {
        ...file,
        status: {
          ...file.status,
          success: undefined,
          progress: 0,
          message: undefined,
        },
      },
    });
  };

  const handleChangeTipoArquivo = ({ file, updateFile, value }: HandleChangeTipoArquivoProps) => {
    const newFile: FormFile = {
      ...file,
      info: {
        ...file.info,
        tipo: value,
      }
    }

    updateFile(file.id, {
      newFile
    });

    const currentList = uploadRef.current?.list ?? [];

    const newFiles = currentList.map((item) => {
      if (item.id === file.id) {
        return {
          ...item,
          info: {
            ...item.info,
            tipo: value,
          }
        };
      }

      return item;
    });

    console.log('newFiles', newFiles);

    onChange(newFiles);
  }

  useEffect(() => {
    const updateUrlFile = async () => {
      try {
        setIsLoadingPdfViewer(true);

        const firstItemUploadList = initialUploadList?.find((item) => item.info.s3Key.length > 0 && item.info.s3Bucket.length > 0);
  
        if (!firstItemUploadList) {
          return;
        }
  
        const url = await arquivo.getFileUrlFromS3({
          s3Key: firstItemUploadList?.info.s3Key ?? '',
          s3Bucket: firstItemUploadList?.info.s3Bucket ?? '',
        });

        uploadRef.current?.updateFile(firstItemUploadList.id, {
          newFile: {
            ...firstItemUploadList,
            info: {
              ...firstItemUploadList.info,
              url,
            },
          },
        });
    
        setFileViewer({
          url,
        });
      } catch (error: any) {
        toast.error({
          title: 'Falha ao carregar o visualizador de arquivos',
          description: error?.message,
        });
      } finally {
        setIsLoadingPdfViewer(false);
      }
    }

    const updateIsUploadLimitReached = () => {
      const totalFilesSizeInBytes = initialUploadList?.reduce(
        (acc, file) =>
          acc +
          fileHelper.convertToBytes({
            size: file.info.size,
            unit: file.info.unit,
          }),
        0
      );
  
      const isFileSizeExceeded = fileHelper.isFileSizeExceeded({
        unit: 'B',
        size: totalFilesSizeInBytes ?? 0,
        limit: {
          unit: 'B',
          size: fileHelper.convertToBytes({ size: 20, unit: 'MB' }),
        },
      });
  
      setIsUploadLimitReached(isFileSizeExceeded);
  
      if (isFileSizeExceeded) {
        toast.warning({
          title: 'Aviso!',
          description: 'Limite total de 20MB de arquivos atingido.',
        });
      }
    }

    if (initialUploadList?.length === 0) {
      return;
    }

    updateUrlFile();
    updateIsUploadLimitReached();
  }, [initialUploadList]);

  if (isLoadingFileViewer) {
    return (
      <Skeleton.Root className="w-full h-full">
        <Skeleton.Custom className="w-full h-full" />
      </Skeleton.Root>
    )
  }

  return (
    <div className="flex flex-col w-full h-full gap-2">
      {isUploadLimitReached ? (
        <span className="text-xs text-orange-500 dark:text-yellow-600 bg-zinc-200 dark:bg-zinc-900 rounded p-2">
          Aviso: Limite total de 20MB de arquivos atingido.
        </span>
      ) : null}

      <Upload.Bag
        ref={uploadRef}
        visible
        initialList={initialUploadList}
        onProcessUpload={async (file, updateFile) => {
          handleProcessUpload({ file, updateFile });
        }}>
        {({ list, uploadFiles, removeFile, retryUpload, updateFile }) => {
          return (
            <Upload.Root data-open={isOpenInitialUploadList} className="data-[open=true]:h-1/2">
              <Upload.Drop.Root>
                <Upload.Drop.Dropzone
                  maxSizeFile="20MB"
                  maxFiles={undefined}
                  onDropAccepted={(event, files) => {
                    handleOnDropAccepted({ files, uploadFiles });
                  }}
                  onDropRejected={(event, files) => {
                    handleOnDropRejected({ files, uploadFiles });
                  }}
                  filesAccept={{
                    'application/pdf': ['.pdf'],
                    'text/plain': ['.txt'],
                  }}>
                  {(dropzoneBag) => {
                    return (
                      <Upload.Drop.Drag.Root>
                        <Upload.Drop.Drag.View dropzoneBag={dropzoneBag} />
                      </Upload.Drop.Drag.Root>
                    );
                  }}
                </Upload.Drop.Dropzone>

                <Upload.Drop.Info.TooltipIcon />
              </Upload.Drop.Root>

              <Upload.List.ToggleOpen
                show={isOpenInitialUploadList}
                onClick={(open) => setIsOpenInitialUploadList(open)}>
                <Upload.List.Root className="min-h-[130px]">
                  {list
                    .sort((a, b) => sortFileViewer(a, b))
                    .map((file) => {
                      return (
                        <Upload.List.Row.Root
                          key={file.id}
                          className="cursor-pointer"
                          onClick={() => handleClickFile({
                            file,
                            updateFile,
                          })}
                        >
                          <Upload.List.Row.Name
                            tooltip={file.info.name}
                            selected={fileViewer.url.length > 0 && fileViewer.url === file.info.url}
                          >
                            {fileViewer.url.length > 0 && fileViewer.url === file.info.url ? (
                              <div className="flex items-center gap-1">
                                <Icon.CaretCircleRight className="flex-shrink-0 text-blue-500" weight="fill" />

                                {file.info.name}
                              </div>
                            ) : (
                              file.info.name
                            )}
                          </Upload.List.Row.Name>

                          <Upload.List.Row.Action.Root>
                            {file.allow.download && (
                              <Upload.List.Row.Action.Download fileName={file.info.name} url={file.info.url} />
                            )}

                            {file.allow.link && <Upload.List.Row.Action.Link url={file.info.url} />}

                            {file.status.success === undefined ? (
                              <Upload.List.Row.Action.Status.Pending progress={file.status.progress} />
                            ) : file.status.success ? (
                              <Upload.List.Row.Action.Status.Success tooltip={file.status.message} />
                            ) : (
                              <>
                                {file.allow.retryUpload && (
                                  <Upload.List.Row.Action.Retry
                                    onClick={() => {
                                      handleClickRetryUpload({
                                        file,
                                        retryUpload,
                                      });
                                    }}
                                  />
                                )}

                                <Upload.List.Row.Action.Status.Failure tooltip={file.status.message} />
                              </>
                            )}
                          </Upload.List.Row.Action.Root>

                          {
                            showTipo ? (
                              <Upload.List.Row.Description>
                                <Select 
                                  disabled={!file.status.success}
                                  value={file.info.tipo}
                                  onValueChange={(value) => handleChangeTipoArquivo({
                                    updateFile,
                                    file,
                                    value,
                                  })}
                                >
                                  <SelectTrigger className="h-6">
                                    <SelectValue placeholder="Selecione o tipo do arquivo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Processo Jurídico">Processo Jurídico</SelectItem>
                                    <SelectItem value="Procon">Procon</SelectItem>
                                    <SelectItem value="Outro">Outro</SelectItem>
                                  </SelectContent>
                                </Select>
                              </Upload.List.Row.Description>
                            ) : null
                          }


                          <Upload.List.Row.Size className="flex items-center justify-center">
                            {file.info.sizeFormatted}
                          </Upload.List.Row.Size>

                          {
                            <Upload.List.Row.Remove
                              disabled={!file.allow.delete || file.status.isDeleting}
                              onClick={() => {
                                handleClickDeleteFile({
                                  file,
                                  removeFile,
                                  updateFile,
                                });
                              }}
                            >
                                <span>{file.status.isDeleting ? 'Removendo...' : 'Remover'}</span>
                            </Upload.List.Row.Remove>
                          }
                        </Upload.List.Row.Root>
                      );
                    })}
                </Upload.List.Root>
              </Upload.List.ToggleOpen>
            </Upload.Root>
          );
        }}
      </Upload.Bag>

      {
        isLoadingPdfViewer ? (
          <Skeleton.Root className="w-full h-full">
            <Skeleton.Custom className="w-full h-full" />
          </Skeleton.Root>
        ) : (
          <PDFViewer 
            data-open={isOpenInitialUploadList} 
            className="data-[open=true]:h-1/2" 
            source={fileViewer.url} 
          />
        )
      }
    </div>
  )
};

export const FileViewer = memo(FileViewerComponent, (prevProps, nextProps) => {
  if (prevProps.pk !== nextProps.pk) {
    //console.log('prevProps.pk !== nextProps.pk');
    return false;
  }

  if (!isEqual(prevProps.initialUploadList ?? [], nextProps.initialUploadList ?? [])) {
    return false;
  }

  if (prevProps.isLoadingFileViewer !== nextProps.isLoadingFileViewer) {
    //console.log('prevProps.isLoadingFileViewer !== nextProps.isLoadingFileViewer');
    return false;
  }

  if (prevProps.onChange && nextProps.onChange && prevProps.onChange.toString() !== nextProps.onChange.toString()) {
    //console.log('prevProps.onChange.toString() !== nextProps.onChange.toString()');
    return false;
  }

  if (prevProps.onStartProcessUpload?.toString() !== nextProps.onStartProcessUpload?.toString()) {
    //console.log('prevProps.onStartProcessUpload.toString() !== nextProps.onStartProcessUpload.toString()');
    return false;
  }

  if (prevProps.onEndProcessUpload?.toString() !== nextProps.onEndProcessUpload?.toString()) {
    //console.log('prevProps.onEndProcessUpload.toString() !== nextProps.onEndProcessUpload.toString()');
    return false;
  }

  return true;
});
