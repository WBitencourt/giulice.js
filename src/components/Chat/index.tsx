'use client'

import { TextArea } from "@/components/TextArea";
import * as Icon from "@phosphor-icons/react";
import { useState } from "react";
import Image from 'next/image';
import { Upload } from "@/components/Upload2.0";
import { v4 as uuid } from 'uuid';
import { FileRejection } from "react-dropzone";

interface Arquivo {
  id: string;
  info: {
    mimeType: string;
    name: string;
    size: number;
    sizeFormatted: string;
    fileType: string;
    uploadedBy?: string;
    uploadedAt?: string;
    url: string;
  };
  status: {
    success: boolean | undefined;
    progress: number;
    message: string | undefined;
  };
  allow: {
    delete: boolean;
    download: boolean;
    retryUpload: boolean;
    link: boolean;
  };
  dropzoneFile: File | FileRejection | undefined;
}

const initialFileListTemp: Arquivo[] = [
  {
    id: uuid(),
    info: {
      mimeType: 'application/pdf',
      name: 'um-nome-bem-grande-para-fazer-o-teste-de-truncated.pdf',
      size: 1024,
      sizeFormatted: '1KB',
      fileType: 'Liminar',
      uploadedBy: 'joao.frango@tadandoonda.com',
      uploadedAt: '2024-05-15T13:56:55.211Z',
      url: 'https://www.honda.com.br/sites/cbw/files/2016-08/Civic%202012%20-%20Manual%20do%20Propriet%C3%A1rio.pdf',
    },
    status: {
      success: true,
      progress: 100,
      message: 'Upload concluído',
    },
    allow: {
      delete: true,
      download: true,
      retryUpload: false,
      link: true,
    },
    dropzoneFile: undefined,
  },
  {
    id: uuid(),
    info: {
      mimeType: 'application/pdf',
      name: 'msi-b550m-wifi.pdf',
      size: 1024,
      sizeFormatted: '1KB',
      fileType: 'Liminar',
      uploadedBy: 'joao.frango@tadandoonda.com',
      uploadedAt: '2024-05-15T13:56:55.211Z',
      url: 'https://www.honda.com.br/pos-venda/automoveis/carreira-na-honda/automoveis/pos-venda/motos/sites/customer_service/files/2020-10/Civic%202021%20-%20Manual%20do%20Navegador_20201008.pdf',
    },
    status: {
      success: true,
      progress: 100,
      message: 'Upload concluído',
    },
    allow: {
      delete: true,
      download: true,
      retryUpload: false,
      link: true,
    },
    dropzoneFile: undefined,
  },
]

