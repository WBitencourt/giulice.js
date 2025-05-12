'use client'

import { useCallback, useEffect, useMemo, useState } from "react";
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Trash2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ProcessInfoForm } from "./ProcessInfoForm";
import Countdown from "@/components/Countdown";
import { toast } from "@/utils/toast";
import { Skeleton } from "@/components/Skeleton2.0";
import { Textarea } from "@/components/ui/textarea";
import { FieldMessage } from "@/components/FieldMessage";
import { maskCpfCnpj, maskNumeroProcesso } from "@/utils/Masks";
import { fileHelper } from "@/utils/File";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { checkIsValidEmail } from "@/utils/Email";
import { Tooltip } from "@/components/Tooltip2.0";
import { checkIsValidCpfCnpj } from "@/utils/CpfCnpj";
import { Checkbox } from "@/components/ui/checkbox";
import { ArquivoDemanda } from "@/actionsV2/backend/interface";

import {
  DadosDemandaOficioJudicial,
  ProcessoInfo,
  FormFile,
  ExcecaoInfo,
  EmailInfo,
  ParteInfo,
  ExequenteInfo,
} from "../../interfaces";

import { DetalhesCadastro } from "@/components/Forms/util/Components/DetalhesCadastro";
import { FileViewer } from "@/components/Forms/util/Components/FileViewer";
import { actions } from "@/actionsV2";

export interface FormOficioJudicialPicPayGroupEsteiraOitoParams {
  id: string;
  esteira: string;
  esteiraTipo: string;
  dadosIniciais: DadosDemandaOficioJudicial;
}

interface FormOficioJudicialPicPayGroupEsteiraOitoProps {
  params: FormOficioJudicialPicPayGroupEsteiraOitoParams;
}

interface DadosClienteForm {
  timeOut: number;
  assuntos: string[];
}

