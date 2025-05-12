'use client'

import * as Icon from '@phosphor-icons/react';
import { Formik, FormikHelpers } from "formik";
import { HtmlHTMLAttributes, useEffect, useState } from "react";
import { TextField } from "@/components/TextField";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button2.0';
import { FieldMessage } from '@/components/FieldMessage';
import { Autocomplete } from '@/components/Autocomplete2.0';
import { PickListItem } from '@/components/Autocomplete2.0/Single/contexts';
import { useResourcesStore } from '@/zustand-store/resources';
import { DatePicker } from '@/components/DatePicker3.0';
import { TextArea } from '@/components/TextArea';
import moment from 'moment';
import { Skeleton } from '@/components/Skeleton2.0';
import { useShallow } from 'zustand/react/shallow';
import { toast } from '@/utils/toast';
import { actions } from '@/actionsV2';
import { arquivo } from '@/services/arquivo';

interface FormInterviewPortalUploadGlobalProps extends HtmlHTMLAttributes<HTMLFormElement>{
  interviewID: string;
}

interface FormValuesFormik {
  numeroProcesso: string;
  identificacao: string;
  tipoDocumento: PickListItem | undefined;
  dataCarimbo: string;
  prioridade: boolean;
  observacao: string;
}

interface FormValuesErrorFormik {
  numeroProcesso?: string;
  identificacao?: string;
  tipoDocumento?: string;
  dataCarimbo?: string;
  prioridade?: string;
  observacao?: string;
}

