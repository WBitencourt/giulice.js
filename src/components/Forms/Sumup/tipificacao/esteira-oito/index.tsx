'use client'

import { useCallback, useEffect, useMemo, useState } from "react";
import moment from 'moment';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { maskNumeroProcesso } from "@/utils/Masks";
import { picklist } from "../picklists";

import {
  DadosTipificacao,
  FormFile,
  JustificativaInfo,
  TipoJustificativaInfo
} from "../../tipificacao/interfaces";

import { fileHelper } from "@/utils/File";
import { DetalhesCadastro } from "@/components/Forms/util/Components/DetalhesCadastro";
import { FileViewer } from "@/components/Forms/util/Components/FileViewer";
import { actions } from "@/actionsV2";
import { ArquivoDemanda } from "@/actionsV2/backend/interface";
import { cleanTextJustNumbersAllowed } from "@/utils/String";

export interface FormTipificacaoSumUpEsteiraOitoParams {
  id: string;
  esteira: string;
  esteiraTipo: string;
  dadosIniciais: DadosTipificacao;
}

interface FormTipificacaoSumUpEsteiraOitoProps {
  params: FormTipificacaoSumUpEsteiraOitoParams;
}

interface OnClickJustificarEnvio {
  tipo: TipoJustificativaInfo;
  title: string;
}

interface DadosClienteForm {
  timeOut: number;
  tiposDemanda: string[];
}

