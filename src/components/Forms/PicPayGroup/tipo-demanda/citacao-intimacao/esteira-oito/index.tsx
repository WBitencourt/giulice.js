'use client'

import { useCallback, useEffect, useMemo, useState } from "react";
import { v4 as uuid } from 'uuid';
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import Countdown from "@/components/Countdown";
import { toast } from "@/utils/toast";
import { Skeleton } from "@/components/Skeleton2.0";
import { Textarea } from "@/components/ui/textarea";
import { FieldMessage } from "@/components/FieldMessage";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { maskNumeroProcesso } from "@/utils/Masks";
import { actions } from "@/actionsV2";
import { fileHelper } from "@/utils/File";
import { ArquivoDemanda } from "@/actionsV2/backend/interface";
import moment from "moment";
import { DetalhesCadastro } from "@/components/Forms/util/Components/DetalhesCadastro";
import { FileViewer } from "@/components/Forms/util/Components/FileViewer";

import {
  OnUploadErrorProps,
  FormFile,
  OnDropAccepted,
  OnDropRejected,
  OnProcessUpdateProps,
  ProcessUploadErrorProps,
  OnUploadProgressProps,
  HandleClickDeleteFileProps,
  HandleClickRetryUploadProps,
  ObservacaoInfo,
  DemandaCitacaoIntimacaoPicPay,
  JustificativaInfo
} from "../../interfaces";

export interface FormCitacaoIntimacaoPicPayGroupEsteiraOito {
  id: string;
  esteira: string;
  esteiraTipo: string;
  dadosIniciais?: DemandaCitacaoIntimacaoPicPay;
}

interface FormCitacaoIntimacaoPicPayGroupEsteiraOitoProps {
  params: FormCitacaoIntimacaoPicPayGroupEsteiraOito;
}

interface DadosClienteForm {
  timeOut: number;
}

