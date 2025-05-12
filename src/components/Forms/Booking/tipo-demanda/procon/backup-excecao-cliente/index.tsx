'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useShallow } from 'zustand/shallow';
import { useResourcesStore } from '@/zustand-store/resources';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Upload } from '@/components/Upload2.0';
import * as Icon from '@phosphor-icons/react';
import { PDFViewer } from '@/components/PDFViewer';
import { FileItem, UpdateFile, UploadRootHandles } from '@/components/Upload2.0/contexts';
import Countdown from '@/components/Countdown';
import { Skeleton } from '@/components/Skeleton2.0';
import { useAuthStore } from '@/zustand-store/auth.store';
import { convertBRLCurrencyToNumber } from '@/utils/String';
import { Textarea } from '@/components/ui/textarea';
import { FieldMessage } from '@/components/FieldMessage';
import { util } from '@/utils';
import { fileHelper } from '@/utils/File';
import { ArquivoDemanda } from '@/actions/backend/interface';
import { toast } from '@/utils/toast';
import { getDadosCliente as getDadosClienteAction } from '@/actions/backend/cliente';

import {
  DemandaProcon,
  OnUploadErrorProps,
  ProcessoInfo,
  FormFile,
  OnDropAccepted,
  OnDropRejected,
  OnProcessUpdateProps,
  ProcessUploadErrorProps,
  OnUploadProgressProps,
  HandleClickDeleteFileProps,
  HandleClickRetryUploadProps,
  ObservacaoInfo,
  JustificativaInfo,
  Autor,
  Reu,
  TipoJustificativaInfo,
} from '../../interfaces';

import {
  adicionaObservacaoDemanda,
  enviarDemandaExcecaoOito,
  getDadosDemandaEsteiraOito,
  submeterDemanda,
  salvarDemanda,
  desbloqueiaUsuarioDemanda,
  consultarDadosProcesso,
  selecionaDadoProcesso,
  enviarDemandaEsteiraOito,
} from '@/actions/backend/demanda';

import { getDadosAutor, enviarDesdobramentoProcesso } from '@/actions/backend/cliente/return';

import {
  AlertTriangle,
  Briefcase,
  FileSignature,
  FileText,
  GitBranch,
  List,
  Mail,
  Phone,
  Plus,
  Search,
  Trash2,
  User,
  Users,
  X,
} from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { picklist } from '../../../picklists';
import { DatePicker } from '@/components/ui/date-picker';
import { maskCpfCnpj, maskEmail, maskCurrencyBRL, maskPhone } from '@/utils/Masks';
import { DadosProcesso } from '@/actions/backend/demanda/service';
import { Input } from '@/components/ui/input';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { getCidadesPorUf } from '@/actions/local';
import { aprovarDemanda, reprovarDemanda } from '@/actions/backend/auditoria';
import { DetalhesCadastro } from '@/components/Forms/util/Components/DetalhesCadastro';

interface CadastroJuridicoReturnParams {
  id: string;
  esteira: string;
  esteiraTipo: string;
  dadosIniciais: DemandaProcon;
}

interface FormProconBookingExcecaoClienteProps {
  params: CadastroJuridicoReturnParams;
}

interface OpcoesProcesso {
  uf: string[];
  orgao_tribunal: string[];
  cidade: string[];
  vara: string[];
  foro: string[];
}

interface DadosClienteForm {
  timeOut: number;
}

interface HandleChangeTipoArquivoProps {
  file: FormFile;
  value: string;
  updateFile: UpdateFile<FormFile>;
}

interface OnClickJustificarEnvio {
  tipo: TipoJustificativaInfo;
  title: string;
}