export function FormInterviewPortalUploadGlobal({ interviewID, ...props }: FormInterviewPortalUploadGlobalProps) {
  const router = useRouter();

  const { portalUpload } = useResourcesStore(
    useShallow((state) => ({
      portalUpload: state.portalUpload,
    }))
  );

  const [isLoadingPage, setIsLoadingPage] = useState(true);

  const [tipoDocumentoList, setTipoDocumentoList] = useState<PickListItem[]>([]);

  const filePendingInterview = portalUpload.filesPendingInterview.find((file) => file.id === interviewID);

  const formValues: FormValuesFormik = {
    numeroProcesso: '',
    identificacao: '',
    tipoDocumento: Array.isArray(tipoDocumentoList) && tipoDocumentoList.length === 1 ? tipoDocumentoList[0] : undefined,
    dataCarimbo: moment().toISOString(),
    prioridade: false,
    observacao: '',
  }

  const validateForm = (values: FormValuesFormik) => {
    const errors: Partial<FormValuesErrorFormik> = {}

    if(!values.numeroProcesso && !values.identificacao) {
      if(!values.numeroProcesso) {
        errors.numeroProcesso = 'Campo obrigatório somente quando identificação do documento não estiver preenchido'
      }

      if(!values.identificacao) {
        errors.identificacao = 'Campo obrigatório somente quando número do processo não estiver preenchido'
      }
    }

    if(!values.tipoDocumento?.value) {
      errors.tipoDocumento = 'Campo obrigatório'
    }

    if(!values.dataCarimbo) {
      errors.dataCarimbo = 'Campo obrigatório'
    }

    return errors;
  }

  const isValidForm = (values: FormValuesFormik, formikBag: FormikHelpers<FormValuesFormik>) => {
    const errors = validateForm(values);

    formikBag.setErrors(errors);

    if(Object.keys(errors).length > 0) {
      return false;
    }

    return true
  }

  const handleSubmit = async (values: FormValuesFormik, formikBag: FormikHelpers<FormValuesFormik>) => {
    try {
      formikBag.setSubmitting(true);

      const isValid = isValidForm(values, formikBag);

      if(!isValid) {
        toast.warning({
          title: 'Validação de campos',
          description: 'Verifique os campos obrigatórios',
        });
        return
      }

      const dropzoneFile = filePendingInterview?.dropzoneFile as File;

      if(!dropzoneFile) {
        throw new Error(`Arquivo não é mais valido para preenchimento, verifique sua lista de arquivos`, { cause: 'validation' })
      }

      await arquivo.submitInterviewFile({
        cliente: filePendingInterview?.info.customer,
        numeroProcesso: values.numeroProcesso,
        identificacao: values.identificacao,
        tipoDocumento: values.tipoDocumento?.value,
        dataCarimbo: values.dataCarimbo,
        prioridade: values.prioridade,
        observacao: values.observacao,
        file: {
          name: filePendingInterview?.info.name,
          dropzoneFile,
        },
      })

      await portalUpload.removeFilePendingInterview({
        file: {
          id: interviewID,
        }
      })

      const now = moment();
      const startOfWorkDay = moment().set({ hour: 9, minute: 0, second: 0, millisecond: 0 }).toISOString();
      const endOfWorkDay = moment().set({ hour: 17, minute: 59, second: 59, millisecond: 999 }).toISOString();

      const isWorkTime = now.isBetween(moment(startOfWorkDay), moment(endOfWorkDay));

      if(!isWorkTime) {
        toast.warning({
          title: 'Aviso!',
          description: 'Upload realizado fora do horário comercial, o prazo será contado a partir da próxima hora útil das 09h00 as 17h59.',
        });
      }

      toast.success({
        title: 'Enviado',
        description: 'Arquivo enviado com sucesso, um e-mail de confirmação foi enviado para o seu e-mail',
      });

      router.push('/upload/individual')
    } catch (error: any) {
      // await portalUpload.updateFilePendingInterview({
      //   file: {
      //     id: interviewID,
      //     status: {
      //       success: false,
      //       progress: 100,
      //       message: error?.message,
      //     },
      //     allow: {
      //       retryUpload: true,
      //       delete: true,
      //       download: false,
      //       link: false,
      //     }
      //   }
      // })

      toast.error({
        title: 'Falha ao enviar arquivo',
        description: error?.message,
      });
    } finally {
      formikBag.setSubmitting(false);
    }
  }

  useEffect(() => {
    const loadPage = async () => {
      try {
        if(!interviewID) {
          router.push('/upload/individual');
          return
        }
  
        setIsLoadingPage(true);
  
        if(!filePendingInterview) {
          router.push('/upload/individual');
          return
        }
  
        const dadosCliente = await actions.backend.cliente.getDadosCliente({
          cliente: filePendingInterview?.info.customer ?? '',
        })
  
        const tipoDocumentoList = dadosCliente?.PortalUpload.tipo.map((tipo: string) => {
          return {
            label: tipo,
            value: tipo,
          }
        })
  
        setTipoDocumentoList(tipoDocumentoList);
      }
      catch(error: any) {
        toast.error({
          title: 'Falha ao carregar página',
          description: error?.message ?? 'Página não carregou corretamente',
        });
      } finally {
        setIsLoadingPage(false);
      }
    }

    loadPage();
  }, [interviewID, router])

  return (
    <>
     {
        isLoadingPage ?
        <Skeleton.Root className='flex flex-col gap-4'>
          <Skeleton.Input />
          <Skeleton.Input />
          <Skeleton.Input />
          <Skeleton.Input />
          <Skeleton.Input />
          <Skeleton.Input />
          <Skeleton.Button />
        </Skeleton.Root>
        :
        <Formik
          initialValues={formValues}
          validate={() => {}}
          onSubmit={async (values, formikBag) => {
            await handleSubmit(values, formikBag);
          }}
        >
          {({
            values,
            handleChange,
            handleBlur,
            handleSubmit: onSubmit,
            isSubmitting,
            setFieldValue,
            errors
          }) => (
            <form
              id="portal-upload-interview-form"
              onSubmit={onSubmit} className="flex w-full h-full flex-col gap-4"
              { ...props }
            >

              <TextField.Root>
                <TextField.Main.Root>
                  <TextField.Main.Label>
                    Cliente selecionado
                  </TextField.Main.Label>
                  <TextField.Main.Input.Root>
                    <TextField.Main.Input.Field
                      id="cliente"
                      name="cliente"
                      type="text"
                      disabled
                      value={filePendingInterview?.info.customer}
                    />
                  </TextField.Main.Input.Root>
                </TextField.Main.Root>
                <TextField.Button.Root>
                  <TextField.Button.Clean onClick={() => setFieldValue('numeroProcesso', '')} />
                </TextField.Button.Root>
              </TextField.Root>

              <FieldMessage.Error.Root>
                <FieldMessage.Tip.Root>
                  <TextField.Root>
                    <TextField.Main.Root>
                      <TextField.Main.Label>
                        Número do processo
                      </TextField.Main.Label>
                      <TextField.Main.Input.Root>
                        <TextField.Main.Input.Field
                          id="numeroProcesso"
                          name="numeroProcesso"
                          type="text"
                          typeMask='nup'
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.numeroProcesso}
                        />
                      </TextField.Main.Input.Root>
                    </TextField.Main.Root>
                    <TextField.Button.Root>
                      <TextField.Button.Clean onClick={() => setFieldValue('numeroProcesso', '')} />
                    </TextField.Button.Root>
                  </TextField.Root>

                  <FieldMessage.Tip.Text>
                    Número de processo padrão CNJ válido
                  </FieldMessage.Tip.Text>
                </FieldMessage.Tip.Root>

                <FieldMessage.Error.Text>
                  { errors.numeroProcesso }
                </FieldMessage.Error.Text>
              </FieldMessage.Error.Root>

              <FieldMessage.Error.Root>
                <FieldMessage.Tip.Root>
                  <TextField.Root>
                    <TextField.Main.Root>
                      <TextField.Main.Label>
                        Identificação do documento
                      </TextField.Main.Label>
                      <TextField.Main.Input.Root>
                        <TextField.Main.Input.Field
                          id="identificacao"
                          name="identificacao"
                          type="identificacao"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.identificacao}
                        />
                      </TextField.Main.Input.Root>
                    </TextField.Main.Root>
                    <TextField.Button.Root>
                      <TextField.Button.Clean
                        onClick={() => setFieldValue('identificacao', '')}
                      />
                    </TextField.Button.Root>
                  </TextField.Root>

                  <FieldMessage.Tip.Text>
                    Campo deve ser preenchido para casos em que há referência a processos fora do padrão de número único do processo (NUP). Exemplo: procon, notificação extrajudicial, etc.
                  </FieldMessage.Tip.Text>
                </FieldMessage.Tip.Root>

                <FieldMessage.Error.Text>
                  { errors.identificacao }
                </FieldMessage.Error.Text>
              </FieldMessage.Error.Root>

              <FieldMessage.Error.Root>
                <FieldMessage.Tip.Root>
                  <Autocomplete.Single.Root 
                    id='tipoDocumento'
                    //name='tipoDocumento'
                    freeSolo={false}
                    picklist={tipoDocumentoList}
                    onOptionChange={(value) => {
                      setFieldValue('tipoDocumento', value)
                    }}
                    selectedOption={values.tipoDocumento}
                  >
                    <Autocomplete.Single.Input 
                      name='tipoDocumento'
                      label='Tipo do documento'
                    />
                    <Autocomplete.Single.PickList.Bag>
                      {
                        ({ list }) => {
                          return (
                            <Autocomplete.Single.PickList.Root>
                              <Autocomplete.Single.PickList.Container>
                                {
                                  list.map((item, index) => {
                                    return (
                                      <Autocomplete.Single.PickList.Item 
                                        key={item.value}
                                        onClick={() => {}}
                                        index={index}
                                        item={item}
                                      />
                                    )
                                  })
                                }
                              </Autocomplete.Single.PickList.Container>
          
                              <Autocomplete.Single.PickList.Empty>
                                Nenhum item encontrado
                              </Autocomplete.Single.PickList.Empty>
                            </Autocomplete.Single.PickList.Root>
                          )
                        }
                      }
                    </Autocomplete.Single.PickList.Bag>
                  </Autocomplete.Single.Root>

                  <FieldMessage.Tip.Text>
                    Tipo do documento
                  </FieldMessage.Tip.Text>
                </FieldMessage.Tip.Root>

                <FieldMessage.Error.Text>
                  { errors.tipoDocumento }
                </FieldMessage.Error.Text>
              </FieldMessage.Error.Root>

              <FieldMessage.Error.Root>
                <FieldMessage.Tip.Root>
                  <DatePicker.DateTime
                    id='dataCarimbo'
                    name='dataCarimbo'
                    label="Data do carimbo"
                    onChange={(value) => {
                      setFieldValue('dataCarimbo', value ?? new Date().toISOString())
                    }}
                    value={new Date(values.dataCarimbo)}
                  />

                  <FieldMessage.Tip.Text>
                    Data de recebimento do documento
                  </FieldMessage.Tip.Text>
                </FieldMessage.Tip.Root>

                <FieldMessage.Error.Text>
                  { errors.dataCarimbo }
                </FieldMessage.Error.Text>
              </FieldMessage.Error.Root>

              <FieldMessage.Error.Root>
                <FieldMessage.Tip.Root>
                  <TextArea
                    id='observacao'
                    name='observacao'
                    label='Observação'
                    onChange={(event) => setFieldValue('observacao', event.target.value)}
                    value={values.observacao}
                  />

                  <FieldMessage.Tip.Text>
                    Qualquer observação que julgar necessário adicionar ao arquivo
                  </FieldMessage.Tip.Text>
                </FieldMessage.Tip.Root>

                <FieldMessage.Error.Text>
                  { errors.observacao }
                </FieldMessage.Error.Text>
              </FieldMessage.Error.Root>

              {/* <FieldMessage.Error.Root>
                <FieldMessage.Tip.Root>
                  <CheckBox
                    id='prioridade'
                    name='prioridade'
                    label='Documento com prioridade'
                    onChange={(event) => {
                      setFieldValue('prioridade', event.target.checked)
                    }}
                    value={values.prioridade}
                  />

                  <FieldMessage.Tip.Text>

                  </FieldMessage.Tip.Text>
                </FieldMessage.Tip.Root>

                <FieldMessage.Error.Text>
                  { errors.prioridade }
                </FieldMessage.Error.Text>
              </FieldMessage.Error.Root> */}

              <Button.Contained.Root
                type="submit"
                disabled={isSubmitting}
                className='bg-cyan-500 dark:bg-cyan-500 hover:bg-cyan-500 dark:hover:bg-cyan-500'
              >
                {
                  isSubmitting ?
                  <Button.Contained.IconLoading />
                  :
                  <>
                    <Button.Contained.Icon>
                      <Icon.FlagCheckered weight='fill' />
                    </Button.Contained.Icon>
                    <Button.Contained.Text>
                      Finalizar
                    </Button.Contained.Text>
                  </>
                }
              </Button.Contained.Root>
            </form>
          )}
        </Formik>
     }
    </>
  )
}