export const Chat = () => {
  const [open, setOpen] = useState(false);
  const [userComment, setUserComment] = useState('');

  const handleChangeUserComment = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserComment(event.currentTarget.value);
  }

  const handleClickChat = () => {
    setOpen((state) => !state);
  }

  const handleCloseChat = () => {
    setOpen((state) => !state);
  }

  return (
    <>
      {
        open ?
        <div className="absolute overflow-y-auto z-50 top-0 left-0 min-w-md w-full h-full sm:max-w-xl sm:h-fit sm:max-h-[80%] sm:top-auto sm:right-2 sm:bottom-10 sm:left-auto">
          <div className="flex flex-col rounded gap-6 overflow-y-auto border-1 border-zinc-300 dark:border-black text-white p-4 h-full bg-white dark:bg-zinc-800">
            <div className="sticky top-0 bg-red-500">TESTE</div>
            <div id="chat-header" className="flex gap-4 items-center w-full">
              <Image 
                src="/everest/portal/oito-logo.svg" 
                alt="Logo da Oito Tecnologia" 
                width="40" 
                height="40" 
              />
              <span className="text-base text-black dark:text-white h-fit">
                Suporte Oito Tecnologia
              </span>
              <Icon.X 
                className="text-2xl ml-auto text-black dark:text-white cursor-pointer"
                onClick={handleCloseChat}
              />
            </div>
            <div id="chat-content" className="flex flex-col gap-4 w-full">
              <p>
                Olá! Como podemos ajudar você hoje?
              </p>

              <TextArea 
                rows={5}
                label="Descreva aqui sua dúvida ou problema" 
                value={userComment}
                onChange={handleChangeUserComment}
              />

              <Upload.Bag 
                initialList={initialFileListTemp}
                //onChange={(list) => { console.log('onChange', list)}}
                onProcessUpload={async (file, updateFile) => {
                  // handleProcessUpload({ file, 
                  //   updateFile, 
                  //   cliente: selectedCustomer?.value 
                  // })
                }}
              >
                {
                  ({ list, uploadFiles, removeFile, retryUpload, updateFile }) => {
                    return (
                      <Upload.Root>
                        <Upload.Drop.Root>
                          <Upload.Drop.Dropzone
                            onDropAccepted={(event, files) => { 
                              //handleOnDropAccepted({ files, uploadFiles })
                            }}
                            onDropRejected={(event, files) => { 
                              //handleOnDropRejected({ files, uploadFiles })
                            }}
                            filesAccept={{ 
                              'application/pdf': ['.pdf'], 
                              'text/plain': ['.txt'],
                              'image/jpeg': ['.jpg', '.jpeg'],
                              'image/png': ['.png'],

                            }}
                          >
                            {(dropzoneBag) => {
                              return (
                                <Upload.Drop.Drag.Root>
                                  <Upload.Drop.Drag.View
                                    dropzoneBag={dropzoneBag} 
                                  />
                                </Upload.Drop.Drag.Root>
                              )
                            }}
                          </Upload.Drop.Dropzone>
                          
                          <Upload.Drop.Info.TooltipIcon />
                        </Upload.Drop.Root>

                        <Upload.List.Root>
                          <Upload.List.Root>
                            {
                              list.map((file) => {
                                return (
                                  <Upload.List.Row.Root key={file.id}>
                                    <Upload.List.Row.Name
                                      tooltip={'file.info.name'}
                                      selected={true}
                                      onClick={() => {}}
                                    >
                                      <></>
                                      {
                                        // !!pdfViewerFile && pdfViewerFile.id === file.id ?
                                        // <div className="flex items-center gap-1">
                                        //   <Icon.CaretCircleRight 
                                        //     className='flex-shrink-0 text-blue-500' 
                                        //     weight='fill' 
                                        //   />

                                        //   {file.info.name}
                                        // </div>
                                        // :
                                        file.info.name
                                      }
                                    </Upload.List.Row.Name>
          
                                    <Upload.List.Row.Action.Root>
                                      {
                                        file.allow.download &&
                                        <Upload.List.Row.Action.Download 
                                          fileName={file.info.name}
                                          url={file.info.url}
                                        />
                                      }

                                      {
                                        file.allow.link &&
                                        <Upload.List.Row.Action.Link 
                                          url={file.info.url}
                                        />
                                      }
                                      
                                      {
                                        file.status.success === undefined ?
                                        <Upload.List.Row.Action.Status.Pending
                                          progress={file.status.progress}
                                        />
                                        :
                                        (
                                          file.status.success ? 
                                          <Upload.List.Row.Action.Status.Success />
                                          :
                                          <>
                                            {
                                              file.allow.retryUpload &&
                                              <Upload.List.Row.Action.Retry 
                                                onClick={() => {
                                                  // handleClickRetryUpload({
                                                  //   file,
                                                  //   retryUpload,
                                                  // })
                                                }}
                                              />
                                            }

                                            <Upload.List.Row.Action.Status.Failure 
                                              tooltip={file.status.message}
                                            />


                                          </>
                                        )
                                      }
                                    </Upload.List.Row.Action.Root>
                                    
                                    <Upload.List.Row.Preview.Root className="self-center row-start-1 row-end-3">
                                      <Icon.FileText 
                                        className='self-center text-3xl text-black dark:text-white' 
                                        weight='thin' 
                                      />
                                    </Upload.List.Row.Preview.Root>

                                    {
                                      file.allow.delete &&
                                      <Upload.List.Row.Remove
                                        className="self-end w-fit justify-center"
                                        onClick={() => {
                                          // handleClickDeleteFile({
                                          //   file,
                                          //   removeFile,
                                          // })
                                        }}
                                      >
                                        Remover
                                      </Upload.List.Row.Remove>
                                    }
          
                                    {/* <Upload.List.Row.Description>
                                      Upload em: { moment(file.info.uploadedAt).locale('pt-br').format('DD/MM/YYYY HH:mm')}
                                    </Upload.List.Row.Description> */}
          
                                    <Upload.List.Row.Size>
                                      { file.info.sizeFormatted }
                                    </Upload.List.Row.Size>
          
                                    {/* {
                                      file.allow.delete &&
                                      <Upload.List.Row.Remove
                                        onClick={() => {
                                          // handleClickDeleteFile({
                                          //   file,
                                          //   removeFile,
                                          // })
                                        }}
                                      >
                                        Remover
                                      </Upload.List.Row.Remove>
                                    } */}
                                  </Upload.List.Row.Root>
                                )
                              })
                            }
                          </Upload.List.Root>
                        </Upload.List.Root>
                      </Upload.Root>
                    )
                  }
                }

              </Upload.Bag>

              <p className="text-xs w-">
                Qualquer informação é importante para que possamos te ajudar.
              </p>
            </div>
          </div> 
        </div>
        :
        <div className="absolute z-50 bottom-2 right-2" onClick={handleClickChat}>
          <div className="group flex gap-2 items-center p-2 hover:py-2 hover:px-4 text-white bg-gradient-to-r from-violet-700 to-fuchsia-700 rounded-full border-1 border-black cursor-pointer ">
            <Icon.Headset 
              className="text-2xl" 
              weight="fill" 
            />
            <span
              className="text-base sr-only group-hover:not-sr-only" 
            >
              Fale conosco
            </span>
          </div>
        </div>
      }
    </>
  )
}