const sortListFiles = (a: FormFile, b: FormFile) => {
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

export function FormProconBookingExcecaoCliente({ params }: FormProconBookingExcecaoClienteProps) {
  const pk = params.id;
  const esteira = params.esteira;
  const esteiraTipo = params.esteiraTipo;
  const dadosIniciais = params.dadosIniciais;

  const router = useRouter();
  const searchParams = useSearchParams();

  const { user } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
    }))
  );

  const { arquivo } = useResourcesStore(
    useShallow((state) => ({
      arquivo: state.arquivo,
    }))
  );

  const uploadRef = useRef<UploadRootHandles<FormFile>>(null);

  const formBag = useForm<DemandaProcon>({
    defaultValues: {
      observacao: [],
      tipificacao: '',
      uf: '',
      cidade: '',
      identificacao: '',
      objeto: '',
      resumo_processo: '',
      causa_raiz: '',
      sub_causa_raiz: '',
      lista_autores: [],
      lista_reus: [],
      data_audiencia: '',
      data_defesa: '',
    },
  });

  const values = formBag.watch();

  const [dadosProcesso, setDadosProcesso] = useState<ProcessoInfo[]>([]);
  const [uploadList, setInitialUploadList] = useState<FormFile[]>([]);

  const [fileViewer, setFileViewer] = useState({
    url: '',
    name: '',
    s3Key: '',
    s3Bucket: '',
  });

  const [pedidos, setPedidos] = useState({
    descricao: '',
    valor: maskCurrencyBRL('0'),
  });

  const [autor, setAutor] = useState({
    nome: '',
    documento: '',
    email: '',
    telefone: '',
  });

  const [reu, setReu] = useState({
    nome: '',
    documento: '',
  });

  const [opcoesProcesso, setOpcoesProcesso] = useState<OpcoesProcesso>({
    uf: [],
    orgao_tribunal: [],
    cidade: [],
    vara: [],
    foro: [],
  });

  const [dialogObservacaoInfo, setDialogObservacaoInfo] = useState<ObservacaoInfo>({
    observacao: {
      value: '',
      isValid: false,
    },
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

  const [dadosCliente, setDadosCliente] = useState<DadosClienteForm>({
    timeOut: 5,
  });

  const dicionarioRelacionadoVoos = ['Flight'];

  const [isLoadingForm, setIsLoadingForm] = useState(true);
  const [isLoadingFileViewer, setIsLoadingFileViewer] = useState(true);
  const [isConsultandoAutor, setIsConsultandoAutor] = useState(false);
  const [isConsultandoProcesso, setIsConsultandoProcesso] = useState(false);
  const [isOpenUploadList, setIsOpenUploadList] = useState<boolean>(false);
  const [isPausedCountDown, setIsPausedCountDown] = useState<boolean>(false);
  const [isSavingForm, setIsSavingForm] = useState(false);
  const [isAddingObsForm, setIsAddingObsForm] = useState(false);
  const [isUploadLimitReached, setIsUploadLimitReached] = useState(false);
  const [isEnviandoDesdobramento, setIsEnviandoDesdobramento] = useState(false);
  const [isEnviandoExcecao, setIsEnviandoExcecao] = useState(false);
  const [isEnviandoProximaEtapa, setIsEnviandoProximaEtapa] = useState(false);
  const [isAprovandoForm, setIsAprovandoForm] = useState(false);
  const [isReprovandoForm, setIsReprovandoForm] = useState(false);
  const [isJustificandoEnvio, setIsJustificandoEnvio] = useState(false);
  const [isDesvinculandoUsuario, setIsDesvinculandoUsuario] = useState(false);
  const [isEnviandoEsteiraOito, setIsEnviandoEsteiraOito] = useState(false);

  const [dialogProcessoOpen, setDialogProcessoOpen] = useState(false);
  const [dialogObservacaoOpen, setDialogObservacaoOpen] = useState(false);
  const [dialogEnviarDesdobramentoOpen, setDialogEnviarDesdobramentoOpen] = useState(false);
  const [dialogJustificarEnvioOpen, setDialogJustificarEnvioOpen] = useState(false);

  const dateNow = useMemo(() => new Date(), []);

  const dicionarioPalavrasRelacionadaVoos = ['Flight'];

  const formatInitialFormValues = useCallback((values: Partial<DemandaProcon>) => {
    const formattedValues = {
      ...values,
    } as DemandaProcon;

    formattedValues.lista_autores = values?.lista_autores
      ? values?.lista_autores.map((item) => {
          return {
            id: item?.id ?? uuid(),
            nome: item?.nome,
            documento: item?.documento,
            email: item?.email,
            telefone: item?.telefone,
          };
        })
      : [];
    formattedValues.lista_reus = values?.lista_reus
      ? values?.lista_reus.map((item) => {
          return {
            id: item?.id ?? uuid(),
            nome: item?.nome,
            documento: item?.documento,
          };
        })
      : [];

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
        };
      }

      return {
        ...prevState,
        ...newDados,
        timeOut: newDados.timeOut ?? 5,
      };
    });
  };

  const updatePedidos = useCallback((pedido: Partial<{ descricao: string; valor: string }>) => {
    setPedidos((state) => ({
      ...state,
      ...pedido,
      valor: pedido.valor ? maskCurrencyBRL(pedido.valor) : state.valor,
    }));
  }, []);

  const updateInputAutor = useCallback((autor: Partial<Autor>) => {
    setAutor((state) => ({
      ...state,
      ...autor,
    }));
  }, []);

  const updateInputReu = useCallback((reu: Partial<Reu>) => {
    setReu((state) => ({
      ...state,
      ...reu,
    }));
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

  const updateDialogObservacaoInfo = (newState: Partial<ObservacaoInfo>) => {
    if (!newState || Object.keys(newState).length === 0) {
      return; // Retorna se newState for null, undefined ou um objeto vazio
    }

    setDialogObservacaoInfo((prevState) => {
      if (!prevState) {
        return {
          observacao: {
            value: '',
            isValid: true,
          },
        };
      }

      return {
        ...prevState,
        ...newState,
      };
    });
  };

  const carregarArquivosDemanda = useCallback(async (files: ArquivoDemanda[] | undefined) => {
    try {
      const uploadList = await Promise.all(
        files?.map(async (file, index) => {
          try {
            const urlFile = await arquivo.getFileUrlFromS3({
              s3Key: file.s3key,
              s3Bucket: file.s3Bucket,
            });

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
                url: urlFile,
                tipo: file?.tipo ?? '',
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
                tipo: file?.tipo ?? '',
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
        }) || []
      );

      //console.log('Lista de arquivos carregados:', uploadList);

      const firstItemUploadConfigList = uploadList.find((item) => !!item.info.url);

      setInitialUploadList(uploadList);
      setFileViewer({
        url: firstItemUploadConfigList?.info.url ?? '',
        name: firstItemUploadConfigList?.info.name ?? '',
        s3Key: firstItemUploadConfigList?.info.s3Key ?? '',
        s3Bucket: firstItemUploadConfigList?.info.s3Bucket ?? '',
      });

      const totalFilesSizeInBytes = uploadList.reduce(
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
          title: 'Aviso!',
          description: 'Limite total de 20MB de arquivos atingido.',
        });
      }
    } catch (error: any) {
      toast.error({
        title: 'Falha ao carregar o arquivo',
        description: error?.message,
      });
    } finally {
      setIsLoadingFileViewer(false);
    }
  }, []);

  const updateInitialFormValues = useCallback(
    (newValues: Partial<DemandaProcon>) => {
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
    },
    [formatInitialFormValues, formBag.getValues, formBag.reset]
  );

  const updateOpcoesProcesso = useCallback((novosDados: Partial<OpcoesProcesso>) => {
    setOpcoesProcesso((prevState) => {
      return {
        ...prevState,
        ...novosDados,
      };
    });
  }, []);

  const desbloqueiaDemanda = async () => {
    try {
      await desbloqueiaUsuarioDemanda({ pk });
    } catch (error: any) {
      throw new Error(error?.message);
    }
  };

  const pushBack = () => {
    const urlQuery = searchParams.toString() ?? '';

    router.push(`/${esteira}/${esteiraTipo}?${urlQuery}`);
  };

  const onSubmit = async (dados: DemandaProcon) => {
    try {
      console.log('Dados do formulário:', dados);
      setIsAprovandoForm(true);

      const response = await aprovarDemanda({ pk, dados });

      util.actions.checkHaveError(response?.data);

      toast.success({
        title: 'Aprovado',
        description: 'Formulário aprovado com sucesso',
      });

      pushBack();
    } catch (error: any) {
      toast.error({
        title: 'Falha ao aprovar o formulário',
        description: error?.message,
      });
    } finally {
      setIsAprovandoForm(false);
    }
  };

  const consultarProcesso = async (): Promise<DadosProcesso[]> => {
    try {
      setIsConsultandoProcesso(true);

      const processo = formBag.getValues('identificacao');

      if (!processo) {
        throw new Error('Número do processo não informado corretamente.');
      }

      const response = await consultarDadosProcesso({
        processo,
        pk,
      });

      const dadosProcesso = util.actions.convertResponseActionData(response?.data) ?? [];

      return dadosProcesso;
    } catch (error: any) {
      toast.error({
        title: 'Falha ao consultar o processo',
        description: error?.message,
      });
      return [];
    } finally {
      setIsConsultandoProcesso(false);
    }
  };

  const getDadosCliente = async () => {
    try {
      const cliente = dadosIniciais?.cliente;

      if (!cliente) {
        throw new Error('Cliente não informado corretamente.');
      }

      const response = await getDadosClienteAction({
        cliente: cliente,
      });

      const dadosCliente = util.actions.convertResponseActionData(response?.data) ?? undefined;

      return dadosCliente;
    } catch (error: any) {
      toast.error({
        title: 'Falha ao consultar os dados do cliente',
        description: error?.message,
      });
    }
  };

  const handleConsultaProcesso = async () => {
    try {
      const dadosProcesso = await consultarProcesso();

      const dadosProcessoFormatted = dadosProcesso.map((item) => {
        return {
          ...item,
          uf: item.uf ? item.uf : '',
          tribunal: item.tribunal ? item.tribunal : '',
          comarca: item.comarca ? item.comarca : '',
          vara: item.vara ? item.vara : '',
          foro: item.foro ? item.foro : '',
        };
      });

      setDadosProcesso(dadosProcessoFormatted);

      formBag.setValue('cidade', '');

      toast.success({
        title: 'Consulta',
        description: 'Consulta do processo realizada com sucesso.',
      });
    } catch (error: any) {
      toast.error({
        title: 'Falha ao consultar o processo',
        description: error?.message,
      });
    } finally {
      setIsConsultandoProcesso(false);
    }
  };

  const handleSelecionarProcesso = async (processoInfo: ProcessoInfo) => {
    // try {
    //   if (!user?.email) {
    //     throw new Error('E-mail do usuário não carregado na autenticação corretamente');
    //   }
    //   const response = await selecionaDadoProcesso({
    //     dado: processoInfo,
    //     pk,
    //   });
    //   util.actions.checkHaveError(response?.data);
    //   updateInitialFormValues({
    //     uf: processoInfo.uf,
    //     orgao_tribunal: processoInfo.orgao_tribunal,
    //     cidade: processoInfo.cidade,
    //     vara: processoInfo.vara,
    //     foro: processoInfo.foro,
    //   });
    //   setDialogProcessoOpen(false);
    //   toast.success({
    //     title: 'Sucesso!',
    //     description: 'Processo selecionado com sucesso.',
    //   });
    // } catch (error: any) {
    //   toast.error({
    //     title: 'Falha ao selecionar o processo',
    //     description: error?.message,
    //   });
    // }
  };

  const handleClickFile = (file: FormFile) => {
    setFileViewer({
      url: file.info.url,
      name: file.info.name,
      s3Key: file.info.s3Key,
      s3Bucket: file.info.s3Bucket,
    });
  };

  const onUploadError = ({ file, message }: OnUploadErrorProps) => {
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

  const onUploadProgress = ({ file, event, updateFile }: OnUploadProgressProps) => {
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

  const processUploadError = ({ file, updateFile, message }: ProcessUploadErrorProps) => {
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

  const handleOnDropAccepted = ({ files, uploadFiles }: OnDropAccepted) => {
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

  const handleOnDropRejected = ({ files, uploadFiles }: OnDropRejected) => {
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

  const handleProcessUpload = async ({ file, updateFile }: OnProcessUpdateProps) => {
    try {
      setIsPausedCountDown(true);

      if (file.status.success === false) {
        return onUploadError({ file });
      }

      const currentList = uploadRef.current?.list ?? [];

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

      const arquivosForm = formBag.getValues('arquivos') ?? [];

      updateInitialFormValues({
        arquivos: [
          ...arquivosForm,
          {
            s3key: submittedFile?.s3Key,
            s3Bucket: submittedFile?.s3Bucket,
            file_name: submittedFile?.fileName,
            file_size: submittedFile?.fileSize,
            sk: submittedFile?.sk,
            tipo: submittedFile?.tipo,
            file_unit: 'MB',
          },
        ],
      });
    } catch (error: any) {
      processUploadError({
        file,
        updateFile,
        message: error?.message,
      });

      toast.error({
        title: 'Falha ao enviar o arquivo',
        description: error?.message,
      });
    } finally {
      setIsPausedCountDown(false);
    }
  };

  const handleClickDeleteFile = async ({ file, removeFile, updateFile }: HandleClickDeleteFileProps) => {
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
        name: '',
        s3Key: '',
        s3Bucket: '',
      });

      const arquivosForm = formBag.getValues('arquivos') ?? [];

      const newArquivos = arquivosForm.filter((arquivo) => arquivo.sk !== file.id);

      formBag.setValue('arquivos', newArquivos);
    } catch (error: any) {
      toast.error({
        title: 'Falha ao excluir o arquivo',
        description: error?.message,
      });
    } finally {
      updateFile(file.id, {
        newFile: { ...file, status: { ...file.status, isDeleting: false } },
      });
    }
  };

  const handleClickRetryUpload = async ({ file, retryUpload }: HandleClickRetryUploadProps) => {
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

  const handleFinalCountDown = async () => {
    try {
      await saveForm();
      await desbloqueiaDemanda();

      toast.info({
        title: 'Tempo',
        description: 'Tempo limite atingido, demanda desbloqueada',
      });

      router.push(`/${esteira}/${esteiraTipo}`);
    } catch (error: any) {
      toast.error({
        title: 'Falha ao desbloquear a demanda',
        description: error?.message,
      });
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

  const saveForm = async () => {
    try {
      setIsSavingForm(true);

      const dados = {
        ...formBag.getValues(),
      };

      console.log('Valores do formulário para salvar:', dados);

      const response = await salvarDemanda({
        pk,
        dados,
      });

      util.actions.checkHaveError(response?.data);

      toast.success({
        title: 'Salvo',
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

  const adicionaObservacao = async () => {
    try {
      setIsAddingObsForm(true);

      if (!user?.email) {
        throw new Error('E-mail do usuário não carregado na autenticação corretamente');
      }

      const response = await adicionaObservacaoDemanda({
        pk,
        observacao: dialogObservacaoInfo.observacao.value,
        userEmail: user?.email,
      });

      util.actions.checkHaveError(response?.data);

      const oldObservacoes = formBag.getValues('observacao') ?? [];

      updateInitialFormValues({
        observacao: [
          ...oldObservacoes,
          {
            mensagem: dialogObservacaoInfo.observacao.value,
            criada_por: user?.email,
            criada_em: dateNow.toISOString(),
          },
        ],
      });

      toast.success({
        title: 'Observação',
        description: 'Observação adicionada com sucesso.',
      });
    } catch (error: any) {
      toast.error({
        title: 'Falha ao adicionar observação',
        description: error?.message,
      });
    } finally {
      setIsAddingObsForm(false);
    }
  };

  const enviarExcecaoOito = async () => {
    try {
      const response = await enviarDemandaExcecaoOito({
        pk,
        justificativa: justificarEnvioDialogInfo.justificativa.value ?? '',
      });

      util.actions.checkHaveError(response?.data);

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

  const handleClickCloseJustificarEnvioDialog = () => {
    updateDialogJustificarEnvioInfo({
      justificativa: {
        value: '',
        isValid: true,
      },
    });

    setDialogJustificarEnvioOpen(false);
  };

  const reprovar = async () => {
    try {
      setIsReprovandoForm(true);

      const response = await reprovarDemanda({
        pk,
        justificativa: justificarEnvioDialogInfo.justificativa.value ?? '',
      });

      util.actions.checkHaveError(response?.data);

      router.push(`/${esteira}/${esteiraTipo}`);

      toast.success({
        title: 'Reprovado',
        description: 'Formulário reprovado com sucesso.',
      });
    } catch (error: any) {
      toast.error({
        title: 'Falha ao reprovar o formulário',
        description: error?.message,
      });
    } finally {
      setIsReprovandoForm(false);
    }
  };

  const enviarEsteiraOito = async () => {
    try {
      setIsEnviandoEsteiraOito(true);

      const response = await enviarDemandaEsteiraOito({
        pk,
        justificativa: justificarEnvioDialogInfo.justificativa.value ?? '',
      });

      util.actions.checkHaveError(response?.data);

      toast.success({
        title: 'Enviado',
        description: 'Demanda enviada para esteira oito com sucesso',
      });
    } catch (error: any) {
      toast.error({
        title: '',
        description: error?.message,
      });
    } finally {
      setIsEnviandoEsteiraOito(false);
    }
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
        case 'reprovar-demanda':
          await reprovar();
          break;

        case 'enviar-excecao-oito':
          await enviarExcecaoOito();
          break;

        case 'enviar-esteira-oito':
          await enviarEsteiraOito();
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

  const handleClickEnviarExcecao = () => {
    setDialogJustificarEnvioOpen(true);

    updateDialogJustificarEnvioInfo({
      tipo: 'enviar-excecao-oito',
      title: {
        text: 'Justificar envio para exceção',
      },
    });
  };

  const handleConfirmaEnviarDesdobramento = async () => {
    try {
      setIsEnviandoDesdobramento(true);

      if (!user?.email) {
        throw new Error('E-mail do usuário não carregado na autenticação corretamente');
      }

      console.log('Valores do formulário para desdobramento:', formBag.getValues());

      const response = await enviarDesdobramentoProcesso({
        dados: formBag.getValues(),
      });

      util.actions.checkHaveError(response?.data);

      toast.success({
        title: 'Desdobramento',
        description: 'Desdobramento alterado com sucesso.',
      });

      router.push(`/${esteira}/${esteiraTipo}/demanda/${pk}`);
    } catch (error: any) {
      toast.error({
        title: 'Falha ao enviar o desdobramento',
        description: error?.message,
      });
    } finally {
      setIsEnviandoDesdobramento(false);
      setDialogEnviarDesdobramentoOpen(false);
    }
  };

  const handleClickAdicionaObservacao = () => {
    setDialogObservacaoOpen(true);
  };

  const handleClickConfirmaAdicionaObservacao = async () => {
    try {
      setIsAddingObsForm(true);

      if (!user?.email) {
        throw new Error('E-mail do usuário não carregado na autenticação corretamente');
      }

      await adicionaObservacao();
    } catch (error: any) {
      toast.error({
        title: 'Falha ao adicionar observação',
        description: error?.message,
      });
    } finally {
      setIsAddingObsForm(false);
      setDialogObservacaoOpen(false);
    }
  };

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
  };

  const updateCidadesPorUf = async (uf: string) => {
    if (!uf) {
      return;
    }

    const response = await getCidadesPorUf({ uf });
    const cidades = util.actions.convertResponseActionData(response?.data) ?? [];

    updateOpcoesProcesso({ cidade: cidades });
  };

  const handleUfChange = (newValue: string) => {
    const novaUf = newValue;

    formBag.setValue('uf', novaUf);

    updateCidadesPorUf(novaUf);

    formBag.setValue('cidade', '');
  };

  const handleCausaRaizChange = (value: string) => {
    formBag.setValue('causa_raiz', value);

    if (!dicionarioRelacionadoVoos.includes(value)) {
      formBag.setValue('sub_causa_raiz', '');
    }
  };

  const handleAdicionarAutor = () => {
    const nome = autor.nome;
    const documento = autor.documento;
    const email = autor.email;
    const telefone = autor.telefone;

    const lista_autores = formBag.getValues('lista_autores') ?? [];

    if (!nome || !documento) {
      toast.warning({
        title: 'Aviso!',
        description: 'Por favor, preencha pelo menos o nome e documento do autor.',
      });
      return;
    }

    const novoAutor: Autor = {
      id: uuid(),
      nome,
      documento,
      email: email ?? '',
      telefone: telefone ?? '',
    };

    formBag.setValue('lista_autores', [...lista_autores, novoAutor]);

    // Limpar os campos após adicionar
    updateInputAutor({
      nome: '',
      documento: '',
      email: '',
      telefone: '',
    });
  };

  const handleRemoverAutor = (id: string) => {
    // const lista_autores = formBag.getValues('lista_autores') ?? [];
    // const novaLista = [...lista_autores];

    // novaLista.splice(index, 1);
    // formBag.setValue('lista_autores', novaLista);

    const lista_autores = formBag.getValues('lista_autores');

    const novaLista = lista_autores?.filter((prevAutor, index) => prevAutor.id !== id);

    formBag.setValue('lista_autores', novaLista);
  };

  const handleAdicionarReu = () => {
    const nome = reu.nome;
    const documento = reu.documento;

    const lista_reus = formBag.getValues('lista_reus') ?? [];

    if (!nome || !documento) {
      toast.warning({
        title: 'Aviso!',
        description: 'Por favor, preencha o nome e documento do réu.',
      });
      return;
    }

    const novoReu: Reu = {
      id: uuid(),
      nome,
      documento,
    };

    formBag.setValue('lista_reus', [...lista_reus, novoReu]);

    // Limpar os campos após adicionar
    updateInputReu({
      nome: '',
      documento: '',
    });
  };

  const handleRemoverReu = (id: string) => {
    // const lista_reus = formBag.getValues('lista_reus') ?? [];
    // const novaLista = [...lista_reus];

    // novaLista.splice(index, 1);
    // formBag.setValue('lista_reus', novaLista);

    const lista_reus = formBag.getValues('lista_reus');

    const novaLista = lista_reus?.filter((prevReu, index) => prevReu.id !== id);

    formBag.setValue('lista_reus', novaLista);
  };

  const handleChangeTipoArquivo = ({ file, updateFile, value }: HandleChangeTipoArquivoProps) => {
    console.log('Processo: Tipo do arquivo:', file);

    const newFile: FormFile = {
      ...file,
      info: {
        ...file.info,
        tipo: value,
      },
    };

    updateFile(file.id, {
      newFile,
    });

    const arquivosForm = formBag.getValues('arquivos') ?? [];

    const newArquivos = arquivosForm.map((arquivo) => {
      if (arquivo.sk === file.id) {
        return {
          ...arquivo,
          tipo: value,
        };
      }

      return arquivo;
    });

    formBag.setValue('arquivos', newArquivos);
  };

  const handleNumeroReservaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove qualquer caractere não numérico
    if (value === '' || parseInt(value) > 0) {
      formBag.setValue('numero_reserva', value);
    }
  };

  const handleClickReprovar = async () => {
    setDialogJustificarEnvioOpen(true);

    updateDialogJustificarEnvioInfo({
      tipo: 'reprovar-demanda',
      title: {
        text: 'Justificar reprovação',
      },
    });
  };

  const handleClickEnviarDemandaEsteiraOito = () => {
    setDialogJustificarEnvioOpen(true);

    updateDialogJustificarEnvioInfo({
      tipo: 'enviar-esteira-oito',
      title: {
        text: 'Justificar envio para esteira oito',
      },
    });
  };

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

  const handleClickJustificarEnvio = ({ title, tipo }: OnClickJustificarEnvio) => {
    updateDialogJustificarEnvioInfo({
      tipo,
      title: {
        text: title,
      }
    })

    setDialogJustificarEnvioOpen(true);
  }

  const atualizaFormDadosIniciais = useCallback(async () => {
    try {
      setIsLoadingForm(true);
      setIsLoadingFileViewer(true);;

      console.log('Dados recebidos:', dadosIniciais);

      if (!dadosIniciais) {
        return;
      }

      const dadosCliente = await getDadosCliente();

      updateDadosCliente({
        timeOut: dadosCliente?.time_out?.['Procon'],
      });

      updateInitialFormValues(dadosIniciais);

      updateOpcoesProcesso({
        uf: picklist.ufs.map((uf) => uf.nome),
        cidade: dadosIniciais?.cidade ? [dadosIniciais.cidade] : [],
      });

      updateCidadesPorUf(dadosIniciais.uf ?? '');

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
    if (dadosProcesso.length > 0) {
      const ufs = [...new Set(dadosProcesso.map((item) => item.uf))];

      const previousUf = formBag.getValues('uf');
      const selectedUf = ufs.length > 0 ? ufs[0] : '';

      formBag.setValue('uf', previousUf ?? selectedUf);

      updateOpcoesProcesso({
        uf: ufs.length > 0 ? ufs : picklist.ufs.map((uf) => uf.nome),
      });

      updateCidadesPorUf(selectedUf);
    }
  }, [dadosProcesso]);

  useEffect(() => {
    atualizaFormDadosIniciais();
  }, []);

  return (
    <div className="flex w-full h-full gap-4">
      <Card
        style={{ maxHeight: 'calc(100vh - 136px)' }}
        className="sticky top-[72px] w-1/2 gap-4 p-2 rounded bg-zinc-100 dark:bg-zinc-800">
        {isLoadingFileViewer ? (
          <Skeleton.Root className="w-full h-full">
            <Skeleton.Custom className="w-full h-full" />
          </Skeleton.Root>
        ) : (
          <div className="flex flex-col w-full h-full gap-2">
            {isUploadLimitReached ? (
              <span className="text-xs text-orange-500 dark:text-yellow-600 bg-zinc-200 dark:bg-zinc-900 rounded p-2">
                Aviso: Limite total de 20MB de arquivos atingido.
              </span>
            ) : null}

            <Upload.Bag
              ref={uploadRef}
              visible
              initialList={uploadList}
              onProcessUpload={async (file, updateFile) => {
                handleProcessUpload({ file, updateFile });
              }}>
              {({ list, uploadFiles, removeFile, retryUpload, updateFile }) => {
                return (
                  <Upload.Root data-open={isOpenUploadList} className="data-[open=true]:h-1/2">
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
                              {/* {
                                    isUploadLimitReached ? (
                                      <Upload.Drop.Drag.Custom className="text-red-500 border-red-500">
                                        Limite de 20MB de arquivos atingido
                                      </Upload.Drop.Drag.Custom>
                                    ) : (
                                      <Upload.Drop.Drag.View
                                        dropzoneBag={dropzoneBag}
                                      />
                                    )
                                  } */}
                            </Upload.Drop.Drag.Root>
                          );
                        }}
                      </Upload.Drop.Dropzone>

                      <Upload.Drop.Info.TooltipIcon />
                    </Upload.Drop.Root>

                    <Upload.List.ToggleOpen show={isOpenUploadList} onClick={(open) => setIsOpenUploadList(open)}>
                      <Upload.List.Root className="min-h-[130px]">
                        {list
                          .sort((a, b) => sortListFiles(a, b))
                          .map((file) => {
                            return (
                              <Upload.List.Row.Root
                                key={file.id}
                                className="cursor-pointer"
                                onClick={() => handleClickFile(file)}>
                                <Upload.List.Row.Name
                                  tooltip={file.info.name}
                                  selected={fileViewer.url === file.info.url}
                                  onClick={() => handleClickFile(file)}>
                                  {fileViewer.url === file.info.url ? (
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

                                {/* <Upload.List.Row.Preview.Root>
                                      <Icon.FileText
                                        className='self-center text-3xl text-black dark:text-white'
                                        weight='thin'
                                      />
                                    </Upload.List.Row.Preview.Root> */}

                                <Upload.List.Row.Description>
                                  <Select
                                    disabled={!file.status.success}
                                    value={file.info.tipo}
                                    onValueChange={(value) =>
                                      handleChangeTipoArquivo({
                                        updateFile,
                                        file,
                                        value,
                                      })
                                    }>
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
                                    }}>
                                    {file.status.isDeleting ? (
                                      <Icon.CircleNotch className="animate-spin text-red-500 text-sm" weight="bold" />
                                    ) : (
                                      <span>Remover</span>
                                    )}
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

            <PDFViewer data-open={isOpenUploadList} className="data-[open=true]:h-1/2" source={fileViewer.url} />
          </div>
        )}
      </Card>

      <Card className="flex flex-col w-1/2 gap-4 py-4 h-full overflow-y-auto">
        <CardContent className="flex flex-col gap-4 h-full">
          <Countdown
            label="Tempo restante para preenchimento:"
            paused={isPausedCountDown}
            time={{
              now: dateNow.toISOString(),
              start: dateNow.toISOString(),
              deadline: moment(dateNow).add(dadosCliente.timeOut, 'minutes').toISOString(),
            }}
            onFinalCountdown={handleFinalCountDown}
          />

          {isLoadingForm ? (
            <Skeleton.Root className="flex flex-col gap-4">
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
              className="space-y-6 flex flex-col gap-4">
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

              {/* Divisão NUP */}
              <div>
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <FileSignature className="w-5 h-5 mr-2 text-blue-500" />
                  <span>Número de identificação</span>
                </h3>

                <div className="space-y-4 bg-blue-50 dark:bg-blue-950/50 p-3 rounded-md mb-4">
                  <div>
                    <Label className="block text-sm mb-1">Número de identificação</Label>
                    <div className="flex items-center">
                      <Input
                        disabled
                        type="text"
                        placeholder="Número de identificação"
                        className="w-full p-2 border rounded-l-md text-sm"
                        {...formBag.register('identificacao')}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipificacao">Tipificação</Label>
                    <Select
                      {...formBag.register('tipificacao')}
                      disabled
                      value={values.tipificacao}
                      onValueChange={(value) => formBag.setValue('tipificacao', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma tipificação" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Procon">Procon</SelectItem>
                        <SelectItem value="Procon / Consumidor.gov.br">Procon / Consumidor.gov.br</SelectItem>
                        <SelectItem value="Procon / Proconsumidor">Procon / Proconsumidor</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="origem_reclamacao">Identificação da origem da reclamação</Label>
                    <Select
                      {...formBag.register('origem_reclamacao')}
                      disabled
                      value={values.origem_reclamacao}
                      onValueChange={(value) => formBag.setValue('origem_reclamacao', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a origem da reclamação" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Procon">Procon</SelectItem>
                        <SelectItem value="Procon / Consumidor.gov.br">Procon / Consumidor.gov.br</SelectItem>
                        <SelectItem value="CIP (Procon SP)">CIP (Procon SP)</SelectItem>
                        <SelectItem value="Processo Administrativo (Procon SP)">
                          Processo Administrativo (Procon SP)
                        </SelectItem>
                        <SelectItem value="Proconsumidor">Proconsumidor</SelectItem>
                        <SelectItem value="Upload físico">Upload físico</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipo_processo">Tipo de processo</Label>
                    <Select
                      {...formBag.register('tipo_processo')}
                      disabled
                      value={values.tipo_processo}
                      onValueChange={(value) => formBag.setValue('tipo_processo', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de processo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CIP">CIP</SelectItem>
                        <SelectItem value="F.A.">F.A.</SelectItem>
                        <SelectItem value="Processo Administrativo">Processo Administrativo</SelectItem>
                        <SelectItem value="Reclamação">Reclamação</SelectItem>
                        <SelectItem value="Recurso Administrativo">Recurso Administrativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <FieldMessage.Error.Root>
                      <div className="space-y-2">
                        <Label htmlFor="data_audiencia">Data da audiência</Label>
                        <div className="group flex gap-2 items-center">
                          <DateTimePicker
                            date={values.data_audiencia ? new Date(values.data_audiencia) : undefined}
                            onSelect={handleDataAudienciaChange}
                          />
                          <X
                            className="w-4 h-4 cursor-pointer text-gray-400 hover:text-red-500"
                          />
                        </div>
                      </div>
                      <FieldMessage.Error.Text>
                        {formBag.formState.errors.data_audiencia?.message}
                      </FieldMessage.Error.Text>
                    </FieldMessage.Error.Root>

                  <div className="space-y-2">
                    <Label htmlFor="data_defesa">Data de defesa</Label>
                    <div className="group flex gap-2 items-center">
                      <DatePicker
                        disabled
                        date={values.data_defesa ? new Date(values.data_defesa) : undefined}
                        onSelect={(date) => {
                          formBag.setValue('data_defesa', date?.toISOString());
                        }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="data_reclamacao">Data da reclamação</Label>
                    <div className="group flex gap-2 items-center">
                      <DatePicker
                        disabled
                        date={values.data_reclamacao ? new Date(values.data_reclamacao) : undefined}
                        onSelect={(date) => {
                          formBag.setValue('data_reclamacao', date?.toISOString());
                        }}
                      />
                    </div>
                  </div>

                  {/* {dadosNup && dadosNup.length > 0 && (
                      <div className="bg-blue-50 p-3 rounded-md">
                        <h4 className="text-sm font-medium text-blue-800 mb-2">Dados encontrados:</h4>
                        {dadosNup.map((dado, index) => (
                          <div key={index} className="mb-2 text-sm">
                            <p>
                              <span className="font-medium">UF:</span> {dado.uf}
                            </p>
                            <p>
                              <span className="font-medium">Tribunal:</span> {dado.tribunal}
                            </p>
                            <p>
                              <span className="font-medium">Comarca:</span> {dado.comarca}
                            </p>
                          </div>
                        ))}
                      </div>
                    )} */}
                </div>
              </div>

              {/* Informações do Processo */}
              <div>
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <FileSignature className="w-5 h-5 mr-2 text-green-500" />
                  <span>Informações do Processo</span>
                </h3>

                <div className="space-y-4 bg-green-50 dark:bg-green-950/50 p-3 rounded-md mb-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="uf">UF</Label>
                      <Select {...formBag.register('uf')} value={values.uf} onValueChange={handleUfChange} disabled>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a UF" />
                        </SelectTrigger>
                        <SelectContent>
                          {opcoesProcesso.uf.map((uf) => (
                            <SelectItem key={uf} value={uf}>
                              {uf}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="cidade">Cidade</Label>
                      <Select
                        {...formBag.register('cidade')}
                        disabled
                        value={values.cidade}
                        onValueChange={(value) => formBag.setValue('cidade', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a Cidade" />
                        </SelectTrigger>
                        <SelectContent>
                          {opcoesProcesso.cidade.map((comarca) => (
                            <SelectItem key={comarca} value={comarca}>
                              {comarca}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* <div>
                        <Label className="block text-sm mb-1">Órgão julgador</Label>
                        <select
                          className="w-full p-2 border rounded-md text-sm"
                          {...formBag.register('orgao_tribunal')}>
                          <option value="">Selecione o Tribunal</option>
                          {opcoesTribunal.map((tribunal) => (
                            <option key={tribunal} value={tribunal}>
                              {tribunal}
                            </option>
                          ))}
                        </select>
                      </div> */}

                    {/* <div>
                        <Label className="block text-sm mb-1">Vara</Label>
                        <select className="w-full p-2 border rounded-md text-sm" {...formBag.register('vara')}>
                          <option value="">Selecione a Vara</option>
                          {opcoesVara.map((vara) => (
                            <option key={vara} value={vara}>
                              {vara}
                            </option>
                          ))}
                        </select>
                      </div> */}
                  </div>
                </div>
              </div>

              {/* Divisão Detalhes do Autor */}
              <div>
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <User className="w-5 h-5 mr-2 text-purple-500" />
                  <span>Detalhes do Autor</span>
                </h3>
                <div className="space-y-4 bg-purple-50 dark:bg-purple-950/50 p-3 rounded-md">
                  <div>
                    <Label className="block text-sm mb-1">Nome completo</Label>
                    <Input
                      disabled
                      type="text"
                      placeholder="... nome completo do autor..."
                      className="w-full p-2 border rounded-md text-sm"
                      onChange={(e) => updateInputAutor({ nome: e.target.value })}
                      value={autor.nome}
                    />
                  </div>
                  <div>
                    <Label className="block text-sm mb-1">Documento autor</Label>
                    <Input
                      disabled
                      type="text"
                      placeholder="... documento autor ..."
                      className="w-full p-2 border rounded-md text-sm"
                      onChange={(e) => updateInputAutor({ documento: maskCpfCnpj(e.target.value) })}
                      value={autor.documento}
                    />
                  </div>
                  <div>
                    <Label className="block text-sm mb-1">Email do autor</Label>
                    <Input
                      disabled
                      type="text"
                      placeholder="... email do autor ..."
                      className="w-full p-2 border rounded-md text-sm"
                      onChange={(e) => updateInputAutor({ email: maskEmail(e.target.value) })}
                      value={autor.email}
                    />
                  </div>
                  <div>
                    <Label className="block text-sm mb-1">Telefone / celular do autor</Label>
                    <Input
                      disabled
                      type="text"
                      placeholder="... telefone do autor ..."
                      className="w-full p-2 border rounded-md text-sm"
                      onChange={(e) => updateInputAutor({ telefone: maskPhone(e.target.value) })}
                      value={autor.telefone}
                    />
                  </div>

                  <button
                    type="button"
                    disabled
                    onClick={handleAdicionarAutor}
                    className="w-full bg-purple-500  text-white px-4 py-2 rounded-md text-sm hover:bg-purple-600 transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed">
                    <Plus className="w-4 h-4" />
                    Adicionar autor
                  </button>

                  {values?.lista_autores && values.lista_autores.length > 0 && (
                    <div className="mt-4">
                      <div className="bg-gray-50 dark:bg-gray-950/30 rounded-md border">
                        <div className="p-3 border-b bg-gray-100 dark:bg-gray-900/30">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Autores adicionados</h4>
                        </div>
                        <div className="divide-y">
                          {values.lista_autores.map((autor, index) => (
                            <div
                              key={index}
                              className="p-3 flex items-center dark:bg-black hover:bg-gray-100 hover:dark:bg-gray-950">
                              <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{autor.nome}</p>
                                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded text-xs text-nowrap">
                                    {autor.documento}
                                  </span>
                                </div>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  {autor.email && (
                                    <span className="flex items-center gap-1">
                                      <Mail className="w-3 h-3" />
                                      {autor.email}
                                    </span>
                                  )}
                                  {autor.telefone && (
                                    <span className="flex items-center gap-1">
                                      <Phone className="w-3 h-3" />
                                      {autor.telefone}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <button
                                type="button"
                                disabled
                                onClick={() => handleRemoverAutor(autor.id)}
                                className="group p-1 hover:bg-red-100 rounded-full transition-colors group">
                                <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 group-disabled:cursor-not-allowed" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Divisão Detalhes do Réu */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-orange-500" />
                  <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Detalhes do Réu</h3>
                </div>
                <div className="space-y-4 bg-orange-50 dark:bg-orange-950/50 p-3 rounded-md">
                  <div>
                    <Label className="block text-sm mb-1">Nome completo</Label>
                    <Input
                      disabled
                      type="text"
                      placeholder="... nome completo do réu..."
                      className="w-full p-2 border rounded-md text-sm"
                      onChange={(e) => updateInputReu({ nome: e.target.value })}
                      value={reu.nome}
                    />
                  </div>
                  <div>
                    <Label className="block text-sm mb-1">Documento réu</Label>
                    <Input
                      disabled
                      type="text"
                      placeholder="... documento réu ..."
                      className="w-full p-2 border rounded-md text-sm"
                      onChange={(e) => updateInputReu({ documento: maskCpfCnpj(e.target.value) })}
                      value={reu.documento}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAdicionarReu}
                    disabled
                    className="w-full bg-orange-500 text-white px-4 py-2 rounded-md text-sm hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:cursor-not-allowed">
                    <Plus className="w-4 h-4" />
                    Adicionar réu
                  </button>

                  {values?.lista_reus && values.lista_reus.length > 0 && (
                    <div className="mt-4">
                      <div className="bg-gray-50 dark:bg-gray-950/30 rounded-md border">
                        <div className="p-3 border-b bg-gray-100 dark:bg-gray-900/30">
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Réus adicionados</h4>
                        </div>
                        <div className="divide-y">
                          {values.lista_reus.map((reu, index) => (
                            <div
                              key={index}
                              className="p-3 flex items-center dark:bg-black hover:bg-gray-100 hover:dark:bg-gray-950">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{reu.nome}</p>
                                  <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs text-nowrap">
                                    {reu.documento}
                                  </span>
                                </div>
                              </div>
                              <button
                                type="button"
                                disabled
                                onClick={() => handleRemoverReu(reu.id)}
                                className="group p-1 hover:bg-red-100 rounded-full transition-colors group">
                                <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500 group-disabled:cursor-not-allowed" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Objeto e Pedidos */}
              <div>
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-cyan-500" />
                  <span>Objeto e Pedidos</span>
                </h3>
                <div className="space-y-4 bg-cyan-50 dark:bg-cyan-950/30 p-3 rounded-md">
                  <div className="space-y-2">
                    <Label htmlFor="objeto">Objeto</Label>
                    <Select
                      {...formBag.register('objeto')}
                      disabled
                      value={values.objeto}
                      onValueChange={(value) => formBag.setValue('objeto', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o Objeto" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Passagem aérea">Passagem aérea</SelectItem>
                        <SelectItem value="Hospedagem">Hospedagem</SelectItem>
                        <SelectItem value="Locação de veículo">Locação de veículo</SelectItem>
                        <SelectItem value="Seguro viagem">Seguro viagem</SelectItem>
                        <SelectItem value="Serviços diversos">Serviços diversos</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="block text-sm mb-1">Número da reserva</Label>
                    <Input
                      disabled
                      type="text"
                      placeholder="Número da reserva"
                      className="w-full p-2 border rounded-md text-sm"
                      {...formBag.register('numero_reserva')}
                      onChange={handleNumeroReservaChange}
                    />
                  </div>

                  <div>
                    <Label className="block text-sm mb-1">Transcrição da reclamação</Label>
                    <textarea
                      disabled
                      className="w-full p-2 border rounded-md text-sm h-24 bg-white dark:bg-black"
                      placeholder="Transcrição da reclamação"
                      {...formBag.register('resumo_processo')}
                    />
                  </div>
                </div>
              </div>

              {/* Divisão Causa Raiz */}
              <div>
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <GitBranch className="w-5 h-5 mr-2 text-rose-500" />
                  <span>Causa Raiz</span>
                </h3>
                <div className="space-y-4 bg-rose-50 dark:bg-rose-950/30 p-3 rounded-md">
                  <div>
                    <Label className="block text-sm mb-1">Causa Raiz</Label>
                    <Select
                      {...formBag.register('causa_raiz')}
                      disabled
                      value={values.causa_raiz}
                      onValueChange={handleCausaRaizChange}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione a causa raiz" />
                      </SelectTrigger>
                      <SelectContent>
                      <SelectItem value="Accommodation Closed">Accommodation Closed</SelectItem>
                          <SelectItem value="Advertisement Removal">Advertisement Removal</SelectItem>
                          <SelectItem value="Attraction">Attraction</SelectItem>
                          <SelectItem value="Bad Experience">Bad Experience</SelectItem>
                          <SelectItem value="Booking Tools">Booking Tools</SelectItem>
                          <SelectItem value="BHI / Rentalcars">BHI / Rentalcars</SelectItem>
                          <SelectItem value="Business Partner Case">Business Partner Case</SelectItem>
                          <SelectItem value="Credit Card Issues">Credit Card Issues</SelectItem>
                          <SelectItem value="Flight">Flight</SelectItem>
                          <SelectItem value="Improper Advertising (Pictures and Services)">Improper Advertising (Pictures and Services)</SelectItem>
                          <SelectItem value="Improper Advertising (Price Issues)">Improper Advertising (Price Issues)</SelectItem>
                          <SelectItem value="Improper Cancelation">Improper Cancelation</SelectItem>
                          <SelectItem value="Improper Charge">Improper Charge</SelectItem>
                          <SelectItem value="Information Request">Information Request</SelectItem>
                          <SelectItem value="Insurance">Insurance</SelectItem>
                          <SelectItem value="Login Issues">Login Issues</SelectItem>
                          <SelectItem value="No Show">No Show</SelectItem>
                          <SelectItem value="Non Refundable Fees">Non Refundable Fees</SelectItem>
                          <SelectItem value="Not related to Booking.com">Not related to Booking.com</SelectItem>
                          <SelectItem value="Overbooking">Overbooking</SelectItem>
                          <SelectItem value="Partner Case">Partner Case</SelectItem>
                          <SelectItem value="Partner Case / Guest Misconduct">Partner Case / Guest Misconduct</SelectItem>
                          <SelectItem value="Partner Case / PbB">Partner Case / PbB</SelectItem>
                          <SelectItem value="Partner Case / Policies & Contracts">Partner Case / Policies & Contracts</SelectItem>
                          <SelectItem value="Partner Case / Serasa">Partner Case / Serasa</SelectItem>
                          <SelectItem value="Partner Critical Matters">Partner Critical Matters</SelectItem>
                          <SelectItem value="PATO / GATO">PATO / GATO</SelectItem>
                          <SelectItem value="Right to Regret">Right to Regret</SelectItem>
                          <SelectItem value="Transfer">Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Dropdown condicional para casos de voo */}
                  {values.causa_raiz && dicionarioPalavrasRelacionadaVoos.includes(values.causa_raiz) && (
                    <div>
                      <Label className="block text-sm mb-1">Subcausa</Label>
                      <Select
                        {...formBag.register('sub_causa_raiz')}
                        disabled
                        value={values.sub_causa_raiz || ''}
                        onValueChange={(value) => {
                          console.log('Valor selecionado para sub_causa_raiz:', value);
                          formBag.setValue('sub_causa_raiz', value);
                        }}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Selecione a subcausa" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="(Virtual) Interlining">(Virtual) Interlining</SelectItem>
                          <SelectItem value="Airline's Service">{"Airline's Service"}</SelectItem>
                          <SelectItem value="Airport's Service">{"Airport's Service"}</SelectItem>
                          <SelectItem value="Ancilliaries (add-ons)">Ancilliaries (add-ons)</SelectItem>
                          <SelectItem value="B.com CS Service">B.com CS Service</SelectItem>
                          <SelectItem value="B.com Website/ Ticket Issue">B.com Website/ Ticket Issue</SelectItem>
                          <SelectItem value="Cancelation Without Penalty">Cancelation Without Penalty</SelectItem>
                          <SelectItem value="Critical Matters">Critical Matters</SelectItem>
                          <SelectItem value="ETG's Service">{"ETG's Service"}</SelectItem>
                          <SelectItem value="Fraud">Fraud</SelectItem>
                          <SelectItem value="Invoice">Invoice</SelectItem>
                          <SelectItem value="Name Change">Name Change</SelectItem>
                          <SelectItem value="Not Flights on B.com">Not Flights on B.com</SelectItem>
                          <SelectItem value="Payments">Payments</SelectItem>
                          <SelectItem value="Reeboking">Reeboking</SelectItem>
                          <SelectItem value="Refund (Aleatory)">Refund (Aleatory)</SelectItem>
                          <SelectItem value="Rewards & Incentives">Rewards & Incentives</SelectItem>
                          <SelectItem value="Schedule Change">Schedule Change</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>

              {isUploadLimitReached ? (
                <span className="text-sm text-orange-500 dark:text-yellow-600 bg-zinc-200 dark:bg-zinc-900 rounded p-2">
                  Aviso: Limite total de 20MB de arquivos atingido.
                </span>
              ) : null}

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
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogEnviarDesdobramentoOpen} onOpenChange={setDialogEnviarDesdobramentoOpen}>
        <DialogContent aria-describedby="dialog-enviar-desdobramento" className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Desdobramento</DialogTitle>
          </DialogHeader>

          <span>
            Tem certeza que deseja alterar o número do processo? Os dados preenchidos serão salvos e enviados.
          </span>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogEnviarDesdobramentoOpen(false)}>
              Cancelar
            </Button>

            <Button type="button" disabled={isEnviandoDesdobramento} onClick={handleConfirmaEnviarDesdobramento}>
              {isEnviandoDesdobramento ? 'Alterando...' : 'Alterar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogObservacaoOpen} onOpenChange={setDialogObservacaoOpen}>
        <DialogContent aria-describedby="dialog-observacao" className="flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle>Adicionar observação</DialogTitle>
          </DialogHeader>

          <FieldMessage.Error.Root>
            <Textarea
              id="observacao"
              rows={6}
              className="bg-white dark:bg-black"
              onChange={(event) =>
                updateDialogObservacaoInfo({
                  observacao: {
                    value: event.target.value,
                    isValid: event.target.value.length >= 10,
                  },
                })
              }
              value={dialogObservacaoInfo.observacao.value}
            />
            <FieldMessage.Error.Text visible={!dialogObservacaoInfo.observacao.isValid}>
              A observacao deve conter no mínimo 10 caracteres
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>

          <DialogFooter>
            <Button type="button" onClick={() => setDialogObservacaoOpen(false)}>
              Cancelar
            </Button>

            <Button
              type="button"
              disabled={!dialogObservacaoInfo.observacao.isValid}
              onClick={handleClickConfirmaAdicionaObservacao}>
              {isAddingObsForm ? 'Adicionando...' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogProcessoOpen} onOpenChange={setDialogProcessoOpen}>
        <DialogContent aria-describedby="dialog-processo" className="max-h-[90vh] max-w-[90vw] overflow-auto">
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
              {dadosProcesso.map((info, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Button type="button" onClick={() => handleSelecionarProcesso(info)}>
                      Selecionar
                    </Button>
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
