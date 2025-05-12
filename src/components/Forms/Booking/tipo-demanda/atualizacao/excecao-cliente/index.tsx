'use client'

import { useCallback, useEffect, useState } from "react";
import { v4 as uuid } from 'uuid';
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/Skeleton2.0";
import { Textarea } from "@/components/ui/textarea";
import { FieldMessage } from "@/components/FieldMessage";
import { fileHelper } from "@/utils/File";
import { ArquivoDemanda } from "@/actionsV2/backend/interface";
import { toast } from "@/utils/toast";
import { ClipboardCheck, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { DateTimePicker } from "@/components/ui/date-time-picker";

import {
  DemandaAtualizacao,
  FormFile,
  JustificativaInfo,
  TipoJustificativaInfo,
} from "../../interfaces";

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { DetalhesCadastro } from "@/components/Forms/util/Components/DetalhesCadastro";
import { FileViewer } from "@/components/Forms/util/Components/FileViewer";
import { actions } from "@/actionsV2";

interface CadastroJuridicoParams {
  id: string;
  esteira: string;
  esteiraTipo: string;
  dadosIniciais: DemandaAtualizacao;
}

interface FormAtualizacaoBookingExcecaoClienteProps {
  params: CadastroJuridicoParams;
}

interface DadosClienteForm {
  timeOut: number;
}

interface OnClickJustificarEnvio {
  tipo: TipoJustificativaInfo;
  title: string;
}

export function FormAtualizacaoBookingExcecaoCliente({ params }: FormAtualizacaoBookingExcecaoClienteProps) {
  const pk = params.id;
  const esteira = params.esteira;
  const esteiraTipo = params.esteiraTipo;
  const dadosIniciais = params.dadosIniciais;

  const router = useRouter();

  const formBag = useForm<DemandaAtualizacao>({
    defaultValues: {
      observacao: [],
      processo: '',
      liminar_habilitada: false,
      conteudo_liminar: '',
      audiencia_habilitada: false,
      data_audiencia: '',
      sentenca_habilitada: false,
      conteudo_sentenca: '',
      despacho_habilitado: false,
      despacho_conteudo: '',
      prazo_liminar: '',
      prazo_tipo: 'dias_corridos',
    }
  });

  const values = formBag.watch();

  const [initialUploadList, setInitialUploadList] = useState<FormFile[] | null>(null);

  const [justificarEnvioDialogInfo, setJustificarEnvioDialogInfo] = useState<JustificativaInfo>({
    tipo: '',
    title: {
      text: 'Justificar envio',
    },
    justificativa: {
      value: '',
      isValid: true,
    }
  });

  const [dadosCliente, setDadosCliente] = useState<DadosClienteForm>({
    timeOut: 5,
  });

  const [isLoadingForm, setIsLoadingForm] = useState(true);
  const [isLoadingFileViewer, setIsLoadingFileViewer] = useState(true);
  const [isJustificandoEnvio, setIsJustificandoEnvio] = useState(false);
  const [isDesvinculandoUsuario, setIsDesvinculandoUsuario] = useState(false);

  const [dialogJustificarEnvioOpen, setDialogJustificarEnvioOpen] = useState(false);

  const formatInitialFormValues = useCallback((values: Partial<DemandaAtualizacao>) => {
    const formattedValues = {
      ...values,
    } as DemandaAtualizacao;

    console.log('Valores NAO formatados:', values);
    console.log('Valores formatados:', formattedValues);

    return formattedValues;
  }, []);

  const updateDadosCliente = (newDados: Partial<DadosClienteForm>) => {
    if (!newDados) {
      return;
    }

    setDadosCliente((prevState) => {
      if (!prevState) {
        return {
          timeOut: 5,
          tiposDemanda: [],
          assuntos: [],
          descricaoOficio: [],
        }
      }

      return {
        ...prevState,
        ...newDados,
        timeOut: newDados.timeOut ?? 5,
      }
    });
  }

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

  const updateInitialFormValues = useCallback((newValues: Partial<DemandaAtualizacao>) => {
    try {
      const oldValues = formBag.getValues();

      const formattedValues = formatInitialFormValues({
        ...oldValues,
        ...newValues,
      });

      formBag.reset(formattedValues);

    } catch (error: any) {
      toast.error({
        title: 'Falha ao atualizar os dados do formulário',
        description: error?.message,
      });
    } 
  }, [formatInitialFormValues, formBag.getValues, formBag.reset]);

  const desbloqueiaDemanda = async () => {
    try {
      await actions.backend.demanda.desbloqueiaUsuarioDemanda({ pk })
    } catch(error: any) {
      throw new Error(error?.message);
    }
  }

  const onSubmit = async (dados: DemandaAtualizacao) => {
    try {
    } catch (error: any) {
      toast.error({
        title: 'Falha ao aprovar o formulário',
        description: error?.message,
      });
    } finally { 

    }
  };

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
        title: 'Falha ao consultar os dados do cliente',
        description: error?.message,
      });
    }
  }

  const handleClickCloseJustificarEnvioDialog = () => {
    updateDialogJustificarEnvioInfo({
      justificativa: {
        value: '',
        isValid: true,
      }
    });

    setDialogJustificarEnvioOpen(false);
  }
  
  const handleClickConfirmaJustificarEnvio = async (info: JustificativaInfo) => {
    try {
      setIsJustificandoEnvio(true);

      const justificativa = justificarEnvioDialogInfo.justificativa.value ?? '';

      if(justificativa.length < 10) {
        updateDialogJustificarEnvioInfo({
          justificativa: {
            isValid: false,
          }
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
  }

  const handleClickSair = async () => {
    try {
      setIsDesvinculandoUsuario(true);

      await desbloqueiaDemanda();

      router.push(`/${esteira}/${esteiraTipo}`);
    } catch (error: any) {
      toast.error({
        title: 'Falha ao desbloquear a demanda',
        description: error?.message,
      });
    }
  }

  const handleHabilitarLiminar = (checked: boolean) => {
    formBag.setValue('liminar_habilitada', !!checked);
    if (!checked) {
      formBag.setValue('conteudo_liminar', '');
    }
  };

  const handleHabilitarAudiencia = (checked: boolean) => {
    formBag.setValue('audiencia_habilitada', !!checked);
    if (!checked) {
      formBag.setValue('data_audiencia', '');
    }
  };

  const handlePrazoLiminarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove qualquer caractere não numérico
    if (value === '' || parseInt(value) > 0) {
      formBag.setValue('prazo_liminar', value);
    }
  };
  
  const handlePrazoTipoChange = () => {
    const prazoTipo = formBag.getValues('prazo_tipo');

    if(prazoTipo === 'dias_corridos') {
      formBag.setValue('prazo_tipo', 'horas_corridas');
    }

    if(prazoTipo === 'horas_corridas') {
      formBag.setValue('prazo_tipo', 'dias_corridos');
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
        description: 'Demanda enviada para exceção oito com sucesso',
      });
    } catch (error: any) { 
      toast.error({
        title: '',
        description: error?.message,
      });
    }
  }

  const handleClickJustificarEnvio = ({ title, tipo }: OnClickJustificarEnvio) => {
    updateDialogJustificarEnvioInfo({
      tipo,
      title: {
        text: title,
      }
    })

    setDialogJustificarEnvioOpen(true);
  }

  const handleDataAudienciaChange = (selectedDate: Date | null) => {
    formBag.clearErrors('data_audiencia');

    if (!selectedDate) {
      formBag.setValue('data_audiencia', '');
      return;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const diaSemana = selectedDate.getDay();
    const ehFinalDeSemana = diaSemana === 0 || diaSemana === 6; // 0 = domingo, 6 = sábado
    const ehRetroativa = selectedDate < hoje;

    if (ehRetroativa && ehFinalDeSemana) {
      toast.warning({
        title: 'Data inválida',
        description: 'A data da audiência não pode ser em um final de semana ou retroativa.'
      });

      formBag.setError('data_audiencia', {
        message: 'A data da audiência não pode ser em um final de semana ou retroativa.'
      });

    }

    if (ehFinalDeSemana) {
      toast.warning({
        title: 'Data inválida',
        description: 'A data da audiência não pode ser em um final de semana.'
      });

      formBag.setError('data_audiencia', {
        message: 'A data da audiência não pode ser em um final de semana.'
      });
    }

    if (ehRetroativa) {
      toast.warning({
        title: 'Data inválida',
        description: 'A data da audiência não pode ser retroativa.'
      });

      formBag.setError('data_audiencia', {
        message: 'A data da audiência não pode ser retroativa.'
      });
    }

    formBag.setValue('data_audiencia', selectedDate.toISOString());
  };

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
        tipo: file.info.tipo,
      }));

    formBag.setValue('arquivos', novosArquivos);
  }, []);

  const carregarArquivosDemanda = useCallback(async (files: ArquivoDemanda[] | undefined) => {
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
              tipo: file.tipo,
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
              tipo: file.tipo,
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

      console.log('Dados recebidos:', dadosIniciais);

      if (!dadosIniciais) {
        return
      }

      const dadosCliente = await getDadosCliente();

      updateDadosCliente({
        timeOut: dadosCliente?.time_out?.['Atualizacao'],
      });

      updateInitialFormValues(dadosIniciais);

      carregarArquivosDemanda(dadosIniciais?.arquivos);
    } catch (error: any) {
      toast.error({
        title: 'Falha ao carregar os dados iniciais',
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
          showTipo
          isLoadingFileViewer={isLoadingFileViewer}
          onChange={handleChangeFileViewer}
        />
      </Card>

      <Card className="flex flex-col w-1/2 gap-4 py-4 h-full overflow-y-auto">
        <CardContent className="flex flex-col gap-4 h-full">
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
                className="space-y-6 flex flex-col gap-4"
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

                {/* Tarefas de Atualização */}
                <div>
                  <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <ClipboardCheck className="w-5 h-5 mr-2 text-green-500" />
                    <span>Tarefas de Atualização</span>
                  </h3>

                  <div className="space-y-4">
                    {/* Liminar (Deferimento da antecipação da tutela) */}
                    <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Liminar (Deferimento da antecipação da tutela)
                        </h5>
                        <div className="flex items-center gap-2 ml-auto">
                          <Checkbox 
                            id="liminar_habilitada" 
                            checked={values.liminar_habilitada}
                            onCheckedChange={handleHabilitarLiminar}
                            disabled
                            //disabled={values.despacho_habilitado}
                          />
                          <Label htmlFor="liminar_habilitada" className="text-sm">
                            Andamento de liminar?
                          </Label>
                        </div>
                      </div>
                      
                      {values.liminar_habilitada && (
                        <div className="space-y-3 mt-2">
                          <div>
                            <Label className="block text-sm mb-1">Prazo para cumprimento da liminar</Label>
                            <div className="flex items-center gap-3">
                              <Input
                                type="text"
                                placeholder="Prazo"
                                className="w-24 p-2 border rounded-md text-sm"
                                {...formBag.register('prazo_liminar')} 
                                onChange={handlePrazoLiminarChange}
                              />
                              <div className="flex items-center gap-2">
                                <span className={`text-xs ${values.prazo_tipo === 'dias_corridos' ? 'text-gray-500' : 'text-blue-600 font-medium'}`}>
                                  horas corridas
                                </span>
                                <div
                                  className={`relative inline-block w-10 h-5 rounded-full transition-colors duration-200 ease-in-out ${
                                    values.prazo_tipo === 'dias_corridos' ? 'bg-blue-500' : 'bg-gray-300'
                                  }`}
                                  onClick={handlePrazoTipoChange}>
                                  <span
                                    className={`absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                                      values.prazo_tipo === 'dias_corridos' ? 'transform translate-x-5' : ''
                                    }`}
                                  />
                                  <Input
                                    type="checkbox"
                                    className="sr-only"
                                    checked={values.prazo_tipo === 'dias_corridos'}
                                    onChange={handlePrazoTipoChange}
                                  />
                                </div>
                                <span className={`text-xs ${values.prazo_tipo === 'dias_corridos' ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                                  dias corridos
                                </span>
                              </div>
                            </div>
                          </div>
                          <div>
                            <Label className="block text-sm mb-1">Conteúdo da liminar</Label>
                            <Textarea 
                              id="conteudo_liminar" 
                              {...formBag.register('conteudo_liminar')} 
                              rows={3} 
                              placeholder="Transcrição da liminar deferida"
                              className="bg-white dark:bg-black" 
                              disabled
                              //disabled={values.despacho_habilitado}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  
                    
                    {/* Audiência */}
                    <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Audiência
                        </h5>
                        <div className="flex items-center gap-2 ml-auto">
                          <Checkbox 
                            id="audiencia_habilitada" 
                            checked={values.audiencia_habilitada}
                            onCheckedChange={handleHabilitarAudiencia}
                            disabled
                            //disabled={values.despacho_habilitado}
                          />
                          <Label htmlFor="audiencia_habilitada" className="text-sm">
                            Andamento de audiência?
                          </Label>
                        </div>
                      </div>
                      
                      {values.audiencia_habilitada && (
                        <div className="space-y-3 mt-2">
                          <FieldMessage.Error.Root>
                            <div className="space-y-2">
                              <Label htmlFor="data_audiencia">Data e hora</Label>
                              <div className="group flex gap-2 items-center">
                                <DateTimePicker
                                  date={values.data_audiencia ? new Date(values.data_audiencia) : undefined}
                                  onSelect={handleDataAudienciaChange}
                                  //disabled={values.despacho_habilitado}
                                  disabled
                                />
                                <X 
                                  className={`w-4 h-4 cursor-pointer text-gray-400 hover:text-red-500 ${values.despacho_habilitado ? 'opacity-50 pointer-events-none' : ''}`} 
                                />
                              </div>
                            </div>
                            <FieldMessage.Error.Text>
                              {formBag.formState.errors.data_audiencia?.message}
                            </FieldMessage.Error.Text>
                          </FieldMessage.Error.Root>
                        </div>
                      )}
                    </div>
                    
                    {/* Sentença */}
                    <div className="bg-green-50 dark:bg-green-950/30 p-3 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Sentença
                        </h5>
                        <div className="flex items-center gap-2 ml-auto">
                          <Checkbox 
                            id="sentenca_habilitada" 
                            checked={values.sentenca_habilitada}
                            onCheckedChange={(checked) => {
                              formBag.setValue('sentenca_habilitada', !!checked)
                              if (!checked) {
                                formBag.setValue('conteudo_sentenca', '')
                              }
                            }}
                            disabled
                            //disabled={values.despacho_habilitado}
                          />
                          <Label htmlFor="sentenca_habilitada" className="text-sm">
                            Andamento de sentença?
                          </Label>
                        </div>
                      </div>
                      
                      {values.sentenca_habilitada && (
                        <div className="space-y-3 mt-2">
                          <div>
                            <Label className="block text-sm mb-1">Conteúdo da sentença</Label>
                            <Textarea 
                              id="conteudo_sentenca" 
                              {...formBag.register('conteudo_sentenca')} 
                              rows={3} 
                              placeholder="Transcrição da sentença"
                              className="bg-white dark:bg-black" 
                              disabled
                              //disabled={values.despacho_habilitado}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Despacho */}
                    <div className="bg-gray-50 dark:bg-gray-800/30 p-3 rounded-md">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Despacho
                        </h5>
                        <div className="flex items-center gap-2 ml-auto">
                          <Checkbox 
                            id="despacho_habilitado" 
                            checked={values.despacho_habilitado}
                            disabled
                          />
                          <Label htmlFor="despacho_habilitado" className="text-sm">
                            Andamento de despacho?
                          </Label>
                        </div>
                      </div>
                      
                      {values.despacho_habilitado && (
                        <div className="space-y-3 mt-2">
                          <div>
                            <Label className="block text-sm mb-1">Conteúdo do despacho</Label>
                            <Textarea 
                              id="despacho_conteudo" 
                              {...formBag.register('despacho_conteudo')} 
                              rows={3} 
                              placeholder="Transcrição do despacho"
                              className="bg-white dark:bg-black" 
                              disabled
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    disabled={isLoadingForm} 
                    onClick={handleClickSair}
                  >
                    { isDesvinculandoUsuario ? 'Saindo...' : 'Sair' }
                  </Button>

                  <Button 
                    type="button" 
                    variant="outline" 
                    disabled={isJustificandoEnvio} 
                    onClick={() => handleClickJustificarEnvio({
                      title: 'Justificar envio para exceção oito',
                      tipo: 'enviar-excecao-oito',
                    })}
                  >
                    { isJustificandoEnvio ? 'Enviando...' : 'Enviar para exceção oito' }
                  </Button>
                </div>
              </form>
            )
          }
        </CardContent>
      </Card>

      <Dialog
        open={dialogJustificarEnvioOpen}
        onOpenChange={setDialogJustificarEnvioOpen}
      >
        <DialogContent 
          aria-describedby='dialog-justificar-envio'
          className="flex flex-col gap-4"
        >
          <DialogHeader>
            <DialogTitle>{ justificarEnvioDialogInfo.title.text }</DialogTitle>
          </DialogHeader>

          <FieldMessage.Error.Root>  
            <Textarea 
              id="justificar-envio" 
              rows={6} 
              className="bg-white dark:bg-black"
              onChange={(event) => updateDialogJustificarEnvioInfo({ 
                justificativa: {
                  value: event.target.value,
                  isValid: true,
                }
              })}
              value={justificarEnvioDialogInfo.justificativa.value} 
            />
            <FieldMessage.Error.Text   
              visible={!justificarEnvioDialogInfo.justificativa.isValid}
            >
              A justificativa deve conter no mínimo 10 caracteres
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root >

          <DialogFooter>
            <Button 
              type="button"
              variant='outline'
              onClick={handleClickCloseJustificarEnvioDialog}
            >
              Fechar
            </Button>

            <Button 
              type="button"
              variant='default'
              disabled={!justificarEnvioDialogInfo.justificativa.isValid}
              onClick={() => handleClickConfirmaJustificarEnvio(justificarEnvioDialogInfo)}
            >
              { isJustificandoEnvio ? 'Submetendo...' : 'Submeter' }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}