export function FormTipificacaoSumUpEsteiraOito({ params }: FormTipificacaoSumUpEsteiraOitoProps) {
  const pk = params.id;
  const esteira = params.esteira;
  const esteiraTipo = params.esteiraTipo;
  const dadosIniciais = params.dadosIniciais;

  const router = useRouter();

  const formBag = useForm<DadosTipificacao>();

  const values = formBag.watch();

  const [initialUploadList, setInitialUploadList] = useState<FormFile[] | null>(null);

  const [dadosCliente, setDadosCliente] = useState<DadosClienteForm>({
    timeOut: 5,
    tiposDemanda: [],
  });

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

  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isLoadingFileViewer, setIsLoadingFileViewer] = useState(false);
  const [isPausedCountDown, setIsPausedCountDown] = useState<boolean>(false);
  const [isEnviandoExcecao, setIsEnviandoExcecao] = useState(false);
  const [isJustificandoEnvio, setIsJustificandoEnvio] = useState(false);

  const [dialogJustificarEnvioOpen, setDialogJustificarEnvioOpen] = useState(false);

  const dateNow = useMemo(() => new Date(), []);

  const formatInitialFormValues = useCallback((values: Partial<DadosTipificacao>) => {
    const formattedValues = {
      ...values,
    } as DadosTipificacao;

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
          tiposDemanda: [],
        }
      }

      return {
        ...prevState,
        ...newDados,
        timeOut: newDados.timeOut ?? 5,
        tiposDemanda: newDados.tiposDemanda?.sort((a: string, b: string) => a.localeCompare(b)) ?? [],
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

  const updateInitialFormValues = useCallback((newValues: Partial<DadosTipificacao>) => {
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

  const formularioValido = (dados: DadosTipificacao) => {
    const erros: Record<string, string> = {}

    if (!dados.processo && dados.tipo_demanda === 'Ofício Judicial') {
      erros.processo = 'Número do processo é obrigatório';
    }

    if (dados.processo && dados.tipo_demanda === 'Ofício Judicial' && cleanTextJustNumbersAllowed(dados.processo).length !== 20) {
      erros.processo = 'Número do processo inválido, verifique se o número está correto';
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
      formBag.setError(campo as keyof DadosTipificacao, { type: 'required', message: mensagem });
    });

    return Object.keys(erros).length === 0;
  };

  const onSubmit = async (dados: DadosTipificacao) => {
    try {
      const formValido = formularioValido(dados);

      if (!formValido) {
        return;
      }

      console.log('Dados do formulário submetidos:', dados);

      const dadosSubmeter = await actions.backend.demanda.submeterTipificacao({
        pk,
        dados,
      });

      const proximaDemanda = dadosSubmeter?.pk;

      if (proximaDemanda) {
        toast.success({
          title: 'Sucesso',
          description: 'Formulário enviado com sucesso.',
        });

        router.push(`/${esteira}/${esteiraTipo}/demanda/${proximaDemanda}`);

        return
      }

      toast.warning({
        title: 'Aviso',
        description: `Não há nova demanda para preenchimento, retornando a "${esteira} ${esteiraTipo}"`,
      });

      router.push(`/${esteira}/${esteiraTipo}`);
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

  const enviarExcecaoOito = async () => {
    try {
      setIsEnviandoExcecao(true);

      await actions.backend.demanda.enviarDemandaExcecaoOito({
        pk, 
        justificativa: justificarEnvioDialogInfo.justificativa.value ?? '',
      });

      toast.success({
        title: 'Sucesso',
        description: 'Formulário enviado com sucesso.',
      });

      router.push(`/${esteira}/${esteiraTipo}`);
    } catch (error: any) {
      toast.error({
        title: 'Erro',
        description: error?.message,
      });
    } finally {
      setIsEnviandoExcecao(false);
    }
  }

  const handleClickSair = async () => {
    await desbloqueiaDemanda();

    router.push(`/${esteira}/${esteiraTipo}`);
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

  const handleClickJustificarEnvio = ({ title, tipo }: OnClickJustificarEnvio) => {
    updateDialogJustificarEnvioInfo({
      tipo,
      title: {
        text: title,
      }
    })

    setDialogJustificarEnvioOpen(true);
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
  title: 'Erro',
  description: error?.message,
});
    } finally {
      setIsJustificandoEnvio(false);
    }
  }

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

  const handleStartProcessUpload = useCallback(() => {
    setIsPausedCountDown(true);
  }, []);

  const handleEndProcessUpload = useCallback(() => {
    setIsPausedCountDown(false);
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
        timeOut: dadosCliente?.time_out?.['Ofício Judicial'],
        tiposDemanda: dadosCliente?.tipo_demanda ?? [],
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
              deadline: moment(dateNow).add(2, 'minutes').toISOString(),
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

                <div className="space-y-2">
                  <Label htmlFor="cliente">Cliente</Label>
                  <Select 
                    {...formBag.register('cliente')} 
                    disabled
                    value={values.cliente}
                    onValueChange={(value) => formBag.setValue('cliente', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {picklist.clientes.map((nome) => (
                        <SelectItem key={nome} value={nome}>
                          {nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tipo_demanda">Tipo da demanda</Label>
                  <Select 
                    {...formBag.register('tipo_demanda')} 
                    value={values.tipo_demanda}
                    onValueChange={(value) => formBag.setValue('tipo_demanda', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Tipo da demanda" />
                    </SelectTrigger>
                    <SelectContent>
                      {dadosCliente.tiposDemanda.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="processo">Número do processo</Label>
                    <FieldMessage.Error.Root>
                      <Input 
                        {...formBag.register('processo')} 
                        id="processo" 
                        placeholder="...número do processo..." 
                        onChange={(e) => {
                          formBag.setValue('processo', maskNumeroProcesso(e.target.value))
                          formBag.clearErrors('processo')
                        }}
                      />
                    <FieldMessage.Error.Text>
                      {formBag.formState.errors.processo?.message}
                    </FieldMessage.Error.Text>
                  </FieldMessage.Error.Root>

                </div>

                <div className="space-y-2">
                  <Label htmlFor="identificacao">Identificação</Label>
                  <Input 
                    id="identificacao" 
                    {...formBag.register('identificacao')} 
                    placeholder="...identificação..." 
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    disabled={isLoadingForm} 
                    onClick={handleClickSair}
                  >
                    Sair
                  </Button>

                  <Button 
                    type="button" 
                    variant="outline" 
                    disabled={isEnviandoExcecao} 
                    onClick={() => handleClickJustificarEnvio({
                      title: 'Justificar envio para exceção oito',
                      tipo: 'enviar-excecao-oito',
                    })}
                  >
                    { isEnviandoExcecao ? 'Enviando...' : 'Enviar para exceção oito' }
                  </Button>

                  <Button 
                    type="submit"
                    disabled={formBag.formState.isSubmitting}
                  >
                    { formBag.formState.isSubmitting ? 'Submetendo...' : 'Submeter' }
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
              variant='outline'
              onClick={handleClickCloseJustificarEnvioDialog}
            >
              Fechar
            </Button>

            <Button 
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