export function FormCitacaoIntimacaoPicPayGroupEsteiraOito({ params }: FormCitacaoIntimacaoPicPayGroupEsteiraOitoProps) {
  const pk = params.id;
  const esteira = params.esteira;
  const esteiraTipo = params.esteiraTipo;
  const dadosIniciais = params.dadosIniciais;

  const router = useRouter();

  const formBag = useForm<DemandaCitacaoIntimacaoPicPay>({
    defaultValues: {
      processo: '',
      desdobramento: false,
    }
  });

  const values = formBag.watch();

  const [initialUploadList, setInitialUploadList] = useState<FormFile[] | null>(null);

  const [dadosCliente, setDadosCliente] = useState<DadosClienteForm>({
    timeOut: 5,
  });

  const [justificarEnvioDialogInfo, setJustificarEnvioDialogInfo] = useState<JustificativaInfo>({
    tipo: '',
    title: {
      text: 'Justificar envio',
    },
    justificativa: {
      value: '',
      isValid: true,
    },
  });

  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isLoadingFileViewer, setIsLoadingFileViewer] = useState(false);
  const [isPausedCountDown, setIsPausedCountDown] = useState<boolean>(false);
  const [isDesvinculandoUsuario, setIsDesvinculandoUsuario] = useState(false);
  const [isJustificandoEnvio, setIsJustificandoEnvio] = useState(false);
  const [isSavingForm, setIsSavingForm] = useState(false);

  const [dialogJustificarEnvioOpen, setDialogJustificarEnvioOpen] = useState(false);

  const dateNow = useMemo(() => new Date(), []);

  const formatInitialFormValues = useCallback((values: Partial<DemandaCitacaoIntimacaoPicPay>) => {
    const formattedValues = {
      ...values,
    } as DemandaCitacaoIntimacaoPicPay;

    formattedValues.tipo_demanda = values.tipo_demanda ?? '';
    formattedValues.processo = values.processo ?? '';
    formattedValues.identificacao = values.identificacao ?? '';

    return formattedValues;
  }, []);

  const updateDialogJustificarEnvioInfo = (newState: Partial<JustificativaInfo>) => {
    if (!newState || Object.keys(newState).length === 0) {
      return; // Retorna se newState for null, undefined ou um objeto vazio
    }

    setJustificarEnvioDialogInfo((prevState) => {
      return {
        ...prevState,
        ...newState,
        title: {
          ...prevState.title,
          ...newState.title,
        },
        justificativa: {
          ...prevState.justificativa,
          ...newState.justificativa,
        },
      };
    });
  };

  const updateDadosCliente = (newDados: Partial<DadosClienteForm>) => {
    if (!newDados) {
      return;
    }

    setDadosCliente((prevState) => {
      if (!prevState) {
        return {
          timeOut: 5,
        }
      }

      return {
        ...prevState,
        ...newDados,
        timeOut: newDados.timeOut ?? 5,
      }
    });
  }
  
  const getDadosCliente = async () => {
    try {
      const cliente = dadosIniciais?.cliente;

      if(!cliente) {
        throw new Error('Cliente não informado corretamente.');
      }

      const dadosCliente = await actions.backend.cliente.getDadosCliente({
        cliente: cliente,
      });

      return dadosCliente;
    } catch (error: any) {
      toast.error({
        title: 'Erro',
        description: error?.message,
      });
    }
  }

  const updateInitialFormValues = useCallback((newValues: Partial<DemandaCitacaoIntimacaoPicPay>) => {
    try {
      //console.log('Dados recebidos para atualizar o formulário:', newValues);

      const oldValues = formBag.getValues();

      const formattedValues = formatInitialFormValues({
        ...oldValues,
        ...newValues,
      });

      formBag.reset(formattedValues);

    } catch (error: any) {
      toast.error({
        title: 'Erro',
        description: 'Falha ao atualizar os dados do formulário',
      });
    } 
  }, [formatInitialFormValues]);

  const desbloqueiaDemanda = async () => {
    try {
      await actions.backend.demanda.desbloqueiaUsuarioDemanda({
        pk,
      })
    } catch(error: any) {
      throw new Error(error?.message);
    }
  }   

  const formularioValido = (values: DemandaCitacaoIntimacaoPicPay) => {
    const erros: Record<string, string> = {}

    if (!values.processo) {
      erros.processo = 'O número do processo é obrigatório.';
    }

    const cleanedValue = values?.processo?.replace(/\D/g, '');
    const cleanedInitialValue = dadosIniciais?.processo?.replace(/\D/g, '');

    console.log('cleanedValue', cleanedValue);
    console.log('cleanedInitialValue', cleanedInitialValue);

    if (values?.desdobramento === false && cleanedValue !== cleanedInitialValue) {
      erros.processo = 'O número do processo foi alterado e o desdobramento está desativado.';
    }

    if (values?.desdobramento === true && cleanedValue === cleanedInitialValue) {
      erros.processo = 'O número do processo não foi alterado e o desdobramento está ativado.';
    }

    if (Object.keys(erros).length > 0) {
      const dicionarioCamposRequired = {
        processo: 'Número do processo',
      };

      const nomeCamposRequired = Object.keys(erros).map((campo) => {
        return dicionarioCamposRequired[campo as keyof typeof dicionarioCamposRequired];
      }).filter((campo) => campo && campo.length > 0);

      toast.custom.warning('Aviso!', {
        duration: 1000 * 15,
        closeButton: true,
        dismissible: true,
        icon: <></>,
        description: (
          <div>
            <p>Campos obrigatórios não preenchidos corretamente:</p>
            <br />
            <ul>
              {nomeCamposRequired.map((campo) => (
                <li key={`${campo}`}>{campo}</li>
              ))}
            </ul>
          </div>
        ),
      });
    }

    // Adiciona os erros ao formBag
    Object.entries(erros).forEach(([campo, mensagem]) => {
      formBag.setError(campo as keyof DemandaCitacaoIntimacaoPicPay, { type: 'required', message: mensagem });
    });

    return Object.keys(erros).length === 0;
  };

  const onSubmit = async (values: DemandaCitacaoIntimacaoPicPay) => {
    try {
      formBag.clearErrors();

      const formValido = formularioValido(values);

      if (!formValido) {
        return;
      }

      // await saveForm();

      console.log('Dados do formulário submetidos:', values);

      await actions.backend.demanda.submeterDemanda({
        pk,
        dados: values,
      });

      router.push(`/${esteira}/${esteiraTipo}`);

      toast.success({
        title: 'Sucesso',
        description: 'Formulário enviado com sucesso.',
      });
    } catch (error: any) {
      toast.error({
        title: 'Erro',
        description: error?.message,
      });
    }
  };

  const handleFinalCountDown = async () => {
    try {
      //await saveForm();
      await desbloqueiaDemanda();

      toast.success({
        title: 'Sucesso',
        description: 'Tempo limite atingido, demanda desbloqueada',
      });

      router.push(`/${esteira}/${esteiraTipo}`);
    } catch(error: any) {
      toast.error({
        title: 'Erro',
        description: 'Falha ao desbloquear a demanda. Por favor, tente novamente.',
      });
    }
  }

  const handleClickSair = async () => {
    try {
      setIsDesvinculandoUsuario(true);

      await actions.backend.demanda.desbloqueiaUsuarioDemanda({
        pk,
      });

      router.push(`/${esteira}/${esteiraTipo}`);
    } catch (error: any) {
      toast.error({
        title: 'Erro',
        description: error?.message,
      });
    } finally {
      setIsDesvinculandoUsuario(false);
    }
  }

  const handleClickEnviarExcecao = () => {
    setDialogJustificarEnvioOpen(true);

    updateDialogJustificarEnvioInfo({
      tipo: 'enviar-excecao-oito',
      title: {
        text: 'Justificar envio para exceção',
      },
    });
  };

  const saveForm = async () => {
    try {
      setIsSavingForm(true);

      const dados = {
        ...formBag.getValues(),
      };

      console.log('Valores do formulário para salvar:', dados);

      await actions.backend.demanda.salvarDemanda({
        pk,
        dados,
      });

      toast.success({
        title: 'Salvo!',
        description: 'Formulário salvo com sucesso.',
      });
    } catch (error: any) {
      toast.error({
        title: 'Falha ao salvar o formulário',
        description: error?.message,
      });
    } finally {
      setIsSavingForm(false);
    }
  };

  const enviarExcecaoOito = async () => {
    try {
      await actions.backend.demanda.enviarDemandaExcecaoOito({
        pk,
        justificativa: justificarEnvioDialogInfo.justificativa.value ?? '',
      });

      toast.success({
        title: 'Enviado',
        description: 'Formulário enviado com sucesso.',
      });

      router.push(`/${esteira}/${esteiraTipo}`);
    } catch (error: any) {
      toast.error({
        title: 'Falha ao enviar o formulário',
        description: error?.message,
      });
    }
  };
  
  const handleClickCloseJustificarEnvioDialog = () => {
    updateDialogJustificarEnvioInfo({
      justificativa: {
        value: '',
        isValid: true,
      },
    });

    setDialogJustificarEnvioOpen(false);
  };

  const handleClickConfirmaJustificarEnvio = async (info: JustificativaInfo) => {
    try {
      setIsJustificandoEnvio(true);

      const justificativa = justificarEnvioDialogInfo.justificativa.value ?? '';

      if (justificativa.length < 10) {
        updateDialogJustificarEnvioInfo({
          justificativa: {
            isValid: false,
          },
        });

        return;
      }

      switch (info.tipo) {
        case 'enviar-excecao-oito':
          await enviarExcecaoOito();
          break;

        default:
          break;
      }

      router.push(`/${esteira}/${esteiraTipo}`);
    } catch (error: any) {
      toast.error({
        title: 'Falha ao justificar envio',
        description: error?.message,
      });
    } finally {
      setIsJustificandoEnvio(false);
    }
  };

  const handleClickSalvar = async () => {
    try {
      await saveForm();
    } catch (error: any) {
      toast.error({
        title: 'Falha ao salvar o formulário',
        description: error?.message,
      });
    } finally {
      setIsSavingForm(false);
    }
  };

  const handleDesdobramentoChange = () => {
    const newState = !formBag.getValues('desdobramento');

    formBag.setValue('desdobramento', newState);

    formBag.clearErrors('processo');
  };

  const handleProcessoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const maskedValue = maskNumeroProcesso(value);

    formBag.setValue('processo', maskedValue);
  };

  const handleStartProcessUpload = useCallback(() => {
    setIsPausedCountDown(true);
  }, []);

  const handleEndProcessUpload = useCallback(() => {
    setIsPausedCountDown(false);
  }, []);

  const handleChangeFileViewer = useCallback((files: FormFile[]) => {
    const novosArquivos = files
      .filter(file => file.status.success === true && file.status.progress === 100)
      .map(file => ({
        s3key: file.info.s3Key,
        s3Bucket: file.info.s3Bucket,
        file_name: file.info.name,
        file_size: file.info.size,
        sk: file.id,
        file_unit: file.info.unit || 'MB',
      }));

    formBag.setValue('arquivos', novosArquivos);
  }, []);

  const carregarArquivosDemanda = useCallback((files: ArquivoDemanda[] | undefined) => {
    try {
      setIsLoadingFileViewer(true);

      const initialUploadList = files?.map((file) => {
        try {
          const newFile: FormFile = {
            id: file.sk,
            info: {
              name: file.file_name,
              size: file.file_size,
              sizeFormatted: fileHelper.convertToLiteralString({
                size: file.file_size,
                unit: file.file_unit,
                newUnit: 'MB',
              }),
              unit: file.file_unit,
              url: '',
              s3Key: file.s3key,
              s3Bucket: file.s3Bucket,
            },
            status: {
              success: true,
              progress: 100,
              message: 'Arquivo carregado com sucesso',
            },
            allow: {
              download: true,
              link: true,
              retryUpload: false,
              delete: true,
            },
            dropzoneFile: undefined,
          };

          return newFile;
        } catch (error: any) {
          const errorFile: FormFile = {
            id: uuid(),
            info: {
              name: file.file_name,
              size: file.file_size,
              sizeFormatted: fileHelper.convertToLiteralString({
                size: file.file_size,
                unit: file.file_unit,
                newUnit: 'MB',
              }),
              unit: file.file_unit,
              url: '',
              s3Key: file.s3key,
              s3Bucket: file.s3Bucket,
            },
            status: {
              success: false,
              progress: 100,
              message: error?.message,
            },
            allow: {
              download: false,
              link: false,
              retryUpload: false,
              delete: false,
            },
            dropzoneFile: undefined,
          };

          return errorFile;
        }
      }) || [];

      if (initialUploadList.length === 0) {
        setInitialUploadList([]);
        return;
      }

      setInitialUploadList(initialUploadList);
    } catch (error: any) {
      toast.error({
        title: 'Falha ao carregar o visualizador de arquivos',
        description: error?.message,
      });
    } finally {
      setIsLoadingFileViewer(false);
    }
  }, []);

  const atualizaFormDadosIniciais = useCallback(async () => {
    try {
      setIsLoadingForm(true);
      setIsLoadingFileViewer(true);;

      if (!dadosIniciais) {
        return
      }

      const dadosCliente = await getDadosCliente();

      updateDadosCliente({
        timeOut: dadosCliente?.time_out['Citação/Intimação'],
      });

      updateInitialFormValues(dadosIniciais);

      carregarArquivosDemanda(dadosIniciais?.arquivos);
    } catch (error: any) {
      toast.error({
        title: 'Erro',
        description: error?.message,
      });
    } finally {
      setIsLoadingForm(false);
      setIsLoadingFileViewer(false);
    }
  }, [updateInitialFormValues, carregarArquivosDemanda]);

  useEffect(() => {
    atualizaFormDadosIniciais();
  }, []);

  return (
    <div className="flex w-full h-full gap-4">
      <Card
        style={{ maxHeight: 'calc(100vh - 136px)' }}
        className="sticky top-[72px] w-1/2 gap-4 p-2 rounded bg-zinc-100 dark:bg-zinc-800"
      >
        <FileViewer
          pk={dadosIniciais?.pk || ''}
          initialUploadList={initialUploadList}
          isLoadingFileViewer={isLoadingFileViewer}
          onChange={handleChangeFileViewer}
          onStartProcessUpload={handleStartProcessUpload}
          onEndProcessUpload={handleEndProcessUpload}
        />
      </Card>

      <Card className="flex flex-col w-1/2 gap-4 py-4 h-full overflow-y-auto">
        <CardContent className="flex flex-col gap-4 h-full">
          <Countdown 
            label='Tempo restante para preenchimento:'
            paused={isPausedCountDown}
            time={{
              now: dateNow.toISOString(),
              start: dateNow.toISOString(),
              deadline: moment(dateNow).add(dadosCliente.timeOut, 'minutes').toISOString(),
            }}
            onFinalCountdown={handleFinalCountDown}
          />

          {
            isLoadingForm ? (
              <Skeleton.Root className='flex flex-col gap-4'>
                <Skeleton.Input />
                <Skeleton.Input />
                <Skeleton.Input />
                <Skeleton.Input />
                <Skeleton.Input />
                <Skeleton.Input />
                <Skeleton.Input />
                <Skeleton.Input />
                <Skeleton.Input />
                <Skeleton.Input />
                <Skeleton.Input />
              </Skeleton.Root>
            ) : (
              <form 
                onSubmit={(event) => {
                  formBag.handleSubmit(onSubmit)(event); // Garante que o `handleSubmit` seja chamado corretamente
                }}
                className="space-y-6 flex flex-col gap-2"
              >
                <DetalhesCadastro
                  pk={dadosIniciais?.pk || ''}
                  values={{
                    pk: dadosIniciais?.pk || '',
                    createdBy: dadosIniciais?.created_by || '',
                    usuarioAtuando: dadosIniciais?.usuario_atuando || '',
                    dataCarimbo: dadosIniciais?.data_carimbo || '',
                    dueDate: dadosIniciais?.due_date || '',
                    tipoDemanda: dadosIniciais?.tipo_demanda || '',
                    perfilDemanda: dadosIniciais?.perfil_demanda || '',
                    status: dadosIniciais?.status_demanda || dadosIniciais?.status || '',
                    observacao: dadosIniciais?.observacao?.map((item) => ({
                      criadaEm: item.criada_em || '',
                      mensagem: item.mensagem || '',
                      criadaPor: item.criada_por || '',
                    })) || [],
                  }}
                />

                <FieldMessage.Error.Root>  
                  <div>
                    {/* <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                      <GitBranch className="w-5 h-5 mr-2 text-blue-500" />
                      <span>Titulo</span>
                    </h3> */}
                    <div className="space-y-4 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md">
                      <div className="space-y-2">
                        <Label htmlFor="processo">Número do processo</Label>
                        <Input 
                          id="processo" 
                          {...formBag.register('processo')} 
                          placeholder="...número do processo..." 
                          onChange={handleProcessoChange}
                        />
                      </div>

                      <div className="flex items-center justify-between">
                        <Label htmlFor="desdobramento">Desdobramento</Label>
                        <div
                          className={`relative inline-block w-10 h-5 rounded-full transition-colors duration-200 ease-in-out cursor-pointer ${
                            values.desdobramento ? 'bg-green-500' : 'bg-red-500'
                          }`}
                          onClick={handleDesdobramentoChange}
                        >
                          <span
                            className={`absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                              values.desdobramento ? 'transform translate-x-5' : ''
                            }`}
                          />
                          <Input
                            type="checkbox"
                            className="sr-only"
                            checked={values.desdobramento}
                            onChange={handleDesdobramentoChange}
                          />
                        </div>
                      </div>

                      {/* <div className="space-y-2">
                        <Label htmlFor="identificacao">Identificação</Label>
                        <Input 
                          id="identificacao" 
                          disabled
                          {...formBag.register('identificacao')} 
                          placeholder="...identificação..." 
                        />
                      </div> */}
                    </div>
                  </div>
                  <FieldMessage.Error.Text>
                    { formBag.formState.errors.processo?.message }
                  </FieldMessage.Error.Text>
                </FieldMessage.Error.Root >

                <div className="flex justify-center space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    disabled={isDesvinculandoUsuario} 
                    onClick={handleClickSair}
                  >
                    { isDesvinculandoUsuario ? 'Saindo...' : 'Sair' }
                  </Button>

                  <Button 
                    type="button" 
                    variant="outline" 
                    disabled={isJustificandoEnvio} 
                    onClick={handleClickEnviarExcecao}
                  >
                    { isJustificandoEnvio ? 'Enviando...' : 'Enviar para exceção oito' }
                  </Button>

                  {/* <Button 
                    type="button" 
                    variant="outline" 
                    disabled={isSavingForm} 
                    onClick={handleClickSalvar}
                  >
                    { isSavingForm ? 'Salvando...' : 'Salvar' }
                  </Button> */}

                  <Button 
                    type="submit"
                    disabled={formBag.formState.isSubmitting || Object.keys(formBag.formState.errors).length > 0}
                  >
                    { formBag.formState.isSubmitting ? 'Submetendo...' : 'Submeter' }
                  </Button>
                </div>
              </form>
            )
          }
        </CardContent>
      </Card>

      <Dialog open={dialogJustificarEnvioOpen} onOpenChange={setDialogJustificarEnvioOpen}>
        <DialogContent aria-describedby="dialog-justificar-envio" className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>{justificarEnvioDialogInfo.title.text}</DialogTitle>
          </DialogHeader>

          <FieldMessage.Error.Root>
            <Textarea
              id="justificar-envio"
              rows={6}
              className="bg-white dark:bg-black"
              onChange={(event) =>
                updateDialogJustificarEnvioInfo({
                  justificativa: {
                    value: event.target.value,
                    isValid: true,
                  },
                })
              }
              value={justificarEnvioDialogInfo.justificativa.value}
            />
            <FieldMessage.Error.Text visible={!justificarEnvioDialogInfo.justificativa.isValid}>
              A justificativa deve conter no mínimo 10 caracteres
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClickCloseJustificarEnvioDialog}>
              Fechar
            </Button>

            <Button
              type="button"
              variant="default"
              disabled={!justificarEnvioDialogInfo.justificativa.isValid}
              onClick={() => handleClickConfirmaJustificarEnvio(justificarEnvioDialogInfo)}>
              {isJustificandoEnvio ? 'Submetendo...' : 'Submeter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}