export function FormOficioJudicialPicPayGroupEsteiraOito({ params }: FormOficioJudicialPicPayGroupEsteiraOitoProps) {
  const pk = params.id;
  const esteira = params.esteira;
  const esteiraTipo = params.esteiraTipo;
  const dadosIniciais = params.dadosIniciais;

  const router = useRouter();

  const formBag = useForm<DadosDemandaOficioJudicial>();

  const values = formBag.getValues();

  const [processoInfos, setProcessoInfos] = useState<ProcessoInfo[]>([]);
  const [initialUploadList, setInitialUploadList] = useState<FormFile[] | null>(null);

  const [dadosCliente, setDadosCliente] = useState<DadosClienteForm>({
    timeOut: 5,
    assuntos: [],
  });

  const [excecaoDialogInfo, setExcecaoDialogInfo] = useState<ExcecaoInfo>({
    justificativa: {
      value: '',
      isValid: false,
    }
  });

  const [dialogExequenteInfo, setDialogExequenteInfo] = useState<ExequenteInfo>({
    exequente: {
      value: '',
      isValid: true,
      error: {
        message: '',
      },
    }
  })

  const [dialogEmailInfo, setDialogEmailInfo] = useState<EmailInfo>({
    email: {
      value: '',
      isValid: true,
    }
  })

  const [dialogPartesInfo, setDialogPartesInfo] = useState<ParteInfo>({
    nome: {
      value: '',
      isValid: true,
    },
    documento: {
      value: '',
      isValid: true,
    }
  })

  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isLoadingFileViewer, setIsLoadingFileViewer] = useState(false);
  const [isConsultandoProcesso, setIsConsultandoProcesso] = useState(false);
  const [isPausedCountDown, setIsPausedCountDown] = useState<boolean>(false);
  const [isSavingForm, setIsSavingForm] = useState(false);
  const [isEnviandoExcecao, setIsEnviandoExcecao] = useState(false);
  const [isAddingEmailForm, setIsAddingEmailForm] = useState(false);
  const [isAddingExequenteForm, setIsAddingExequenteForm] = useState(false);
  const [isAddingPartesForm, setIsAddingPartesForm] = useState(false);
  const [isDesvinculandoUsuario, setIsDesvinculandoUsuario] = useState(false);

  const [dialogProcessoOpen, setDialogProcessoOpen] = useState(false);
  const [dialogExcecaoOpen, setDialogExcecaoOpen] = useState(false);
  const [dialogExequenteOpen, setDialogExequenteOpen] = useState(false);
  const [dialogEmailOpen, setDialogEmailOpen] = useState(false);
  const [dialogPartesOpen, setDialogPartesOpen] = useState(false);

  const dateNow = useMemo(() => new Date(), []);

  const formatInitialFormValues = useCallback((values: Partial<DadosDemandaOficioJudicial>) => {
    const tipoDocumento = values?.tipo_documento?.trim() ?? '';

    const formattedValues = {
      ...values,
      tipo_documento: tipoDocumento.length === 0 ? 'Judicial' : tipoDocumento,
    } as DadosDemandaOficioJudicial;

    formattedValues.processo = maskNumeroProcesso(values?.processo);

    return formattedValues;
  }, []);

  const updateDialogExcecaoInfo = (newState: Partial<ExcecaoInfo>) => {
    if (!newState || Object.keys(newState).length === 0) {
      return; // Retorna se newState for null, undefined ou um objeto vazio
    }
  
    setExcecaoDialogInfo((prevState) => {
      if (!prevState) {
        return {
          justificativa: {
            value: '',
            isValid: true,
          }
        }
      }
  
      return {
        ...prevState,
        ...newState, // Atualiza o estado anterior com as novas propriedades
      };
    });
  };

  const updateInitialFormValues = useCallback((newValues: Partial<DadosDemandaOficioJudicial>) => {
    try {
      const oldValues = formBag.getValues();

      const formattedValues = formatInitialFormValues({
        ...oldValues,
        ...newValues,
      });

      formBag.reset(formattedValues);

    } catch (error: any) { 
      toast.error({
        title: 'Falha na atualização',
        description: 'Falha ao atualizar os dados do formulário'
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

  const updateDialogExequenteInfo = (newState: Partial<ExequenteInfo>) => {
    if (!newState || Object.keys(newState).length === 0) {
      return 
    }
  
    setDialogExequenteInfo((prevState) => {
      return {
        ...prevState,
        ...newState,
        exequente: {
          ...prevState.exequente,
          ...newState.exequente,
        },
      };
    });
  };

  const updateDialogEmailInfo = (newState: Partial<EmailInfo>) => {
    if (!newState || Object.keys(newState).length === 0) {
      return 
    }
  
    setDialogEmailInfo((prevState) => {
      return {
        ...prevState,
        ...newState,
        email: {
          ...prevState.email,
          ...newState.email,
        },
      };
    });
  };

  const updateDialogPartesInfo = (newState: Partial<ParteInfo>) => {
    if (!newState || Object.keys(newState).length === 0) {
      return 
    }
  
    setDialogPartesInfo((prevState: ParteInfo) => {
      return {
        ...prevState,
        ...newState,
        nome: {
          ...prevState.nome,
          ...newState.nome,
        },
        documento: {
          ...prevState.documento,
          ...newState.documento,
        }
      };
    });
  }

  const updateDadosCliente = (newDados: Partial<DadosClienteForm>) => {
    if (!newDados) {
      return;
    }

    setDadosCliente((prevState) => {
      if (!prevState) {
        return {
          timeOut: 5,
          assuntos: [],
        }
      }

      return {
        ...prevState,
        ...newDados,
        timeOut: newDados.timeOut ?? 5,
        assuntos: newDados.assuntos ?? [],
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
        title: 'Erro ao processar dados',
        description: error?.message
      });
    }
  }

  const onSubmit = async (dados: DadosDemandaOficioJudicial) => {
    try {
      await saveForm();

      const dadosSubmeter = await actions.backend.demanda.submeterDemanda({ pk, dados });

      const proximaDemanda = dadosSubmeter?.pk;

      if (proximaDemanda) {
        toast.success({
          title: 'Enviado',
          description: 'Formulário enviado com sucesso.'
        });
        
        router.push(`/${esteira}/${esteiraTipo}/demanda/${proximaDemanda}`);

        return
      }

      toast.warning({
        title: 'Sem demandas',
        description: `Não há nova demanda para preenchimento, retornando a "${esteira} ${esteiraTipo}"`
      });

      router.push(`/${esteira}/${esteiraTipo}`);
    } catch (error: any) {
      toast.error({
        title: 'Erro ao processar',
        description: error?.message
      });
    }
  };

  const handleConsultaProcesso = async () => {
    try {
      setIsConsultandoProcesso(true);

      const processo = formBag.getValues('processo');

      if (!processo) {
        throw new Error('Número do processo não informado corretamente.');
      }

      const dadosProcesso = await actions.backend.demanda.consultarDadosProcesso({
        processo,
        pk
      });

      setProcessoInfos(dadosProcesso);
      setDialogProcessoOpen(true);

      toast.success({
        title: 'Consultado',
        description: 'Consulta do processo realizada com sucesso.'
      });
    } catch (error: any) {
      toast.error({
        title: 'Erro na consulta',
        description: error?.message
      });
    } finally {
      setIsConsultandoProcesso(false);
    }
  };

  const handleSelecionarProcesso = async (processoInfo: ProcessoInfo) => {
    try {
      updateInitialFormValues({
        uf: processoInfo.uf,
        tribunal: processoInfo.tribunal,
        comarca: processoInfo.comarca,
        vara: processoInfo.vara,
        foro: processoInfo.foro,
      });

      setDialogProcessoOpen(false);

      toast.success({
        title: 'Selecionado',
        description: 'Processo selecionado com sucesso.'
      });
    } catch (error: any) {
      toast.error({
        title: 'Erro ao selecionar processo',
        description: error?.message
      });
    }
  };

  const handleFinalCountDown = async () => {
    try {
      await saveForm();
      await desbloqueiaDemanda();

      toast.success({
        title: 'Desbloqueada',
        description: 'Tempo limite atingido, demanda desbloqueada'
      });

      router.push(`/${esteira}/${esteiraTipo}`);
    } catch(error: any) {
      toast.error({
        title: 'Erro ao desbloquear a demanda',
        description: error?.message
      });
    }
  }

  const handleClickSalvar = async () => {
    try {
      await saveForm();
    } catch (error: any) { 
      toast.error({
        title: 'Erro ao salvar o formulário',
        description: error?.message
      });
    } finally {
      setIsSavingForm(false);
    }
  }

  const saveForm = async () => {
    try {
      setIsSavingForm(true);

      console.log('Valores do formulário para salvar:', formBag.getValues());

      const response = await actions.backend.demanda.salvarDemanda({
        pk,
        dados: formBag.getValues(),
      });

      toast.success({
        title: 'Salvo',
        description: 'Formulário salvo com sucesso.'
      });
    } catch (error: any) { 
      toast.error({
        title: 'Erro ao salvar o formulário',
        description: error?.message
      });
    } finally {
      setIsSavingForm(false);
    }
  }

  const handleClickEnviarExcecao = () => {
    setDialogExcecaoOpen(true);
  }

  const handleClickConfirmaEnviarExcecao = async () => {
    try {
      setIsEnviandoExcecao(true);

      await saveForm();

      const response = await actions.backend.demanda.enviarDemandaExcecaoOito({
        pk,
        justificativa: excecaoDialogInfo.justificativa.value
      });

      toast.success({
        title: 'Enviado',
        description: 'Formulário enviado com sucesso.'
      });

      router.push(`/${esteira}/${esteiraTipo}`);
    } catch (error: any) {
      toast.error({
        title: 'Erro ao enviar para exceção',
        description: error?.message
      });
    } finally {
      setIsEnviandoExcecao(false);
      setDialogExcecaoOpen(false);
    }
  }

  const handleClickConfirmaAdicionaEmail = async () => {
    try {
      if (!dialogEmailInfo.email.value) {
        return
      }

      setIsAddingEmailForm(true);

      const isValidEmail = checkIsValidEmail(dialogEmailInfo.email.value);

      if (!isValidEmail) {
        updateDialogEmailInfo({
          email: {
            isValid: false,
          }
        });

        return;
      }

      const oldEmails = formBag.getValues('emails') ?? [];

      formBag.setValue('emails', [
        ...oldEmails,
        dialogEmailInfo.email.value,
      ]);

      updateDialogEmailInfo({
        email: {
          value: '',
        }
      });

      setDialogEmailOpen(false);
    } catch (error: any) { 
      toast.error({
        title: 'Erro ao adicionar e-mail',
        description: error?.message
      });
    } finally {
      setIsAddingEmailForm(false);
    }
  }

  const handleClickConfirmaAdicionaExequente = async () => {
    try {
      const newExequente = dialogExequenteInfo.exequente.value

      if (!newExequente) {
        return
      }

      setIsAddingExequenteForm(true);

      const isEmpty = newExequente.trim().length > 0;

      if (!isEmpty) {
        updateDialogExequenteInfo({
          exequente: {
            isValid: false,
            error: {
              message: 'Nome do exequente não informado corretamente.',
            }
          }
        });

        return;
      }

      const alreadyExists = formBag.getValues('exequentes')?.find((exequente) => exequente === newExequente);

      if (alreadyExists) {
        updateDialogExequenteInfo({
          exequente: {
            isValid: false,
            error: {
              message: 'Exequente já adicionado.',
            }
          }
        });

        return;
      }

      const oldExequentes = formBag.getValues('exequentes') ?? [];

      formBag.setValue('exequentes', [
        ...oldExequentes,
        newExequente,
      ]);

      updateDialogExequenteInfo({
        exequente: {
          value: '',
        }
      });

      setDialogExequenteOpen(false);
    } catch (error: any) { 
      toast.error({
        title: 'Erro ao adicionar exequente',
        description: error?.message
      });
    } finally {
      setIsAddingExequenteForm(false);
    }
  }

  const handleClickDeleteEmail = (email: string) => {
    const oldEmails = formBag.getValues('emails') ?? [];

    formBag.setValue('emails', oldEmails.filter((item) => item !== email));
  }

  const handleClickDeleteExequente = (exequente: string) => {
    const oldExequentes = formBag.getValues('exequentes') ?? [];

    formBag.setValue('exequentes', oldExequentes.filter((item) => item !== exequente));
  }

  const handleClickConfirmaAdicionaParte = async () => {
    try {
      setIsAddingPartesForm(true);

      const isValidNome = dialogPartesInfo?.nome?.value && dialogPartesInfo.nome.value.trim().length > 0 ? true : false;
      const isValidDocumento = dialogPartesInfo.documento.value === '000.000.000-00' ? true : checkIsValidCpfCnpj(dialogPartesInfo.documento.value);

      if (!isValidNome || !isValidDocumento) {
        updateDialogPartesInfo({
          nome: {
            isValid: isValidNome,
          }, 
          documento: {
            isValid: isValidDocumento,
          }
        });

        return;
      }

      updateDialogPartesInfo({
        nome: {
          isValid: false,
        }
      });

      const oldPartes = formBag.getValues('partes') ?? [];

      console.log('Partes:', oldPartes);

      formBag.setValue('partes', [
        ...oldPartes,
        {
          nome: dialogPartesInfo.nome.value ?? '',
          documento: dialogPartesInfo.documento.value ?? '',
          relacionamento: false,
          saldo: false,
        }
      ]);

      updateDialogPartesInfo({
        nome: {
          value: '',
          isValid: true,
        },
        documento: {
          value: '',
          isValid: true,
        }
      });

      setDialogPartesOpen(false);
    } catch (error: any) { 
      toast.error({
        title: 'Erro ao adicionar parte',
        description: error?.message
      });
    } finally {
      setIsAddingPartesForm(false);
    }
  }

  const handleClickDeleteParte = (nome: string, documento: string) => {
    const oldPartes = formBag.getValues('partes') ?? [];

    console.log('Partes:', oldPartes);
    console.log('Nome:', nome);
    console.log('Documento:', documento);

    formBag.setValue('partes', oldPartes.filter((item) => !(item.nome === nome && item.documento === documento)));
  }

  const handleClickSair = async () => {
    try {
      setIsDesvinculandoUsuario(true);

      await desbloqueiaDemanda();

      router.push(`/${esteira}/${esteiraTipo}`);
    } catch (error: any) {
      toast.error({
        title: 'Erro ao sair',
        description: error?.message
      });
    }
  }

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

      console.log('Dados do cliente:', dadosCliente);

      updateDadosCliente({
        timeOut: dadosCliente?.time_out?.['Ofício Judicial'] ?? 5,
        assuntos: dadosCliente?.assunto_oficio,
      });

      updateInitialFormValues({
        ...dadosIniciais,
        partes: dadosIniciais?.partes?.map((parte: any) => {
          return {
            nome: parte?.nome,
            documento: maskCpfCnpj(parte?.documento),
            relacionamento: parte?.relacionamento,
            saldo: parte?.saldo,
          }
        }),
      });

      carregarArquivosDemanda(dadosIniciais?.arquivos);
    } catch (error: any) {
      toast.error({
        title: 'Erro ao atualizar dados iniciais',
        description: error?.message
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

                <div className="space-y-2">
                  <Label htmlFor="tipo_documento">Tipo documento</Label>
                  <Input 
                    id="tipo_documento" 
                    {...formBag.register('tipo_documento')} 
                    readOnly 
                    disabled 
                    className="bg-gray-100" 
                  />
                </div>

                <ProcessInfoForm 
                  formBag={formBag}
                  handleConsultaProcesso={handleConsultaProcesso} 
                  isConsultandoProcesso={isConsultandoProcesso}
                />

                <div className="space-y-2">
                  <Label htmlFor="assunto">Assunto</Label>
                  <Select 
                    {...formBag.register('assunto')} 
                    value={values.assunto}
                    onValueChange={(value) => formBag.setValue('assunto', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um assunto" />
                    </SelectTrigger>
                    <SelectContent>
                      {dadosCliente.assuntos.map((assunto) => (
                        <SelectItem key={assunto} value={assunto}>
                          {assunto}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {
                  dadosIniciais.cliente === 'GuiaBolso' ? null: (
                    <Table className='w-full'>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Exequentes</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {
                          values?.exequentes && values.exequentes.length > 0 ? (
                            values?.exequentes?.sort((a, b) => a.localeCompare(b)).map((exequente, index) => (
                              <TableRow key={exequente}>
                                <TableCell className='w-full'>
                                  { exequente }
                                </TableCell>
                                <TableCell className='w-full'>
                                    <Tooltip.Root>
                                    <Tooltip.Trigger>
                                      <Trash2 
                                      className="text-red-500 h-5 w-5 cursor-pointer" 
                                      onClick={() => handleClickDeleteExequente(exequente)}
                                      />
                                    </Tooltip.Trigger>
                                    <Tooltip.Content side='left'>
                                      Excluir
                                    </Tooltip.Content>
                                    </Tooltip.Root>
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <TableRow>
                              <TableCell 
                                colSpan={1}
                                className='text-center'
                              >
                                Nenhuma exequente cadastrado
                              </TableCell>
                            </TableRow>
                          )
                        }

                        <TableRow>
                          <TableCell 
                            colSpan={3} 
                            className='text-center text-green-500 cursor-pointer' 
                            onClick={() => setDialogExequenteOpen(true)}
                          >
                            Adicionar exequente
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  )
                }


                <Table className='w-full'>
                  <TableHeader>
                    <TableRow>
                      <TableHead>E-mail</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      values?.emails && values.emails.length > 0 ? (
                        values?.emails?.sort((a, b) => a.localeCompare(b)).map((email, index) => (
                          <TableRow key={index}>
                            <TableCell className='w-full'>
                              {email}
                            </TableCell>
                            <TableCell className='w-full'>
                                <Tooltip.Root>
                                <Tooltip.Trigger>
                                  <Trash2 
                                  className="text-red-500 h-5 w-5 cursor-pointer" 
                                  onClick={() => handleClickDeleteEmail(email)}
                                  />
                                </Tooltip.Trigger>
                                <Tooltip.Content side='left'>
                                  Excluir
                                </Tooltip.Content>
                                </Tooltip.Root>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell 
                            colSpan={1}
                            className='text-center'
                          >
                            Nenhuma e-mail cadastrado
                          </TableCell>
                        </TableRow>
                      )
                    }

                    <TableRow>
                      <TableCell 
                        colSpan={3} 
                        className='text-center text-green-500 cursor-pointer' 
                        onClick={() => setDialogEmailOpen(true)}
                      >
                        Adicionar e-mail
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <Table className='w-full'>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Documento</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      values?.partes && values.partes.length > 0 ? (
                        values?.partes?.sort((a, b) => a.nome.localeCompare(b.nome)).map((parte, index) => (
                          <TableRow key={index}>
                            <TableCell className='w-full'>
                              { parte.nome }
                            </TableCell>
                            <TableCell className="text-nowrap">
                              { parte.documento }
                            </TableCell>
                            <TableCell className='w-full'>
                              <Tooltip.Root>
                                <Tooltip.Trigger>
                                  <Trash2 
                                  className="text-red-500 h-5 w-5 cursor-pointer" 
                                  onClick={() => handleClickDeleteParte(parte.nome, parte.documento)}
                                  />
                                </Tooltip.Trigger>
                                <Tooltip.Content side='left'>
                                  Excluir
                                </Tooltip.Content>
                              </Tooltip.Root>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell 
                            colSpan={3}
                            className='text-center'
                          >
                            Nenhuma parte cadastrada
                          </TableCell>
                        </TableRow>
                      )
                    }

                    <TableRow>
                      <TableCell 
                        colSpan={2} 
                        className='text-center text-green-500 cursor-pointer' 
                        onClick={() => setDialogPartesOpen(true)}
                      >
                        Adicionar parte
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

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
                    disabled={isEnviandoExcecao} 
                    onClick={handleClickEnviarExcecao}
                  >
                    { isEnviandoExcecao ? 'Enviando...' : 'Enviar para exceção oito' }
                  </Button>

                  <Button 
                    type="button" 
                    variant="outline" 
                    disabled={isSavingForm} 
                    onClick={handleClickSalvar}
                  >
                    { isSavingForm ? 'Salvando...' : 'Salvar' }
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
        open={dialogExequenteOpen}
        onOpenChange={setDialogExequenteOpen}
      >
        <DialogContent 
          aria-describedby='dialog-exequente'
          className="flex flex-col gap-4"
        >
          <DialogHeader>
            <DialogTitle>Adicionar exequente</DialogTitle>
          </DialogHeader>

          <FieldMessage.Error.Root>  
            <div className="space-y-2">
              <Label htmlFor="new-exequente">Exequente</Label>
              <Input 
                id="new-exequente" 
                placeholder="" 
                onChange={(event) => updateDialogExequenteInfo({ 
                  exequente: {
                    value: event.target.value,
                    isValid: true,
                  }
                })}
                value={dialogExequenteInfo.exequente.value} 
              />
            </div>
            <FieldMessage.Error.Text   
              visible={!dialogExequenteInfo.exequente.isValid}
            >
              { dialogExequenteInfo.exequente.error?.message }
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root >

          <DialogFooter>
            <Button 
              onClick={() => setDialogExequenteOpen(false)}
            >
              Cancelar
            </Button>

            <Button 
              disabled={!dialogExequenteInfo.exequente.isValid}
              onClick={handleClickConfirmaAdicionaExequente}
            >
              { isAddingExequenteForm ? 'Adicionando...' : 'Adicionar' }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogEmailOpen}
        onOpenChange={setDialogEmailOpen}
      >
        <DialogContent 
          aria-describedby='dialog-email'
          className="flex flex-col gap-4"
        >
          <DialogHeader>
            <DialogTitle>Adicionar e-mail</DialogTitle>
          </DialogHeader>

          <FieldMessage.Error.Root>  
            <div className="space-y-2">
              <Label htmlFor="new-email">E-mail</Label>
              <Input 
                id="new-email" 
                placeholder="Digite um e-mail válido..." 
                onChange={(event) => updateDialogEmailInfo({ 
                  email: {
                    value: event.target.value,
                    isValid: true,
                  }
                })}
                value={dialogEmailInfo.email.value} 
              />
            </div>
            <FieldMessage.Error.Text   
              visible={!dialogEmailInfo.email.isValid}
            >
              E-mail inválido
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root >

          <DialogFooter>
            <Button 
              onClick={() => setDialogEmailOpen(false)}
            >
              Cancelar
            </Button>

            <Button 
              disabled={!dialogEmailInfo.email.isValid}
              onClick={handleClickConfirmaAdicionaEmail}
            >
              { isAddingEmailForm ? 'Adicionando...' : 'Adicionar' }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogPartesOpen}
        onOpenChange={setDialogPartesOpen}
      >
        <DialogContent 
          aria-describedby='dialog-partes'
          className="flex flex-col gap-4"
        >
          <DialogHeader>
            <DialogTitle>Adicionar partes</DialogTitle>
          </DialogHeader>

          <FieldMessage.Error.Root>  
            <div className="space-y-2">
              <Label htmlFor="new-parte-nome">Nome</Label>
              <Input 
                id="new-parte-nome" 
                placeholder="Digite o nome da parte..." 
                onChange={(event) => updateDialogPartesInfo({ 
                  nome: {
                    value: event.target.value,
                    isValid: true,
                  },
                })}
                value={dialogPartesInfo.nome.value} 
              />
            </div>
            <FieldMessage.Error.Text   
              visible={!dialogPartesInfo.nome.isValid}
            >
              Nome inválido
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root >

          <FieldMessage.Error.Root>  
            <div className="space-y-2">
              <Label htmlFor="new-parte-documento">Documento</Label>
              <Input 
                id="new-parte-documento" 
                placeholder="Digite o documento da parte..." 
                disabled={dialogPartesInfo.documento.value === '000.000.000-00'}
                onChange={(event) => updateDialogPartesInfo({ 
                  documento: {
                    value: maskCpfCnpj(event.target.value),
                    isValid: true,
                  },
                })}
                value={dialogPartesInfo.documento.value} 
              />
            </div>
            <div className="flex gap-2 items-center py-2">
              <Checkbox
                id="new-parte-sem-documento" 
                checked={dialogPartesInfo.documento.value === '000.000.000-00'}
                onCheckedChange={(checked) => updateDialogPartesInfo({ 
                  documento: {
                    value: checked ? '000.000.000-00' : '',
                    isValid: true,
                  },
                })}
              />
              <Label htmlFor="new-parte-sem-documento">Parte sem documento?</Label>
            </div>
            <FieldMessage.Error.Text   
              visible={!dialogPartesInfo.documento.isValid}
            >
              Documento inválido
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root >

          <DialogFooter>
            <Button 
              onClick={() => setDialogPartesOpen(false)}
            >
              Cancelar
            </Button>

            <Button 
              disabled={!dialogPartesInfo.nome.isValid || !dialogPartesInfo.documento.isValid}
              onClick={handleClickConfirmaAdicionaParte}
            >
              { isAddingPartesForm ? 'Adicionando...' : 'Adicionar' }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogProcessoOpen}
        onOpenChange={setDialogProcessoOpen}
      >
        <DialogContent 
          aria-describedby='dialog-processo'
          className="max-h-[90vh] max-w-[90vw] overflow-auto"
        >
          <DialogHeader>
            <DialogTitle>Informações do Processo</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Selecionar</TableHead>
                <TableHead>UF</TableHead>
                <TableHead>Tribunal</TableHead>
                <TableHead>Comarca</TableHead>
                <TableHead>Vara</TableHead>
                <TableHead>Foro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processoInfos.map((info, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Button onClick={() => handleSelecionarProcesso(info)}>Selecionar</Button>
                  </TableCell>
                  <TableCell>{info.uf}</TableCell>
                  <TableCell>{info.tribunal}</TableCell>
                  <TableCell>{info.comarca}</TableCell>
                  <TableCell>{info.vara}</TableCell>
                  <TableCell>{info.foro}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogExcecaoOpen}
        onOpenChange={setDialogExcecaoOpen}
      >
        <DialogContent 
          aria-describedby='dialog-excecao'
          className="flex flex-col gap-4"
        >
          <DialogHeader>
            <DialogTitle>Enviar demanda para exceção</DialogTitle>
          </DialogHeader>

          <p>Para enviar a demanda para a exceção é necessário uma justificativa</p>

          <FieldMessage.Error.Root>  
            <Textarea 
              id="justificativa" 
              rows={6} 
              className="bg-white dark:bg-black"
              onChange={(event) => updateDialogExcecaoInfo({ 
                justificativa: {
                  value: event.target.value,
                  isValid: event.target.value.length >= 10,
                }
              })}
              value={excecaoDialogInfo.justificativa.value} 
            />
            <FieldMessage.Error.Text   
              visible={!excecaoDialogInfo.justificativa.isValid}
            >
              A justificativa deve conter no mínimo 10 caracteres
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root >

          <DialogFooter>
            <Button 
              onClick={() => setDialogExcecaoOpen(false)}
            >
              Cancelar
            </Button>

            <Button 
              disabled={!excecaoDialogInfo.justificativa.isValid}
              onClick={handleClickConfirmaEnviarExcecao}
            >
              { isEnviandoExcecao ? 'Submetendo...' : 'Submeter' }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}