'use client';

import { startTransition, useActionState, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useShallow } from 'zustand/shallow';
import { useResourcesStore } from '@/zustand-store/resources';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Upload } from '@/components/Upload2.0';
import * as Icon from '@phosphor-icons/react';
import { PDFViewer } from '@/components/PDFViewer';
import { FileItem, UpdateFile, UploadRootHandles } from '@/components/Upload2.0/contexts';
import Countdown from '@/components/Countdown';
import { Skeleton } from '@/components/Skeleton2.0';
import { useAuthStore } from '@/zustand-store/auth.store';
import { Textarea } from '@/components/ui/textarea';
import { FieldMessage } from '@/components/FieldMessage';
import { util } from '@/utils';
import { fileHelper } from '@/utils/File';
import { ArquivoDemanda } from '@/actions/backend/interface';
import { toast } from '@/utils/toast';
import { getDadosCliente as getDadosClienteAction } from '@/actions/backend/cliente';
import {
  AlertTriangle,
  FileSignature,
  FileText,
  GitBranch,
  Mail,
  Phone,
  Plus,
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
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { getCidadesPorUf } from '@/actions/local';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { actions } from '@/actions';
import { Input } from '@/components/ui/input';

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
} from '../../interfaces';

import {
  adicionaObservacaoDemanda,
  enviarDemandaExcecaoOito,
  submeterDemanda,
  salvarDemanda,
  desbloqueiaUsuarioDemanda,
} from '@/actions/backend/demanda';
import { cn } from '@/utils/ClassName';
import { DetalhesCadastro } from '@/components/Forms/util/Components/DetalhesCadastro';

interface CadastroJuridicoReturnParams {
  id: string;
  esteira: string;
  esteiraTipo: string;
  dadosIniciais: DemandaProcon;
}

interface FormProconBookingEsteiraOitoProps {
  params: CadastroJuridicoReturnParams;
}

interface OpcoesProcon {
  uf: string[];
  cidade: string[];
}

interface DadosClienteForm {
  timeOut: number;
}

interface HandleChangeTipoArquivoProps {
  file: FormFile;
  updateFile: UpdateFile<FormFile>;
  value: string;
}

