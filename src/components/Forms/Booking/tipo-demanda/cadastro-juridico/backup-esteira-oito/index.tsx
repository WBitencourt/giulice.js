'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { convertBRLCurrencyToNumber, formatNumberBRLCurrency } from '@/utils/String';
import { Textarea } from '@/components/ui/textarea';
import { FieldMessage } from '@/components/FieldMessage';
import { util } from '@/utils';
import { fileHelper } from '@/utils/File';
import { toast } from '@/utils/toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { picklist } from '../../../picklists';
import { DatePicker } from '@/components/ui/date-picker';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { maskCpfCnpj, maskEmail, maskCurrencyBRL, maskNumeroProcesso, maskPhone } from '@/utils/Masks';
import { Input } from '@/components/ui/input';
import { cn } from '@/utils/ClassName';
import { DetalhesCadastro } from '@/components/Forms/util/Components/DetalhesCadastro';
import { actions } from '@/actionsV2';

import {
  DemandaCadastroJuridico,
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
  Briefcase,
  FileSignature,
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
import { DadosProcesso } from '@/actionsV2/backend/demanda';
import { ArquivoDemanda } from '@/actions/backend/interface';

interface CadastroJuridicoParams {
  id: string;
  esteira: string;
  esteiraTipo: string;
  dadosIniciais: DemandaCadastroJuridico;
}

interface FormCadastroJuridicoBookingEsteiraOitoProps {
  params: CadastroJuridicoParams;
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

export function FormCadastroJuridicoBookingEsteiraOito({ params }: FormCadastroJuridicoBookingEsteiraOitoProps) {
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

  const formBag = useForm<DemandaCadastroJuridico>({
    defaultValues: {
      observacao: [],
      tipificacao: '',
      desdobramento: false,
      processo_originario: '',
      nome_desdobramento: '',
      tipo_acao: 'Indenizatória',
      acao: 'Indenizatória',
      tipo_acao2: '',
      procedimento: '',
      uf: '',
      cidade: '',
      orgao_tribunal: '',
      processo: '',
      objeto: '',
      lista_pedidos: [],
      data_distribuicao: '',
      data_distribuicao_desdobramento: '',
      resumo_processo: '',
      causa_raiz: '',
      sub_causa_raiz: '',
      prazo_liminar: '',
      prazo_tipo: 'dias_corridos',
      prazo_contestacao: '',
      data_audiencia: '',
      lista_autores: [],
      lista_reus: [],
      valor_causa: maskCurrencyBRL('0'),
      conteudo_liminar: '',
    },
  });

  const values = formBag.watch();

  const [fileViewer, setFileViewer] = useState({
    url: '',
    name: '',
    s3Key: '',
    s3Bucket: '',
  });

  const [dadosProcesso, setDadosProcesso] = useState<ProcessoInfo[]>([]);
  const [initialUploadList, setInitialUploadList] = useState<FormFile[] | null>(null);

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

  const dicionarioPalavrasRelacionadaVoos = ['Flight'];

  const [isLoadingForm, setIsLoadingForm] = useState(true);
  const [isLoadingFileViewer, setIsLoadingFileViewer] = useState(true);
  const [isLoadingFileUrl, setIsLoadingFileUrl] = useState(false);
  const [isConsultandoProcesso, setIsConsultandoProcesso] = useState(false);
  const [isOpenInitialUploadList, setIsOpenInitialUploadList] = useState<boolean>(false);
  const [isPausedCountDown, setIsPausedCountDown] = useState<boolean>(false);
  const [isSavingForm, setIsSavingForm] = useState(false);
  const [isAddingObsForm, setIsAddingObsForm] = useState(false);
  const [isUploadLimitReached, setIsUploadLimitReached] = useState(false);
  const [isEnviandoExcecao, setIsEnviandoExcecao] = useState(false);
  const [isSubmetendoDesdobramento, setIsSubmetendoDesdobramento] = useState(false);
  const [isDesvinculandoUsuario, setIsDesvinculandoUsuario] = useState(false);
  const [isJustificandoEnvio, setIsJustificandoEnvio] = useState(false);

  const [dialogObservacaoOpen, setDialogObservacaoOpen] = useState(false);
  const [dialogJustificarEnvioOpen, setDialogJustificarEnvioOpen] = useState(false);

  const dateNow = useMemo(() => new Date(), []);

  const formatInitialFormValues = useCallback((values: Partial<DemandaCadastroJuridico>) => {
    const formattedValues = {
      ...values,
    } as DemandaCadastroJuridico;

    //formattedValues.data_audiencia = values?.data_audiencia ? new Date(values?.data_audiencia).toISOString() : calcularDataMinimaAudiencia();
    formattedValues.processo = maskNumeroProcesso(values?.processo);
    formattedValues.processo_originario = maskNumeroProcesso(values?.processo_originario);
    formattedValues.valor_causa = values?.valor_causa ? formatNumberBRLCurrency(values?.valor_causa.toString()) : '';
    formattedValues.lista_pedidos = values?.lista_pedidos
      ? values?.lista_pedidos.map((item) => {
          return {
            id: item?.id ?? uuid(),
            descricao: item.descricao,
            valor: formatNumberBRLCurrency(item.valor.toString()),
          };
        })
      : [];
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
    formattedValues.prazo_tipo = values?.prazo_tipo ? values?.prazo_tipo : 'horas_corridas';

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
    (newValues: Partial<DemandaCadastroJuridico>) => {
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
      await actions.backend.demanda.desbloqueiaUsuarioDemanda({ pk });
    } catch (error: any) {
      throw new Error(error?.message);
    }
  };

  const formularioValido = (dados: DemandaCadastroJuridico) => {
    const erros: Record<string, string> = {}

    if (!dados.tipificacao) {
      erros.tipificacao = 'Tipificação é obrigatória';
    }

    if (!dados.tipo_acao2) {
      erros.tipo_acao2 = 'Tipo de ação 2 é obrigatório';
    }

    if (dados.tipo_acao2?.trim() && !options.tipo_acao2.find((item) => item.value === dados.tipo_acao2?.trim())) {
      erros.tipo_acao2 = `"${dados.tipo_acao2?.trim()}" não está entre as opções disponíveis, e por isso o campo não está preenchido.`
    }

    if (!dados.procedimento) {
      erros.procedimento = 'Procedimento é obrigatório';
    }

    if (!dados.uf) {
      erros.uf = 'UF é obrigatória';
    }

    if (dados.uf?.trim() && !picklist.ufs.find((uf) => uf.nome === dados.uf?.trim())) {
      erros.uf = `"${dados.uf?.trim()}" não está entre as opções disponíveis, e por isso o campo UF não está preenchido, por favor selecione uma UF válida.`;
    }

    if (!dados.cidade) {
      erros.cidade = 'Cidade é obrigatória';
    }

    if (!dados.orgao_tribunal) {
      erros.orgao_tribunal = 'Órgão/Tribunal é obrigatório';
    }

    if (!dados.data_distribuicao) {
      erros.data_distribuicao = 'Data de distribuição é obrigatória';
    }

    if (!dados.resumo_processo) {
      erros.resumo_processo = 'Resumo do processo é obrigatório';
    }

    if (convertBRLCurrencyToNumber(dados.valor_causa) <= 0) {
      erros.valor_causa = 'Valor da causa deve ser maior que R$ 0,00';
    }

    if (!dados.objeto) {
      erros.objeto = 'Objeto é obrigatório';
    }

    if (!dados.causa_raiz) {
      erros.causa_raiz = 'Causa raiz é obrigatória';
    }

    // Validação de listas
    if (!dados.lista_autores || dados.lista_autores.length === 0) {
      erros.lista_autores = 'É necessário adicionar pelo menos 1 autor';
    }

    if (!dados.lista_reus || dados.lista_reus.length === 0) {
      erros.lista_reus = 'É necessário adicionar pelo menos 1 réu';
    }

    if (!dados.lista_pedidos || dados.lista_pedidos.length === 0) {
      erros.lista_pedidos = 'É necessário adicionar pelo menos 1 pedido';
    }

    if (Object.keys(erros).length > 0) {
      const dicionarioCamposRequired = {
        tipificacao: 'Tipificação',
        tipo_acao2: 'Tipo de ação 2',
        procedimento: 'Procedimento',
        uf: 'UF',
        cidade: 'Cidade',
        orgao_tribunal: 'Órgão/Tribunal',
        data_distribuicao: 'Data de distribuição',
        resumo_processo: 'Resumo do processo',
        valor_causa: 'Valor da causa',
        objeto: 'Objeto',
        causa_raiz: 'Causa raiz',
        lista_autores: 'Detalhes do autor',
        lista_reus: 'Detalhes do réu',
        lista_pedidos: 'Pedidos',
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
      formBag.setError(campo as keyof DemandaCadastroJuridico, { type: 'required', message: mensagem });
    });

    return Object.keys(erros).length === 0;
  };

  const formularioDesdobramentoValido = (dados: DemandaCadastroJuridico) => {
    const erros: Record<string, string> = {};

    if (dados.desdobramento !== true) { 
      erros.desdobramento = 'Desdobramento é obrigatório, ative o checkbox para continuar';
    }

    if (!dados.processo) {
      erros.processo = 'Processo é obrigatório';
    }

    if (!dados.tipificacao) {
      erros.tipificacao = 'Tipificação é obrigatória';
    }

    if (!dados.processo_originario) {
      erros.processo_originario = 'Processo originário é obrigatório';
    }

    if (!dados.nome_desdobramento) {
      erros.nome_desdobramento = 'Nome do desdobramento é obrigatório';
    }

    if (!dados.data_distribuicao_desdobramento) {
      erros.data_distribuicao_desdobramento = 'Data de distribuição do desdobramento é obrigatória';
    }

    if (Object.keys(erros).length > 0) {
      const dicionarioCamposRequired = {
        desdobramento: 'Desdobramento',
        processo: 'NUP (LA)',
        processo_originario: 'Número do processo originário',
        tipificacao: 'Tipificação',
        nome_desdobramento: 'Nome do desdobramento',
        data_distribuicao_desdobramento: 'Data de distribuição do desdobramento',
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
      formBag.setError(campo as keyof DemandaCadastroJuridico, { type: 'required', message: mensagem });
    });

    return Object.keys(erros).length === 0;
  };

  const onSubmitDesdobramento = async (dados: DemandaCadastroJuridico) => {
    try {
      setIsSubmetendoDesdobramento(true);

      formBag.clearErrors();

      const formValido = formularioDesdobramentoValido(dados);

      if (!formValido) {
        return;
      }

      await salvarDesdobramento();

      const dadosSubmeter = await actions.backend.demanda.submeterDesdobramentoDemanda({ pk, dados });

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
      setIsSubmetendoDesdobramento(false);
    }
  };

  const onSubmit = async (dados: DemandaCadastroJuridico) => {
    try {
      formBag.clearErrors();

      const formValido = formularioValido(dados);

      if (!formValido) {
        return;
      }

      await saveForm();

      const dadosSubmeter = await actions.backend.demanda.submeterDemanda({ pk, dados });

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
    }
  };

  const handleClickSubmeterDesdobramento = async () => {
    await onSubmitDesdobramento(formBag.getValues());
  }

  const consultarProcesso = async (): Promise<DadosProcesso[]> => {
    try {
      setIsConsultandoProcesso(true);

      const processo = formBag.getValues('processo');

      if (!processo) {
        throw new Error('Número do processo não informado corretamente.');
      }

      const dadosProcesso = await actions.backend.demanda.consultarDadosProcesso({
        processo,
        pk,
      });

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

  const handleConsultaProcesso = async () => {
    try {
      formBag.clearErrors('uf');
      formBag.clearErrors('cidade');
      formBag.clearErrors('orgao_tribunal');
      formBag.clearErrors('vara');

      const dadosProcesso = await consultarProcesso();

      console.log('Dados do processo:', dadosProcesso);

      const dadosProcessoFormatted = dadosProcesso.map((item) => {
        return {
          ...item,
          uf: item.uf ? item.uf : '',
          orgao_tribunal: item.tribunal ? item.tribunal : '',
          comarca: item.comarca ? item.comarca : '',
          vara: item.vara ? item.vara : '',
          foro: item.foro ? item.foro : '',
        };
      });

      setDadosProcesso(dadosProcessoFormatted);

      //formBag.setValue('cidade', '');
      formBag.setValue('orgao_tribunal', '');
      formBag.setValue('vara', '');

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
        title: 'Tempo esgotado!',
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

  const handleClickSalvarDesdobramento = async () => {
    try {
      await salvarDesdobramento();
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

      const pedidosSelecionados = formBag.getValues('lista_pedidos');

      const dados = {
        ...formBag.getValues(),
        valor_causa: convertBRLCurrencyToNumber(values.valor_causa),
        lista_pedidos: pedidosSelecionados?.map((item) => {
          return {
            descricao: item.descricao,
            valor: convertBRLCurrencyToNumber(item.valor),
          };
        }),
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

  const salvarDesdobramento = async () => {
    const values = formBag.getValues();

    try {
      setIsSavingForm(true);

      const dados = {
        processo: values.processo,
        tipificacao: values.tipificacao,
        processo_originario: values.processo_originario,
        nome_desdobramento: values.nome_desdobramento,
        data_distribuicao_desdobramento: values.data_distribuicao_desdobramento,
      };

      console.log('Valores do formulário para salvar desdobramento:', dados);

      await actions.backend.demanda.salvarDesdobramentoDemanda({
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

  const adicionaObservacao = async () => {
    try {
      setIsAddingObsForm(true);

      if (!user?.email) {
        throw new Error('E-mail do usuário não carregado na autenticação corretamente');
      }

      await actions.backend.demanda.adicionaObservacaoDemanda({
        pk,
        observacao: dialogObservacaoInfo.observacao.value,
      });

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
    } finally {
      setIsEnviandoExcecao(false);
    }
  };

  const getDadosCliente = async () => {
    try {
      const cliente = dadosIniciais?.cliente;

      if (!cliente) {
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

  const handleDesdobramentoChange = () => {
    formBag.clearErrors();

    const newState = !formBag.getValues('desdobramento');

    formBag.setValue('desdobramento', newState);

    if (newState) {
      formBag.setValue('processo_originario', '');
    }
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

    const cidades = await actions.backend.local.getCidadesPorUf({ uf });

    updateOpcoesProcesso({ cidade: cidades });
  };

  const updateTribunaisPorUf = async (uf: string) => {
    if (!uf) {
      return;
    }

    const ufs = dadosProcesso.filter((dado) => dado.uf === uf);

    const tribunais = [...new Set(ufs.map((dado) => dado.tribunal))];
    updateOpcoesProcesso({ orgao_tribunal: tribunais });
  };

  const updateVarasPorUf = async (uf: string) => {
    if (!uf) {
      return;
    }

    const ufs = dadosProcesso.filter((dado) => dado.uf === uf);

    const varas = [...new Set(ufs.map((dado) => dado.vara))];
    updateOpcoesProcesso({ vara: varas });
  };

  const handleUfChange = (newValue: string) => {
    const novaUf = newValue;

    formBag.setValue('uf', novaUf);

    updateCidadesPorUf(novaUf);
    updateTribunaisPorUf(novaUf);
    updateVarasPorUf(novaUf);

    formBag.setValue('cidade', '');
    formBag.setValue('orgao_tribunal', '');
    formBag.setValue('vara', '');

    formBag.clearErrors('uf');
  };

  const handlePrazoTipoChange = () => {
    const prazoTipo = formBag.getValues('prazo_tipo');

    if (prazoTipo === 'dias_corridos') {
      formBag.setValue('prazo_tipo', 'horas_corridas');
    }

    if (prazoTipo === 'horas_corridas') {
      formBag.setValue('prazo_tipo', 'dias_corridos');
    }
  };

  const handleAdicionarPedido = () => {
    if (!pedidos.descricao || !pedidos.valor) {
      toast.warning({
        title: 'Aviso!',
        description: 'Por favor, preencha todos os campos do pedido',
      });
      return;
    }

    const listaPedidos = formBag.getValues('lista_pedidos') ?? [];

    formBag.setValue('lista_pedidos', [
      ...listaPedidos,
      {
        id: uuid(),
        descricao: pedidos.descricao,
        valor: pedidos.valor,
      },
    ]);
    formBag.clearErrors('lista_pedidos');

    updatePedidos({ descricao: '', valor: '0' });
  };

  const handleRemoverPedido = (id: string) => {
    const listaPedidos = formBag.getValues('lista_pedidos');
    const novaLista = listaPedidos?.filter((prevPedido) => prevPedido.id !== id);
    formBag.setValue('lista_pedidos', novaLista);
    if (novaLista?.length === 0) {
      formBag.setError('lista_pedidos', { type: 'required', message: 'É necessário adicionar pelo menos 1 pedido' });
    }
  };

  const handleCausaRaizChange = (value: string) => {
    formBag.setValue('causa_raiz', value);

    if (!dicionarioPalavrasRelacionadaVoos.includes(value)) {
      formBag.setValue('sub_causa_raiz', '');
    }

    formBag.clearErrors('causa_raiz');
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
    const lista_autores = formBag.getValues('lista_autores');
    const novaLista = lista_autores?.filter((prevAutor) => prevAutor.id !== id);
    formBag.setValue('lista_autores', novaLista);
    if (novaLista?.length === 0) {
      formBag.setError('lista_autores', { type: 'required', message: 'É necessário adicionar pelo menos 1 autor' });
    }
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
    formBag.clearErrors('lista_reus');

    // Limpar os campos após adicionar
    updateInputReu({
      nome: '',
      documento: '',
    });
  };

  const handleRemoverReu = (id: string) => {
    const lista_reus = formBag.getValues('lista_reus');
    const novaLista = lista_reus?.filter((prevReu) => prevReu.id !== id);
    formBag.setValue('lista_reus', novaLista);
    if (novaLista?.length === 0) {
      formBag.setError('lista_reus', { type: 'required', message: 'É necessário adicionar pelo menos 1 réu' });
    }
  };

  const handleNumeroReservaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove qualquer caractere não numérico
    if (value === '' || parseInt(value) > 0) {
      formBag.setValue('numero_reserva', value);
    }
  };

  const handlePrazoLiminarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove qualquer caractere não numérico
    if (value === '' || parseInt(value) > 0) {
      formBag.setValue('prazo_liminar', value);
    }
  };

  const handlePrazoContestacaoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove qualquer caractere não numérico
    if (value === '' || parseInt(value) > 0) {
      formBag.setValue('prazo_contestacao', value);
    }
  };

  const handleDataDistribuicaoDesdobramentoChange = (selectedDate: Date | undefined) => {
    formBag.clearErrors('data_distribuicao_desdobramento');

    if (!selectedDate) {
      formBag.setValue('data_distribuicao_desdobramento', '');
      return;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (selectedDate >= today) {
      toast.warning({
        title: 'Aviso!',
        description: 'A data de distribuição não pode ser igual ou superior a data atual.',
      });

      formBag.setError('data_distribuicao_desdobramento', {
        message: 'A data de distribuição não pode ser igual ou superior a data atual.',
      });

      return;
    }

    formBag.setValue('data_distribuicao_desdobramento', selectedDate.toISOString());
  };

  const handleNomeDesdobramentoChange = (value: string) => {
    formBag.setValue('nome_desdobramento', value);

    formBag.clearErrors('nome_desdobramento');
  };

  const handleProcessoOriginarioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    formBag.setValue('processo_originario', maskNumeroProcesso(event.currentTarget.value))

    formBag.clearErrors('processo_originario');
  };

  const handleTipificacaoChange = (value: string) => {
    formBag.setValue('tipificacao', value);
    formBag.clearErrors('tipificacao');
  };

  const handleProcessoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    formBag.setValue('processo', maskNumeroProcesso(event.currentTarget.value))

    formBag.clearErrors('processo');
  };

  const handleDataDistribuicaoChange = (selectedDate: Date | undefined) => {
    formBag.clearErrors('data_distribuicao');

    if (!selectedDate) {
      formBag.setValue('data_distribuicao', '');
      return;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (selectedDate >= today) {
      toast.warning({
        title: 'Aviso!',
        description: 'A data de distribuição não pode ser igual ou superior a data atual.',
      });

      formBag.setError('data_distribuicao', {
        message: 'A data de distribuição não pode ser igual ou superior a data atual.',
      });
      return;
    }

    formBag.setValue('data_distribuicao', selectedDate.toISOString());
  };

  const handleDataCitacaoChange = (selectedDate: Date | undefined) => {
    if (!selectedDate) {
      formBag.setValue('data_citacao', '');
      return;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (selectedDate >= today) {
      toast.warning({
        title: 'Aviso!',
        description: 'A data de distribuição não pode ser igual ou superior a data atual.',
      });
      return;
    }

    formBag.setValue('data_citacao', selectedDate.toISOString());
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
        timeOut: dadosCliente?.time_out?.['Cadastro Jurídico'],
      });

      updateInitialFormValues(dadosIniciais);

      updateOpcoesProcesso({
        uf: picklist.ufs.map((uf) => uf.nome),
        orgao_tribunal: picklist.orgaoTribunal,
        vara: dadosIniciais?.vara ? [dadosIniciais.vara] : [],
        foro: dadosIniciais?.foro ? [dadosIniciais.foro] : [],
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

  const options = {
    tipo_acao2: [
      {
        label: 'Consumidor',
        value: 'Consumidor',
      },
      {
        label: 'Parceiro',
        value: 'Parceiro',
      },
    ],
  };

  useEffect(() => {
    if (dadosProcesso.length > 0) {
      const ufs = [...new Set(dadosProcesso.map((item) => item.uf))];

      const previousUf = formBag.getValues('uf') ?? '';
      const selectedUf = ufs.length === 1 ? ufs[0] : '';

      formBag.setValue('uf', ufs.includes(previousUf) ? previousUf : selectedUf);

      updateOpcoesProcesso({
        uf: ufs.length > 0 ? ufs : picklist.ufs.map((uf) => uf.nome),
      });

      updateCidadesPorUf(selectedUf);
      updateTribunaisPorUf(selectedUf);
      updateVarasPorUf(selectedUf);
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
                                  selected={fileViewer.url === file.info.url}
                                >
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
                                    className=""
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
                  <span>NUP</span>
                </h3>

                <div className="space-y-4 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md">
                  <FieldMessage.Error.Root>
                    <Label className="block text-sm mb-1">NUP (LA)</Label>
                    <div className="flex items-center">
                      <Input
                        type="text"
                        placeholder="Número de processo padrão CNJ"
                        className={`w-full p-2 border rounded-l-md text-sm ${formBag.formState.errors.processo ? 'border-red-500' : ''}`}
                        value={values.processo}
                        onChange={handleProcessoChange}
                      />
                      <button
                        className={`bg-blue-500 text-white px-3 py-2 rounded-r-md text-sm flex items-center ${
                          isConsultandoProcesso ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                        onClick={handleConsultaProcesso}
                        disabled={isConsultandoProcesso}>
                        {isConsultandoProcesso ? (
                          <span>Consultando...</span>
                        ) : (
                          <>
                            <Search className="w-4 h-4 mr-1" /> Consultar
                          </>
                        )}
                      </button>
                    </div>
                    <FieldMessage.Error.Text>
                      {formBag.formState.errors.processo?.message}
                    </FieldMessage.Error.Text>
                  </FieldMessage.Error.Root>

                  <div className="space-y-2">
                    <Label htmlFor="tipificacao">Tipificação</Label>
                    <FieldMessage.Error.Root>
                      <Select
                        value={values.tipificacao}
                        onValueChange={handleTipificacaoChange}>
                        <SelectTrigger className={formBag.formState.errors.tipificacao ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Selecione uma tipificação" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="Citação/Intimação">Citação/Intimação</SelectItem>
                        <SelectItem value="Documentos/íntegra do processo">Documentos/íntegra do processo</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldMessage.Error.Text>
                        {formBag.formState.errors.tipificacao?.message}
                      </FieldMessage.Error.Text>
                    </FieldMessage.Error.Root>
                  </div>

                  <div className="flex items-center justify-between">
                    <Label className="text-sm">Desdobramento</Label>
                    <div
                      className={`relative inline-block w-10 h-5 rounded-full transition-colors duration-200 ease-in-out ${
                        values.desdobramento ? 'bg-blue-500' : 'bg-gray-300'
                      }`}
                      onClick={handleDesdobramentoChange}>
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

                  {/* Campo condicional que aparece quando Desdobramento está ativado */}
                  {values.desdobramento && (
                    <div className="mt-3 pl-4 border-l-2 border-blue-300 space-y-4">
                      <FieldMessage.Error.Root>
                        <div>
                          <Label className="block text-sm mb-1">Número do processo originário</Label>
                          <Input
                            type="text"
                            placeholder="Número de processo originário CNJ"
                            value={values.processo_originario}
                            className={`w-full p-2 border rounded-md text-sm ${formBag.formState.errors.processo_originario ? 'border-red-500' : ''}`}
                            onChange={handleProcessoOriginarioChange}
                          />
                        </div>
                        <FieldMessage.Error.Text>
                          {formBag.formState.errors.processo_originario?.message}
                        </FieldMessage.Error.Text>
                      </FieldMessage.Error.Root>

                      <FieldMessage.Error.Root>
                        <div className="space-y-2">
                          <Label htmlFor="nome_desdobramento">Nome do desdobramento</Label>
                          <Select
                            value={values.nome_desdobramento}
                            onValueChange={handleNomeDesdobramentoChange}>
                            <SelectTrigger className={formBag.formState.errors.nome_desdobramento ? 'border-red-500' : ''}>
                              <SelectValue placeholder="Selecione um desdobramento" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Agravo de Instrumento.">Agravo de Instrumento.</SelectItem>
                              <SelectItem value="Carta Precatória">Carta Precatória</SelectItem>
                              <SelectItem value="Cumprimento de Sentença">Cumprimento de Sentença</SelectItem>
                              <SelectItem value="Recurso Inominado">Recurso Inominado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <FieldMessage.Error.Text>
                          {formBag.formState.errors.nome_desdobramento?.message}
                        </FieldMessage.Error.Text>
                      </FieldMessage.Error.Root>


                      <div className="space-y-2">
                        <Label htmlFor="data_distribuicao_desdobramento">Data de distribuição do desdobramento</Label>
                        <FieldMessage.Error.Root>
                          <div className="group flex gap-2 items-center">
                            <DatePicker
                              date={values.data_distribuicao_desdobramento ? new Date(values.data_distribuicao_desdobramento) : undefined}
                              onSelect={(selectedDate) => {
                                handleDataDistribuicaoDesdobramentoChange(selectedDate);
                              }}
                            />
                            <X
                              onClick={() => formBag.setValue('data_distribuicao_desdobramento', '')}
                              className="w-4 h-4 cursor-pointer text-gray-400 hover:text-red-500"
                            />
                          </div>
                          <FieldMessage.Error.Text>
                            {formBag.formState.errors.data_distribuicao_desdobramento?.message}
                          </FieldMessage.Error.Text>
                        </FieldMessage.Error.Root>
                      </div>
                      <div className="flex justify-center space-x-2">
                        <Button 
                          type="button" 
                          variant="outline" 
                          disabled={isSavingForm} 
                          onClick={handleClickSalvarDesdobramento}
                        >
                          {isSavingForm ? 'Salvando...' : 'Salvar desdobramento'}
                        </Button>

                        <Button 
                          type="button" 
                          disabled={isSubmetendoDesdobramento || Object.keys(formBag.formState.errors).length > 0}
                          onClick={handleClickSubmeterDesdobramento}
                        >
                          {isSubmetendoDesdobramento ? 'Submetendo...' : 'Submeter desdobramento'}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Divisão Detalhes da Ação */}
              <div>
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-green-500" />
                  <span>Detalhes da Ação</span>
                </h3>

                <div className="space-y-4 bg-green-50 dark:bg-green-950/30 p-3 rounded-md">
                  <div>
                    <Label className="block text-sm mb-1">Tipo de ação</Label>
                    <Input
                      type="text"
                      value={values.tipo_acao}
                      disabled
                      className="w-full p-2 bg-gray-100 dark:bg-gray-900 border rounded-md text-sm"
                    />
                  </div>

                  <div>
                    <Label className="block text-sm mb-1">Ação</Label>
                    <Input
                      type="text"
                      value={values.acao}
                      disabled
                      className="w-full p-2 bg-gray-100 dark:bg-gray-900 border rounded-md text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tipo_acao2">Tipo de ação 2</Label>
                    <FieldMessage.Error.Root>
                      <Select
                        value={values.tipo_acao2}
                        disabled={values.desdobramento}
                        onValueChange={(value) => {
                          formBag.setValue('tipo_acao2', value);
                          formBag.clearErrors('tipo_acao2');
                        }}>
                        <SelectTrigger className={formBag.formState.errors.tipo_acao2 ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Selecione o tipo de ação 2" />
                        </SelectTrigger>
                        <SelectContent>
                          {options.tipo_acao2.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldMessage.Error.Text>
                        {formBag.formState.errors.tipo_acao2?.message}
                      </FieldMessage.Error.Text>
                    </FieldMessage.Error.Root>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="procedimento">Procedimento</Label>
                    <FieldMessage.Error.Root>
                      <Select
                        value={values.procedimento}
                        disabled={values.desdobramento}
                        onValueChange={(value) => {
                          formBag.setValue('procedimento', value);
                          formBag.clearErrors('procedimento');
                        }}>
                        <SelectTrigger className={formBag.formState.errors.procedimento ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Selecione um procedimento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Cível">Cível</SelectItem>
                          <SelectItem value="Juizado Especial Cível">Juizado Especial Cível</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldMessage.Error.Text>
                        {formBag.formState.errors.procedimento?.message}
                      </FieldMessage.Error.Text>
                    </FieldMessage.Error.Root>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="uf">UF</Label>
                    <FieldMessage.Error.Root>
                      <Select
                        value={values.uf}
                        disabled={values.desdobramento}
                        onValueChange={(value) => {
                          handleUfChange(value);
                        }}>
                        <SelectTrigger className={formBag.formState.errors.uf ? 'border-red-500' : ''}>
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
                      <FieldMessage.Error.Text>
                        {formBag.formState.errors.uf?.message}
                      </FieldMessage.Error.Text>
                    </FieldMessage.Error.Root>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <FieldMessage.Error.Root>
                      <Select
                        value={values.cidade}
                        disabled={values.desdobramento}
                        onValueChange={(value) => {
                          formBag.setValue('cidade', value);
                          formBag.clearErrors('cidade');
                        }}>
                        <SelectTrigger className={formBag.formState.errors.cidade ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Selecione uma cidade" />
                        </SelectTrigger>
                        <SelectContent>
                          {opcoesProcesso.cidade.map((cidade) => (
                            <SelectItem key={cidade} value={cidade}>
                              {cidade}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldMessage.Error.Text>
                        {formBag.formState.errors.cidade?.message}
                      </FieldMessage.Error.Text>
                    </FieldMessage.Error.Root>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="orgao_tribunal">Órgão / Tribunal</Label>
                    <FieldMessage.Error.Root>
                      <Select
                        value={values.orgao_tribunal}
                        disabled={values.desdobramento}
                        onValueChange={(value) => {
                          formBag.setValue('orgao_tribunal', value);
                          formBag.clearErrors('orgao_tribunal');
                        }}>
                        <SelectTrigger className={formBag.formState.errors.orgao_tribunal ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Selecione um Órgão / Tribunal" />
                        </SelectTrigger>
                        <SelectContent>
                          {opcoesProcesso.orgao_tribunal.map((orgao_tribunal) => (
                            <SelectItem key={orgao_tribunal} value={orgao_tribunal}>
                              {orgao_tribunal}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldMessage.Error.Text>
                        {formBag.formState.errors.orgao_tribunal?.message}
                      </FieldMessage.Error.Text>
                    </FieldMessage.Error.Root>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="data_distribuicao">Data de Distribuição</Label>
                    <FieldMessage.Error.Root>
                      <div className="group flex gap-2 items-center">
                        <DatePicker
                          disabled={values.desdobramento}
                          date={values.data_distribuicao ? new Date(values.data_distribuicao) : undefined}
                          onSelect={(selectedDate) => {
                            handleDataDistribuicaoChange(selectedDate);
                          }}
                        />
                        <X
                          onClick={() => formBag.setValue('data_distribuicao', '')}
                          className="w-4 h-4 cursor-pointer text-gray-400 hover:text-red-500"
                        />
                      </div>
                      <FieldMessage.Error.Text>
                        {formBag.formState.errors.data_distribuicao?.message}
                      </FieldMessage.Error.Text>
                    </FieldMessage.Error.Root>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="data_citacao">Data de citação</Label>
                    <div className="group flex gap-2 items-center">
                      <DatePicker
                        disabled={values.desdobramento}
                        date={values.data_citacao ? new Date(values.data_citacao) : undefined}
                        onSelect={handleDataCitacaoChange}
                      />
                      <X
                        onClick={() => formBag.setValue('data_citacao', '')}
                        className="w-4 h-4 cursor-pointer text-gray-400 hover:text-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="block text-sm mb-1">Resumo do processo</Label>
                    <FieldMessage.Error.Root>
                      <Textarea
                        id="resumo_processo"
                        disabled={values.desdobramento}
                        value={values.resumo_processo}
                        onChange={(e) => {
                          formBag.setValue('resumo_processo', e.target.value);
                          formBag.clearErrors('resumo_processo');
                        }}
                        rows={4}
                        className={`bg-white dark:bg-black ${formBag.formState.errors.resumo_processo ? 'border-red-500' : ''}`}
                      />
                      <FieldMessage.Error.Text>
                        {formBag.formState.errors.resumo_processo?.message}
                      </FieldMessage.Error.Text>
                    </FieldMessage.Error.Root>
                  </div>

                  <div>
                    <Label className="block text-sm mb-1">Valor de causa</Label>
                    <FieldMessage.Error.Root>
                      <Input
                        type="text"
                        disabled={values.desdobramento}
                        value={values.valor_causa}
                        placeholder="R$ 0,00"
                        className={`w-full p-2 border rounded-md text-sm ${
                          formBag.formState.errors.valor_causa ? 'border-red-500' : ''
                        }`}
                        onChange={(event) => {
                          const value = event.target.value;
                          const formattedValue = maskCurrencyBRL(value);
                          formBag.setValue('valor_causa', formattedValue);
                          formBag.clearErrors('valor_causa');
                        }}
                      />
                      <FieldMessage.Error.Text>
                        {formBag.formState.errors.valor_causa?.message}
                      </FieldMessage.Error.Text>
                    </FieldMessage.Error.Root>
                  </div>

                  <div>
                    <Label className="block text-sm mb-1">Prazo para cumprimento da liminar</Label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="text"
                        placeholder="Prazo"
                        disabled={values.desdobramento}
                        className="w-24 p-2 border rounded-md text-sm"
                        {...formBag.register('prazo_liminar')}
                        onChange={handlePrazoLiminarChange}
                      />
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs ${
                            values.prazo_tipo === 'dias_corridos' ? 'text-gray-500' : 'text-blue-600 font-medium'
                          }`}>
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
                        <span
                          className={`text-xs ${
                            values.prazo_tipo === 'dias_corridos' ? 'text-blue-600 font-medium' : 'text-gray-500'
                          }`}>
                          dias corridos
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="block text-sm mb-1">Conteúdo da liminar</Label>
                    <Textarea
                      {...formBag.register('conteudo_liminar')}
                      id="conteudo_liminar"
                      disabled={values.desdobramento}
                      rows={3}
                      placeholder="Transcrição da liminar deferida"
                      className="bg-white dark:bg-black"
                    />
                  </div>

                  <div>
                    <Label className="block text-sm mb-1">
                      Prazo para apresentar contestação (dias corridos)
                    </Label>
                    <Input
                      type="text"
                      disabled={values.desdobramento}
                      placeholder="Prazo em dias"
                      className="w-full p-2 border rounded-md text-sm"
                      {...formBag.register('prazo_contestacao')}
                      onChange={handlePrazoContestacaoChange}
                    />
                  </div>

                  <FieldMessage.Error.Root>
                      <div className="space-y-2">
                        <Label htmlFor="data_audiencia">Data da audiência</Label>
                        <div className="group flex gap-2 items-center">
                          <DateTimePicker
                            date={values.data_audiencia ? new Date(values.data_audiencia) : undefined}
                            onSelect={handleDataAudienciaChange}
                            disabled={values.desdobramento}
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
                        disabled={values.desdobramento} 
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
                        disabled={values.desdobramento}
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
                        disabled={values.desdobramento}
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
                        disabled={values.desdobramento}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAdicionarAutor}
                      disabled={values.desdobramento}
                      className="w-full bg-purple-500 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
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
                        disabled={values.desdobramento}
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
                        disabled={values.desdobramento}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAdicionarReu}
                      disabled={values.desdobramento}
                      className="w-full bg-orange-500 text-white px-4 py-2 rounded-md text-sm hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
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
                  <FieldMessage.Error.Text>
                    {formBag.formState.errors.lista_reus?.message}
                  </FieldMessage.Error.Text>
                </FieldMessage.Error.Root>
              </div>


              {/* Divisão Objetos */}
              <div>
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-cyan-500" />
                  <span>Objetos</span>
                </h3>
                <div className="space-y-4 bg-cyan-50 dark:bg-cyan-950/30 p-3 rounded-md">
                  <div className="flex flex-col gap-2">
                    <Label className="block text-sm mb-1">Objeto</Label>
                    <FieldMessage.Error.Root>
                      <Select 
                        onValueChange={(value) => {
                          formBag.setValue('objeto', value);
                          formBag.clearErrors('objeto');
                        }} 
                        disabled={values.desdobramento}
                        value={values.objeto}>
                        <SelectTrigger className={formBag.formState.errors.objeto ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Selecione o objeto" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Passagem aérea">Passagem aérea</SelectItem>
                          <SelectItem value="Parceiro">Parceiro</SelectItem>
                          <SelectItem value="Hospedagem">Hospedagem</SelectItem>
                          <SelectItem value="Aluguel de carro">Aluguel de carro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FieldMessage.Error.Text>
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
                      disabled={values.desdobramento}
                    />
                  </div>
                </div>
              </div>

              {/* Divisão Pedidos */}
              <div>
                <FieldMessage.Error.Root>
                  <div className="flex items-center gap-2 mb-3">
                    <List className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Pedidos</h3>
                  </div>
                  <div
                    className={cn(
                      'space-y-4 bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-md',
                      formBag.formState.errors.lista_pedidos ? 'border border-red-500' : ''
                    )}>
                    <div className="space-y-2">
                      <Label htmlFor="pedido">Pedidos</Label>
                      <Select 
                        value={pedidos.descricao} 
                        onValueChange={(value) => updatePedidos({ descricao: value })} 
                        disabled={values.desdobramento}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um pedido" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dano material">Dano material</SelectItem>
                          <SelectItem value="Dano moral">Dano moral</SelectItem>
                          <SelectItem value="Devolução em Dobro">Devolução em Dobro</SelectItem>
                          <SelectItem value="Obrigação de fazer">Obrigação de fazer</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label className="block text-sm mb-1">Valor do pedido</Label>
                      <Input
                        type="text"
                        value={pedidos.valor}
                        placeholder="0,00"  
                        disabled={values.desdobramento}
                        className="w-full p-2 border rounded-md text-sm"
                        onChange={(event) => {
                          const value = event.target.value;
                          const formattedValue = maskCurrencyBRL(value); // Formata o valor para BRL

                          updatePedidos({ valor: formattedValue });
                        }}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleAdicionarPedido}
                      disabled={values.desdobramento}
                      className="w-full bg-indigo-500 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                      <Plus className="w-4 h-4" />
                      Adicionar pedido
                    </button>

                    {values?.lista_pedidos && values?.lista_pedidos?.length > 0 && (
                      <div className="mt-4">
                        <div className="bg-gray-50 dark:bg-gray-950/30 rounded-md border">
                          <div className="p-3 border-b bg-gray-100 dark:bg-gray-950/30">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Pedidos adicionados</h4>
                          </div>
                          <div className="divide-y">
                            {values?.lista_pedidos?.map((pedido, index) => (
                              <div
                                key={pedido.id}
                                className="p-3 flex items-center justify-between dark:bg-black hover:bg-gray-100 hover:dark:bg-gray-950">
                                <div className="flex-1">
                                  <p className="text-sm">{pedido.descricao}</p>
                                  <p className="text-sm">{maskCurrencyBRL(pedido.valor)}</p>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoverPedido(pedido.id)}
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
                    {formBag.formState.errors.lista_pedidos?.message}
                  </FieldMessage.Error.Text>
                </FieldMessage.Error.Root>
              </div>

              {/* Divisão Causa Raiz */}
              <div>
                <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <GitBranch className="w-5 h-5 mr-2 text-rose-500" />
                  <span>Causa Raiz</span>
                </h3>
                <div className="space-y-4 bg-rose-50 dark:bg-rose-950/30 p-3 rounded-md">
                  <div className="space-y-2">
                    <Label htmlFor="causa_raiz">Causa Raiz</Label>
                    <FieldMessage.Error.Root>
                      <Select
                        value={values.causa_raiz}
                        disabled={values.desdobramento}
                        onValueChange={(value) => {
                          handleCausaRaizChange(value);
                        }}>
                        <SelectTrigger className={formBag.formState.errors.causa_raiz ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Selecione uma causa raiz" />
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
                      <FieldMessage.Error.Text>
                        {formBag.formState.errors.causa_raiz?.message}
                      </FieldMessage.Error.Text>
                    </FieldMessage.Error.Root>
                  </div>

                  {/* Dropdown condicional para casos de voo */}
                  {values.causa_raiz && dicionarioPalavrasRelacionadaVoos.includes(values.causa_raiz) && (
                    <div className="space-y-2">
                      <Label htmlFor="sub_causa_raiz">Subcausa</Label>
                      <FieldMessage.Error.Root>
                        <Select
                          value={values.sub_causa_raiz || ''}
                          onValueChange={(value) => {
                            formBag.setValue('sub_causa_raiz', value);
                            formBag.clearErrors('sub_causa_raiz');
                          }}>
                          <SelectTrigger className={formBag.formState.errors.sub_causa_raiz ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Selecione uma subcausa" />
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
                        <FieldMessage.Error.Text>
                          {formBag.formState.errors.sub_causa_raiz?.message}
                        </FieldMessage.Error.Text>
                      </FieldMessage.Error.Root>
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

                <Button type="button" variant="outline" disabled={isEnviandoExcecao} onClick={handleClickEnviarExcecao}>
                  {isEnviandoExcecao ? 'Enviando...' : 'Enviar para exceção oito'}
                </Button>

                <Button type="button" variant="outline" disabled={isSavingForm} onClick={handleClickSalvar}>
                  {isSavingForm ? 'Salvando...' : 'Salvar'}
                </Button>

                <Button 
                  type="submit" 
                  disabled={formBag.formState.isSubmitting || Object.keys(formBag.formState.errors).length > 0 || values.desdobramento}
                >
                  {formBag.formState.isSubmitting ? 'Submetendo...' : 'Submeter'}
                </Button>
              </div>
            </form>
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