interface HandleClickFileParams {
  file: FormFile;
  updateFile: UpdateFile<FormFile>
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

export function FormProconBookingEsteiraOito({ params }: FormProconBookingEsteiraOitoProps) {
  const pk = params.id;
  const esteira = params.esteira;
  const esteiraTipo = params.esteiraTipo;
  const dadosIniciais = params.dadosIniciais;

  const router = useRouter();

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
      data_reclamacao: '',
    },
  });

  const values = formBag.watch();

  const [fileViewer, setFileViewer] = useState({
    url: '',
    name: '',
    s3Key: '',
    s3Bucket: '',
  });

  const [initialUploadList, setInitialUploadList] = useState<FormFile[] | null>(null);
  const [isLoadingFileUrl, setIsLoadingFileUrl] = useState(false);

  const [textoReclamacao, setTextoReclamacao] = useState<string>('');
  const [textoExtracaoIA, setTextoExtracaoIA] = useState<string>('');
  const [processandoIA, setProcessandoIA] = useState<boolean>(false);

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

  const [opcoesProcon, setOpcoesProcon] = useState<OpcoesProcon>({
    uf: [],
    cidade: [],
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
  const [isOpenInitialUploadList, setIsOpenInitialUploadList] = useState<boolean>(false);
  const [isPausedCountDown, setIsPausedCountDown] = useState<boolean>(false);
  const [isSavingForm, setIsSavingForm] = useState(false);
  const [isAddingObsForm, setIsAddingObsForm] = useState(false);
  const [isUploadLimitReached, setIsUploadLimitReached] = useState(false);
  const [isEnviandoExcecao, setIsEnviandoExcecao] = useState(false);
  const [isEnviandoProximaEtapa, setIsEnviandoProximaEtapa] = useState(false);
  const [isDesvinculandoUsuario, setIsDesvinculandoUsuario] = useState(false);
  const [isJustificandoEnvio, setIsJustificandoEnvio] = useState(false);

  const [dialogObservacaoOpen, setDialogObservacaoOpen] = useState(false);
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

  const updateOpcoesProcon = useCallback((novosDados: Partial<OpcoesProcon>) => {
    setOpcoesProcon((prevState) => {
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

  const formularioValido = (dados: DemandaProcon) => {
    const erros: Record<string, string> = {};

    if (!dados.tipificacao?.trim()) {
      erros.tipificacao = 'Tipificação é obrigatória';
    }

    if (!dados.origem_reclamacao?.trim()) {
      erros.origem_reclamacao = 'Origem da reclamação é obrigatória';
    }

    if (!dados.tipo_processo?.trim()) {
      erros.tipo_processo = 'Tipo de processo é obrigatório';
    }

    if (!dados.data_reclamacao) {
      erros.data_reclamacao = 'Data da reclamação é obrigatória';
    }

    if (!dados.uf?.trim()) {
      erros.uf = 'UF é obrigatória';
    }

    if (dados.uf?.trim() && !picklist.ufs.find((uf) => uf.nome === dados.uf?.trim())) {
      erros.uf = `"${dados.uf?.trim()}" não está entre as opções disponíveis, e por isso o campo UF não está preenchido, por favor selecione uma UF válida.`;
    }

    if (!dados.cidade?.trim()) {
      erros.cidade = 'Cidade é obrigatória';
    }

    if (!dados.resumo_processo?.trim()) {
      erros.resumo_processo = 'Transcrição da reclamação é obrigatória';
    }

    if (!dados.lista_autores || dados.lista_autores.length === 0) {
      erros.lista_autores = 'Adicione pelo menos um autor';
    }

    if (!dados.lista_reus || dados.lista_reus.length === 0) {
      erros.lista_reus = 'Adicione pelo menos um réu';
    } 

    if (!dados.objeto?.trim()) {
      erros.objeto = 'Objeto é obrigatório';
    }

    if (!dados.causa_raiz?.trim()) {
      erros.causa_raiz = 'Causa raiz é obrigatória';
    }

    if (Object.keys(erros).length > 0) {
      const dicionarioCamposRequired = {
        tipificacao: 'Tipificação',
        origem_reclamacao: 'Origem da reclamação',
        tipo_processo: 'Tipo de processo',
        data_reclamacao: 'Data da reclamação',
        uf: 'UF',
        cidade: 'Cidade',
        resumo_processo: 'Transcrição da reclamação',
        lista_autores: 'Adicione pelo menos um autor',
        lista_reus: 'Adicione pelo menos um réu',
        objeto: 'Objeto',
        causa_raiz: 'Causa raiz',
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
      formBag.setError(campo as keyof DemandaProcon, { type: 'required', message: mensagem });
    });

    return Object.keys(erros).length === 0;
  };

  const onSubmit = async (dados: DemandaProcon) => {
    try {
      setIsEnviandoProximaEtapa(true);
      
      // Limpar erros anteriores
      formBag.clearErrors();

      const formValido = formularioValido(dados);

      if (!formValido) {
        return;
      }

      await saveForm();

      const response = await submeterDemanda({ pk, 
        dados: {
          ...dados,
          identificacao: dados.identificacao?.trim(),
      }});

      const dadosSubmeter = util.actions.convertResponseActionData(response?.data);

      const proximaDemanda = dadosSubmeter?.pk;

      if (proximaDemanda) {
        toast.success({
          title: 'Enviado',
          description: 'Formulário enviado com sucesso.',
        });

        router.push(`/${esteira}/${esteiraTipo}/demanda/${proximaDemanda}`);

        return;
      }

      toast.warning({
        title: 'Aviso!',
        description: `Não há nova demanda para preenchimento, retornando a "${esteira} ${esteiraTipo}"`,
      });

      router.push(`/${esteira}/${esteiraTipo}`);
    } catch (error: any) {
      toast.error({
        title: 'Falha ao enviar o formulário',
        description: error?.message,
      });
    } finally {
      setIsEnviandoProximaEtapa(false);
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

  const handleClickFile = async (params: HandleClickFileParams) => {
    if (params.file.info.url.length > 0) {
      setFileViewer({
        url: params.file.info.url,
        name: params.file.info.name,
        s3Key: params.file.info.s3Key,
        s3Bucket: params.file.info.s3Bucket,
      });

      return;
    }

    setIsLoadingFileUrl(true);

    try {
      const urlFile = await arquivo.getFileUrlFromS3({
        s3Key: params.file.info.s3Key,
        s3Bucket: params.file.info.s3Bucket,
      });
  
      setFileViewer({
        url: urlFile,
        name: params.file.info.name,
        s3Key: params.file.info.s3Key,
        s3Bucket: params.file.info.s3Bucket,
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
      setIsLoadingFileUrl(false);
    }
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
        title: 'Tempo!',
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

      const values = formBag.getValues();

      const dados = {
        ...values,
        identificacao: values.identificacao?.trim(),
      };

      console.log('Valores do formulário para salvar:', dados);

      const response = await salvarDemanda({
        pk,
        dados,
      });

      util.actions.checkHaveError(response?.data);

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
      setIsEnviandoExcecao(true);

      if (!user?.email) {
        throw new Error('E-mail do usuário não carregado na autenticação corretamente');
      }

      const response = await enviarDemandaExcecaoOito({
        pk,
        justificativa: justificarEnvioDialogInfo.justificativa.value ?? '',
      });

      util.actions.checkHaveError(response?.data);

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
    } finally {
      setIsEnviandoExcecao(false);
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

  const handleClickEnviarExcecao = () => {
    setDialogJustificarEnvioOpen(true);

    updateDialogJustificarEnvioInfo({
      tipo: 'enviar-excecao-oito',
      title: {
        text: 'Justificar envio para exceção',
      },
    });
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

    updateOpcoesProcon({ cidade: cidades });
  };

  const handleUfChange = (newValue: string) => {
    const novaUf = newValue;
    formBag.setValue('uf', novaUf);
    formBag.clearErrors('uf');
    updateCidadesPorUf(novaUf);
    formBag.setValue('cidade', '');
  };

  const handleCausaRaizChange = (value: string) => {
    formBag.setValue('causa_raiz', value);
    formBag.clearErrors('causa_raiz');
    if (!dicionarioRelacionadoVoos.includes(value)) {
      formBag.setValue('sub_causa_raiz', '');
    }
  };

  const handleAdicionarAutor = () => {
    const nome = autor.nome?.trim();
    const documento = autor.documento?.trim();
    const email = autor.email?.trim();
    const telefone = autor.telefone?.trim();

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
    formBag.clearErrors('lista_autores');

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
    const nome = reu.nome?.trim();
    const documento = reu.documento?.trim();

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
    formBag.clearErrors('lista_reus');

    // Limpar os campos após adicionar
    updateInputReu({
      nome: '',
      documento: '',
    });
  };

  const handleRemoverReu = (id: string) => {



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
  //   try {
  //     const reclamacao = await actions.backend.ia.getTextoReclamacao({
  //       s3Key: fileViewer.s3Key,
  //       s3Bucket: fileViewer.s3Bucket,
  //     });

  //     return {
  //       texto: reclamacao?.texto,
  //     }
  //   } catch (error: any) {
  //     toast.error({
  //       title: 'deu erro no actionTeste',
  //       description: error?.message,
  //     });

  //     return {
  //       texto: 'Deu erro',
  //     }
  //   }
  // }

  // const [state, handleClick, isLoadingTexto] = useActionState(actionTeste, { texto: 'nao tem nada' });

  // const handleCarregaTexto2 = () => {
  //   startTransition(() => {
  //     handleClick(); // 🔥 Agora dentro de uma transição (correto)
  //   });
  // };

  const handleCarregaTexto = async () => {
    try {
      if (!fileViewer.url) {
        toast.warning({
          title: 'Aviso!',
          description: 'Por favor, selecione um arquivo para carregar o texto da reclamação.',
        });
        return;
      }

      const reclamacao = await actions.backend.ia.getTextoReclamacao({
        s3Key: fileViewer.s3Key,
        s3Bucket: fileViewer.s3Bucket,
      });

      setTextoReclamacao(reclamacao?.texto);
    } catch (error: any) {
      toast.error({
        title: 'Falha ao carregar o texto da reclamação',
        description: error?.message,
      });
    }
  };

  const handleResumoReclamacaoIA = async () => {
    try {
      setProcessandoIA(true);

      if (!pk) {
        throw new Error('Identificador da demanda não carregado corretamente');
      }

      const resumo = await actions.backend.cliente.booking.getResumoReclamacao({
        pk,
      });

      const templateResumo =
        `Resumo:\n${resumo.resumo}\n\n` +
        `Pedidos:\n${resumo.pedidos.map((p) => `- ${p}`).join('\n')}\n\n` +
        `Localização: ${resumo.cidade} - ${resumo.uf}\n\n` +
        `Objeto da Reclamação: ${resumo.objeto}\n\n` +
        `Data da Audiência: ${resumo.dataAudiencia}\n\n` +
        `Prazo de Defesa: ${resumo.prazoDefesa}`;

      setTextoExtracaoIA(templateResumo);
    } catch (error: any) {
      toast.error({
        title: 'Falha ao extrair o resumo da reclamação',
        description: error?.message,
      });
    } finally {
      setProcessandoIA(false);
    }
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

  const carregarArquivosDemanda = useCallback(async (files: ArquivoDemanda[] | undefined) => {
    try {
      setIsLoadingFileViewer(true);

      const initialUploadList = await Promise.all(
        files?.map(async (file, index) => {
          try {
            const urlFile = index === 0 ? await arquivo.getFileUrlFromS3({
              s3Key: file.s3key,
              s3Bucket: file.s3Bucket,
            }) : '';

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

      if (initialUploadList.length === 0) {
        setInitialUploadList([]);

        setFileViewer({
          url: '',
          name: '',
          s3Key: '',
          s3Bucket: '',
        });

        return;
      }

      setInitialUploadList(initialUploadList);

      const firstItemUploadConfigList = initialUploadList.find((item) => item.info.url.length > 0);

      setFileViewer({
        url: firstItemUploadConfigList?.info.url ?? '',
        name: firstItemUploadConfigList?.info.name ?? '',
        s3Key: firstItemUploadConfigList?.info.s3Key ?? '',
        s3Bucket: firstItemUploadConfigList?.info.s3Bucket ?? '',
      });

      const totalFilesSizeInBytes = initialUploadList.reduce(
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

      updateOpcoesProcon({
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
    atualizaFormDadosIniciais();
  }, []);

  return (
    <div className="flex w-full h-full gap-4">
      {/* <button onClick={handleCarregaTexto2} className="bg-red-500">
        { isLoadingTexto ? 'Carregando...' : state.texto}
      </button> */}
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

                    <Upload.List.ToggleOpen
                      show={isOpenInitialUploadList}
                      onClick={(open) => setIsOpenInitialUploadList(open)}>
                      <Upload.List.Root className="min-h-[130px]">
                        {list
                          .sort((a, b) => sortListFiles(a, b))
                          .map((file) => {
                            return (
                              <Upload.List.Row.Root
                                key={file.id}
                                className="cursor-pointer"
                                onClick={() => handleClickFile({ file, updateFile })}>
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

            {
              isLoadingFileUrl ? (
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

          {process.env.NEXT_PUBLIC_ENVIRONMENT === 'Dev' && (
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="ferramentas-ia">
                <AccordionTrigger className="text-lg font-semibold text-gray-700">
                  <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <Icon.Sparkle className="w-5 h-5 mr-2 text-cyan-500" />
                    <span>Sandbox IA</span>
                  </h3>
                </AccordionTrigger>
                <AccordionContent className="flex flex-col gap-4">
                  <div className="flex flex-col gap-4"></div>

                  {/* Card de Texto da Reclamação - Adicionado ao lado direito após o formulário */}
                  <div className="flex justify-end">
                    <div className="w-full border rounded-lg overflow-hidden bg-white shadow-sm ">
                      <div className="bg-gray-100 p-3 border-b">
                        <h2 className="text-lg font-semibold text-gray-700 flex items-center">
                          <FileText className="w-5 h-5 mr-2 text-gray-500" />
                          <span>Extração dos dados brutos do arquivo</span>
                        </h2>
                        <div className="flex items-center gap-2">
                          <Icon.CaretCircleRight className="w-4 h-4 text-blue-500" weight="fill" />
                          <span className="text-sm">{fileViewer.name}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <textarea
                          className="w-full p-3 border rounded-md text-sm text-gray-700 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Aperte o botão `Carregar texto` para extrair o dados brutos do arquivo selecionado"
                          value={textoReclamacao}
                          onChange={(e) => setTextoReclamacao(e.target.value)}
                          aria-label="Dados brutos do arquivo"
                        />
                        <div className="mt-3 flex justify-end">
                          <button
                            type="button"
                            onClick={handleCarregaTexto}
                            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors"
                            aria-label="Carregar Dados brutos do arquivo">
                            Extrair
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card de Extração de dados via IA */}
                  <div className="flex justify-end w-full">
                    <div className="w-full border rounded-lg overflow-hidden bg-white shadow-sm">
                      <div className="bg-gray-100 p-3 border-b">
                        <h2 className="text-lg font-semibold text-gray-700 flex items-center">
                          <FileText className="w-5 h-5 mr-2 text-gray-500" />
                          <span>Extração de dados resumidos da demanda via IA</span>
                        </h2>
                      </div>
                      <div className="p-4">
                        <textarea
                          className="w-full p-3 border rounded-md text-sm text-gray-700 min-h-[200px] focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Clique em um dos botões abaixo para extrair informações do texto da reclamação usando IA..."
                          value={textoExtracaoIA}
                          onChange={(e) => setTextoExtracaoIA(e.target.value)}
                          readOnly={processandoIA}
                          aria-label="Resultado da extração via IA"
                        />
                        <div className="mt-3 flex justify-end space-x-3">
                          <button
                            type="button"
                            onClick={handleResumoReclamacaoIA}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:bg-green-300 disabled:cursor-not-allowed flex items-center"
                            aria-label="Extrair resumo da reclamação via IA">
                            {processandoIA ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                <span>Processando...</span>
                              </>
                            ) : (
                              'Extrair'
                            )}
                          </button>
                          {/* <button
                            type="button"
                            onClick={handleCausaRaizIA}
                            disabled={processandoIA || !textoReclamacao}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center"
                            aria-label="Extrair causa raiz via IA">
                            {processandoIA ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                <span>Processando...</span>
                              </>
                            ) : (
                              'Causa Raiz'
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={handleResumoReclamacaoIA}
                            disabled={processandoIA || !textoReclamacao}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors disabled:bg-green-300 disabled:cursor-not-allowed flex items-center"
                            aria-label="Extrair resumo da reclamação via IA">
                            {processandoIA ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                <span>Processando...</span>
                              </>
                            ) : (
                              'Resumo da Reclamação'
                            )}
                          </button> */}
                        </div>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

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
            <div className="flex flex-col gap-4">
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
                          {...formBag.register('identificacao')}
                          type="text"
                          placeholder="Número de identificação"
                          className="w-full p-2 border rounded-l-md text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tipificacao">Tipificação</Label>
                      <FieldMessage.Error.Root>
                        <Select
                          {...formBag.register('tipificacao')}
                          value={values.tipificacao}
                          onValueChange={(value) => {
                            formBag.setValue('tipificacao', value);
                            formBag.clearErrors('tipificacao');
                          }}>
                          <SelectTrigger className={formBag.formState.errors.tipificacao ? "border-red-500" : ""}>
                            <SelectValue placeholder="Selecione uma tipificação" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Procon">Procon</SelectItem>
                            <SelectItem value="Procon / Consumidor.gov.br">Procon / Consumidor.gov.br</SelectItem>
                            <SelectItem value="Procon / Proconsumidor">Procon / Proconsumidor</SelectItem>
                          </SelectContent>
                        </Select>
                        <FieldMessage.Error.Text visible={!!formBag.formState.errors.tipificacao}>
                          {formBag.formState.errors.tipificacao?.message}
                        </FieldMessage.Error.Text>
                      </FieldMessage.Error.Root>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="origem_reclamacao">Identificação da origem da reclamação</Label>
                      <FieldMessage.Error.Root>
                        <Select
                          {...formBag.register('origem_reclamacao')}
                          value={values.origem_reclamacao}
                          onValueChange={(value) => {
                            formBag.setValue('origem_reclamacao', value);
                            formBag.clearErrors('origem_reclamacao');
                          }}>
                          <SelectTrigger className={formBag.formState.errors.origem_reclamacao ? "border-red-500" : ""}>
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
                        <FieldMessage.Error.Text visible={!!formBag.formState.errors.origem_reclamacao}>
                          {formBag.formState.errors.origem_reclamacao?.message}
                        </FieldMessage.Error.Text>
                      </FieldMessage.Error.Root>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tipo_processo">Tipo de processo</Label>
                      <FieldMessage.Error.Root>
                        <Select
                          {...formBag.register('tipo_processo')}
                          value={values.tipo_processo}
                          onValueChange={(value) => {
                            formBag.setValue('tipo_processo', value);
                            formBag.clearErrors('tipo_processo');
                          }}>
                          <SelectTrigger className={formBag.formState.errors.tipo_processo ? "border-red-500" : ""}>
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
                        <FieldMessage.Error.Text visible={!!formBag.formState.errors.tipo_processo}>
                          {formBag.formState.errors.tipo_processo?.message}
                        </FieldMessage.Error.Text>
                      </FieldMessage.Error.Root>
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
                            onClick={() => handleDataAudienciaChange(null)}
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
                          date={values.data_defesa ? new Date(values.data_defesa) : undefined}
                          onSelect={(date) => {
                            formBag.setValue('data_defesa', date?.toISOString());
                          }}
                        />
                        <X
                          onClick={() => formBag.setValue('data_defesa', '')}
                          className="w-4 h-4 cursor-pointer text-gray-400 hover:text-red-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="data_reclamacao">Data da reclamação</Label>
                      <FieldMessage.Error.Root>
                        <div className={`group flex gap-2 items-center ${formBag.formState.errors.data_reclamacao ? "border border-red-500 rounded-md" : ""}`}>
                          <DatePicker
                            date={values.data_reclamacao ? new Date(values.data_reclamacao) : undefined}
                            onSelect={(date) => {
                              formBag.setValue('data_reclamacao', date?.toISOString());
                              formBag.clearErrors('data_reclamacao');
                            }}
                          />
                          <X
                            onClick={() => formBag.setValue('data_reclamacao', '')}
                            className="w-4 h-4 cursor-pointer text-gray-400 hover:text-red-500"
                          />
                        </div>
                        <FieldMessage.Error.Text visible={!!formBag.formState.errors.data_reclamacao}>
                          {formBag.formState.errors.data_reclamacao?.message}
                        </FieldMessage.Error.Text>
                      </FieldMessage.Error.Root>
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
                        <FieldMessage.Error.Root>
                          <Select 
                            {...formBag.register('uf')} 
                            value={values.uf} 
                            onValueChange={handleUfChange}>
                            <SelectTrigger className={formBag.formState.errors.uf ? "border-red-500" : ""}>
                              <SelectValue placeholder="Selecione a UF" />
                            </SelectTrigger>
                            <SelectContent>
                              {opcoesProcon.uf.map((uf) => (
                                <SelectItem key={uf} value={uf}>
                                  {uf}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldMessage.Error.Text visible={!!formBag.formState.errors.uf}>
                            {formBag.formState.errors.uf?.message}
                          </FieldMessage.Error.Text>
                        </FieldMessage.Error.Root>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="cidade">Cidade</Label>
                        <FieldMessage.Error.Root>
                          <Select
                            {...formBag.register('cidade')}
                            value={values.cidade}
                            onValueChange={(value) => {
                              formBag.setValue('cidade', value);
                              formBag.clearErrors('cidade');
                            }}>
                            <SelectTrigger className={formBag.formState.errors.cidade ? "border-red-500" : ""}>
                              <SelectValue placeholder="Selecione a Cidade" />
                            </SelectTrigger>
                            <SelectContent>
                              {opcoesProcon.cidade.map((comarca) => (
                                <SelectItem key={comarca} value={comarca}>
                                  {comarca}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FieldMessage.Error.Text visible={!!formBag.formState.errors.cidade}>
                            {formBag.formState.errors.cidade?.message}
                          </FieldMessage.Error.Text>
                        </FieldMessage.Error.Root>
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
                  <FieldMessage.Error.Root>
                    <div className="flex items-center gap-2 mb-3">
                      <User className="w-5 h-5 text-purple-500" />
                      <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Detalhes do Autor</h3>
                    </div>
                    <div
                      className={cn(
                        'space-y-4 bg-purple-50 dark:bg-purple-950/50 p-3 rounded-md',
                        formBag.formState.errors.lista_autores ? 'border border-red-500' : ''
                      )}>
                      <div>
                        <Label className="block text-sm mb-1">Nome completo</Label>
                        <Input
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
                          type="text"
                          placeholder="... telefone do autor ..."
                          className="w-full p-2 border rounded-md text-sm"
                          onChange={(e) => updateInputAutor({ telefone: maskPhone(e.target.value) })}
                          value={autor.telefone}
                        />
                      </div>

                      <button
                        type="button"
                        onClick={handleAdicionarAutor}
                        className="w-full bg-purple-500 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-600 transition-colors flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" />
                        Adicionar autor
                      </button>

                      {values?.lista_autores && values.lista_autores.length > 0 && (
                        <div className="mt-4">
                          <div className="bg-gray-50 dark:bg-gray-950/30 rounded-md border">
                            <div className="p-3 border-b bg-gray-100 dark:bg-gray-950/30">
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Autores adicionados</h4>
                            </div>
                            <div className="divide-y">
                              {values.lista_autores.map((autor, index) => (
                                <div
                                  key={autor.id}
                                  className="p-3 flex items-center justify-between dark:bg-black hover:bg-gray-100 hover:dark:bg-gray-950">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{autor.nome}</p>
                                      <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 rounded text-xs text-nowrap">
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
                                    onClick={() => handleRemoverAutor(autor.id)}
                                    className="p-1 hover:bg-red-100 rounded-full transition-colors group">
                                    <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <FieldMessage.Error.Text>
                      {formBag.formState.errors.lista_autores?.message}
                    </FieldMessage.Error.Text>
                  </FieldMessage.Error.Root>
                </div>

                {/* Divisão Detalhes do Réu */}
                <div>
                  <FieldMessage.Error.Root>
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="w-5 h-5 text-orange-500" />
                      <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Detalhes do Réu</h3>
                    </div>
                    <div
                      className={cn(
                        'space-y-4 bg-orange-50 dark:bg-orange-950/30 p-3 rounded-md',
                        formBag.formState.errors.lista_reus ? 'border border-red-500' : ''
                      )}>
                      <div>
                        <Label className="block text-sm mb-1">Nome completo</Label>
                        <Input
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
                        className="w-full bg-orange-500 text-white px-4 py-2 rounded-md text-sm hover:bg-orange-600 transition-colors flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" />
                        Adicionar réu
                      </button>
                      {values?.lista_reus && values.lista_reus.length > 0 && (
                        <div className="mt-4">
                          <div className="bg-gray-50 dark:bg-gray-950/30 rounded-md border">
                            <div className="p-3 border-b bg-gray-100 dark:bg-gray-950/30">
                              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Réus adicionados</h4>
                            </div>
                            <div className="divide-y">
                              {values.lista_reus.map((reu, index) => (
                                <div
                                  key={reu.id}
                                  className="p-3 flex items-center justify-between dark:bg-black hover:bg-gray-100 hover:dark:bg-gray-950">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{reu.nome}</p>
                                      <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 rounded text-xs text-nowrap">
                                        {reu.documento}
                                      </span>
                                    </div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoverReu(reu.id)}
                                    className="p-1 hover:bg-red-100 rounded-full transition-colors group">
                                    <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    <FieldMessage.Error.Text visible={true}>
                      {formBag.formState.errors.lista_reus?.message}
                    </FieldMessage.Error.Text>
                  </FieldMessage.Error.Root>
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
                      <FieldMessage.Error.Root>
                        <Select
                          {...formBag.register('objeto')}
                          value={values.objeto}
                          onValueChange={(value) => {
                            formBag.setValue('objeto', value);
                            formBag.clearErrors('objeto');
                          }}>
                          <SelectTrigger className={formBag.formState.errors.objeto ? "border-red-500" : ""}>
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
                        <FieldMessage.Error.Text visible={!!formBag.formState.errors.objeto}>
                          {formBag.formState.errors.objeto?.message}
                        </FieldMessage.Error.Text>
                      </FieldMessage.Error.Root>
                    </div>
                    <div>
                      <Label className="block text-sm mb-1">Número da reserva</Label>
                      <Input
                        type="text"
                        placeholder="Número da reserva"
                        className="w-full p-2 border rounded-md text-sm"
                        {...formBag.register('numero_reserva')}
                        onChange={handleNumeroReservaChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="resumo_processo">Transcrição da reclamação</Label>
                      <FieldMessage.Error.Root>
                        <Textarea
                          id="resumo_processo"
                          rows={8}
                          placeholder="Digite a transcrição da reclamação..."
                          className={`w-full  ${formBag.formState.errors.resumo_processo ? "border-red-500" : ""}`}
                          {...formBag.register('resumo_processo')}
                          onChange={(e) => {
                            formBag.setValue('resumo_processo', e.target.value);
                            formBag.clearErrors('resumo_processo');
                          }}
                        />
                        <FieldMessage.Error.Text visible={!!formBag.formState.errors.resumo_processo}>
                          {formBag.formState.errors.resumo_processo?.message}
                        </FieldMessage.Error.Text>
                      </FieldMessage.Error.Root>
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
                      <FieldMessage.Error.Root>
                        <Select
                          {...formBag.register('causa_raiz')}
                          value={values.causa_raiz}
                          onValueChange={handleCausaRaizChange}>
                          <SelectTrigger className={formBag.formState.errors.causa_raiz ? "border-red-500" : ""}>
                            <SelectValue placeholder="Selecione a causa raiz" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[300px]">
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
                        <FieldMessage.Error.Text visible={!!formBag.formState.errors.causa_raiz}>
                          {formBag.formState.errors.causa_raiz?.message}
                        </FieldMessage.Error.Text>
                      </FieldMessage.Error.Root>
                    </div>

                    {/* Dropdown condicional para casos de voo */}
                    {values.causa_raiz && dicionarioPalavrasRelacionadaVoos.includes(values.causa_raiz) && (
                      <div>
                        <Label className="block text-sm mb-1">Subcausa</Label>
                        <Select
                          {...formBag.register('sub_causa_raiz')}
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
                  <Button type="button" variant="outline" disabled={isLoadingForm} onClick={handleClickSair}>
                    {isDesvinculandoUsuario ? 'Saindo...' : 'Sair'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={isEnviandoExcecao}
                    onClick={handleClickEnviarExcecao}>
                    {isEnviandoExcecao ? 'Enviando...' : 'Enviar para exceção oito'}
                  </Button>

                  <Button type="button" variant="outline" disabled={isSavingForm} onClick={handleClickSalvar}>
                    {isSavingForm ? 'Salvando...' : 'Salvar'}
                  </Button>

                  <Button 
                    type="submit" 
                    disabled={
                      isEnviandoProximaEtapa || 
                      isSavingForm || 
                      Object.keys(formBag.formState.errors).length > 0 
                    }
                  >
                    {isEnviandoProximaEtapa ? 'Submetendo...' : 'Submeter'}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </CardContent>
      </Card>

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
