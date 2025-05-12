'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useShallow } from "zustand/shallow";
import { useResourcesStore } from "@/zustand-store/resources";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Upload } from "@/components/Upload2.0";
import * as Icon from '@phosphor-icons/react';
import { PDFViewer } from "@/components/PDFViewer";
import { FileItem, UpdateFile, UploadRootHandles } from "@/components/Upload2.0/contexts";
import { BasicInfoForm } from "./BasicInfoForm";
import { ContractTable } from "./ContractTable";
import { ProcessInfoForm } from "./ProcessInfoForm";
import { AdditionalInfoForm } from "./AdditionalInfoForm";
import Countdown from "@/components/Countdown";
import { toast } from "@/utils/toast";
import { DetalheObjetoForm } from "./DetalheObjetoForm";
import { Skeleton } from "@/components/Skeleton2.0";
import { useAuthStore } from "@/zustand-store/auth.store";
import { convertBRLCurrencyToNumber, formatNumberBRLCurrency } from "@/utils/String";
import { Textarea } from "@/components/ui/textarea";
import { FieldMessage } from "@/components/FieldMessage";
import { util } from "@/utils";
import { maskCpfCnpj, maskNumeroProcesso, maskOAB } from "@/utils/Masks";
import { AdvogadoForm } from "./AdvogadoForm";
import { fileHelper } from "@/utils/File";
import { ArquivoDemanda } from "@/actions/backend/interface";

import {
  DemandaCadastroJuridicoReturn,
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
  ContratoDemanda,
  UpdateContrato,
  ExcecaoInfo,
  ObservacaoInfo,
  DadosDemandaReturn
} from "../../interfaces";

import {
  adicionaObservacaoDemanda,
  enviarDemandaExcecaoOito,
  getDadosDemandaEsteiraOito,
  submeterDemanda,
  salvarDemanda,
  desbloqueiaUsuarioDemanda,
  consultarDadosProcesso,
  selecionaDadoProcesso,
} from "@/actions/backend/demanda";

import {
  getDadosAutor,
  selecionaContrato,
  enviarDesdobramentoProcesso,
} from "@/actions/backend/cliente/return";

export interface FormValues extends DemandaCadastroJuridicoReturn {
  escritorio: string[]; // Sobrescreve a propriedade
}

interface CadastroJuridicoReturnParams {
  id: string;
  esteira: string;
  esteiraTipo: string;
  dadosIniciais?: DemandaCadastroJuridicoReturn;
}

interface FormCadastroJuridicoReturnEsteiraOitoProps {
  params: CadastroJuridicoReturnParams;
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
}

export function FormCadastroJuridicoReturnEsteiraOito({ params }: FormCadastroJuridicoReturnEsteiraOitoProps) {
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

  const formBag = useForm<FormValues>();

  const [urlPdfViewer, setUrlPdfViewer] = useState<string>('');
  const [processoInfos, setProcessoInfos] = useState<ProcessoInfo[]>([]);
  const [uploadList, setInitialUploadList] = useState<FormFile[]>([]);

  const [excecaoDialogInfo, setExcecaoDialogInfo] = useState<ExcecaoInfo>({
    justificativa: {
      value: '',
      isValid: false,
    }
  });

  const [dialogObservacaoInfo, setDialogObservacaoInfo] = useState<ObservacaoInfo>({
    observacao: {
      value: '',
      isValid: false,
    }
  })

  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isLoadingFileViewer, setIsLoadingFileViewer] = useState(false);
  const [isConsultandoAutor, setIsConsultandoAutor] = useState(false);
  const [isConsultandoProcesso, setIsConsultandoProcesso] = useState(false);
  const [isSelecionandoContrato, setIsSelecionandoContrato] = useState(false);
  const [isOpenUploadList, setIsOpenUploadList] = useState<boolean>(false);
  const [isPausedCountDown, setIsPausedCountDown] = useState<boolean>(false);
  const [isSavingForm, setIsSavingForm] = useState(false);
  const [isAddingObsForm, setIsAddingObsForm] = useState(false);
  const [isEnviandoExcecao, setIsEnviandoExcecao] = useState(false);
  const [isEnviandoProximaEtapa, setIsEnviandoProximaEtapa] = useState(false);
  const [isDisabledUpload, setIsDisabledUpload] = useState(false);
  const [isEnviandoDesdobramento, setIsEnviandoDesdobramento] = useState(false);
  const [isDesvinculandoUsuario, setIsDesvinculandoUsuario] = useState(false);
  const [isLoadingFileUrl, setIsLoadingFileUrl] = useState(false);

  const [dialogProcessoOpen, setDialogProcessoOpen] = useState(false);
  const [dialogExcecaoOpen, setDialogExcecaoOpen] = useState(false);
  const [dialogObservacaoOpen, setDialogObservacaoOpen] = useState(false);
  const [dialogEnviarDesdobramentoOpen, setDialogEnviarDesdobramentoOpen] = useState(false);

  const dateNow = useMemo(() => new Date(), []);

  const formatFormValues = useCallback((values: Partial<DemandaCadastroJuridicoReturn>) => {
    const formattedValues = {
      ...values,
    } as FormValues;

    const getEscritorio = () => {
      const escritorio = values?.escritorio;

      if (!escritorio) {
        return [];
      }

      if (Array.isArray(escritorio)) {
        return escritorio.map((item) =>
          typeof item === 'object' ? item?.officeName || '' : item || ''
        );
      }

      if (typeof escritorio === 'object') {
        return escritorio?.officeName ? [escritorio?.officeName] : [];
      }

      if (typeof escritorio === 'string') {
        return [escritorio]
      }

      return [];
    }

    formattedValues.valor_causa = formatNumberBRLCurrency(values?.valor_causa?.toString());
    formattedValues.data_citacao = values?.data_citacao ? new Date(values?.data_citacao).toISOString() : undefined;
    formattedValues.data_audiencia = values?.data_audiencia ? new Date(values?.data_audiencia).toISOString() : undefined;
    formattedValues.data_liminar = values?.data_liminar ? new Date(values?.data_liminar).toISOString() : undefined;
    formattedValues.data_citacao_positiva = values?.data_citacao_positiva ? new Date(values?.data_citacao_positiva).toISOString() : undefined;
    formattedValues.prazo_contestacao = values?.prazo_contestacao ? values?.prazo_contestacao?.toString() : '15';
    formattedValues.prazo_liminar = values?.prazo_liminar?.toString() ?? "0";
    formattedValues.andamento_cedente_assumiu_demanda = values?.andamento_cedente_assumiu_demanda ?? false;
    formattedValues.processo = maskNumeroProcesso(values?.processo);
    formattedValues.documento_autor = maskCpfCnpj(values?.documento_autor);
    formattedValues.documento_advogado = maskOAB(values?.documento_advogado);
    formattedValues.escritorio = getEscritorio();
    formattedValues.contrato = values?.contrato?.map((contrato) => ({
      ...contrato,
      bindingId: contrato.bindingId ?? contrato.binding_id ?? 0,
      ContratoOriginal: contrato.ContratoOriginal ?? contrato.contrato_original ?? '',
      debtId: contrato.debtId ?? contrato.debit_id,
      portfolioName: contrato.portfolioName ?? contrato.portfolio_name,
      PrimeiroAtraso: contrato.PrimeiroAtraso ?? contrato.primeiro_atraso,
      SaldoOriginal: contrato.SaldoOriginal ?? contrato.saldo_original,
      
      selected: contrato.selected,
      located: contrato.located,
    }));

    console.log('Valores NAO formatados:', values);
    console.log('Valores formatados:', formattedValues);

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
          }
        }
      }
  
      return {
        ...prevState,
        ...newState,
      };
    });
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
        }) || []
      );

      if (initialUploadList.length === 0) {
        setInitialUploadList([]);

        setUrlPdfViewer('');

        return;
      }

      setInitialUploadList(initialUploadList);

      const firstItemUploadConfigList = initialUploadList.find((item) => item.info.url.length > 0);

      setUrlPdfViewer(firstItemUploadConfigList?.info.url ?? '');

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

      setIsDisabledUpload(isFileSizeExceeded);

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

  const updateFormValues = useCallback((newValues: Partial<DemandaCadastroJuridicoReturn>) => {
    try {
      //console.log('Dados recebidos para atualizar o formulário:', newValues);

      const oldValues = formBag.getValues();

      const formattedValues = formatFormValues({
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
  }, [formatFormValues, formBag.getValues, formBag.reset]);

  const desbloqueiaDemanda = async () => {
    try {
      await desbloqueiaUsuarioDemanda({ pk })
    } catch(error: any) {
      throw new Error(error?.message);
    }
  }

  const handleUpdateContrato = async ({
    selectedContrato,
    rowIndex,
    checked,
    pk,
  }: UpdateContrato) => {
    try {
      setIsSelecionandoContrato(true);

      if (!user?.email) {
        throw new Error('E-mail do usuário não carregado na autenticação corretamente'); 
      }

      //await saveForm();

      const contratos = formBag.getValues('contrato') as ContratoDemanda[];

      if (!contratos) {
        return;
      }
  
      const responseSelectContract = await selecionaContrato({
        pk, 
        bindingId: selectedContrato.bindingId.toString(),
      });

      util.actions.checkHaveError(responseSelectContract?.data);

      toast.success({
  title: 'Sucesso',
  description: `Contrato ${checked ? 'selecionado' : 'desconsiderado'} com sucesso.`,
});

      const responseDadosEsteiraOito = await getDadosDemandaEsteiraOito({ pk });
      const dadosEsteiraOito = util.actions.convertResponseActionData(responseDadosEsteiraOito?.data);

      console.log('Novos dados esteira oito:', dadosEsteiraOito);

      if (!dadosEsteiraOito) {
        return;
      }

      updateFormValues({
        ...dadosEsteiraOito,
        portfolio: dadosEsteiraOito?.portfolio ?? [],
      });
    } catch (error: any) {
      toast.error({
  title: 'Erro',
  description: error?.message,
});
    } finally {
      setIsSelecionandoContrato(false);
    }
  };

  const handleConsultarAutor = async () => {
    try {
      setIsConsultandoAutor(true);

      const documentoAutor = formBag.getValues('documento_autor');

      if (!documentoAutor) {
        throw new Error('Documento do autor não informado corretamente.');
      }

      if (!user?.email) {
        throw new Error('E-mail do usuário não carregado na autenticação corretamente'); 
      }

      await saveForm();

      const response = await getDadosAutor({
        pk,
        cpfCnpj: documentoAutor,
      });

      util.actions.checkHaveError(response?.data);

      const responseDadosEsteiraOito = await getDadosDemandaEsteiraOito({ pk });
      const dadosEsteiraOito = util.actions.convertResponseActionData(responseDadosEsteiraOito?.data);

      console.log('Novos dados esteira oito:', dadosEsteiraOito);

      if (!dadosEsteiraOito) {
        return;
      }

      updateFormValues(dadosEsteiraOito);

      toast.success({
  title: 'Sucesso',
  description: 'Informações do autor e campos do formulário atualizados com sucesso.',
});
    } catch (error: any) {
      toast.error({
  title: 'Erro',
  description: error?.message,
});
    } finally {
      setIsConsultandoAutor(false);
    }
  };

  const formularioValido = (dados: DemandaCadastroJuridicoReturn) => {
    const erros: Record<string, string> = {}

    if (!dados.nome_autor) {
      erros.nome_autor = 'Nome do Autor é obrigatório';
    }

    if (!dados.documento_autor) {
      erros.documento_autor = 'Documento do Autor é obrigatório';
    }

    if (!dados.nome_advogado) {
      erros.nome_advogado = 'Nome do Advogado é obrigatório';
    }

    if (!dados.documento_advogado) {
      erros.documento_advogado = 'OAB do Advogado é obrigatória';
    }

    if (!dados.empresa_fundo) {
      erros.empresa_fundo = 'Empresa Fundo é obrigatória';
    }

    if (!dados.uf) {
      erros.uf = 'UF é obrigatória';
    }

    if (!dados.tribunal) {
      erros.tribunal = 'Tribunal é obrigatório';
    }

    if (!dados.comarca) {
      erros.comarca = 'Comarca é obrigatória';
    }

    if (!dados.foro) {
      erros.foro = 'Foro é obrigatório';
    }

    if (!dados.vara) {
      erros.vara = 'Vara é obrigatória';
    }

    if (!dados.tipo_justica) {
      erros.tipo_justica = 'Tipo de Justiça é obrigatório';
    }

    if (!dados.tipo_acao) {
      erros.tipo_acao = 'Tipo da ação é obrigatório';
    }

    if (!dados.causa_pedir) {
      erros.causa_pedir = 'Causa pedir é obrigatória';
    }

    if (!dados.detalhe_objeto || dados.detalhe_objeto.trim() === '') {
      erros.detalhe_objeto = 'Detalhe do objeto é obrigatório';
    }

    if (!dados.data_distribuicao) {
      erros.data_distribuicao = 'Data de Distribuição é obrigatória';
    }

    const valorCausa = convertBRLCurrencyToNumber(dados.valor_causa || '');
    if (!dados.valor_causa || valorCausa <= 0) {
      erros.valor_causa = 'Valor da causa deve ser maior que R$ 0,00';
    }

    if (Object.keys(erros).length > 0) {
      const dicionarioCamposRequired = {
        nome_autor: 'Nome do Autor',
        documento_autor: 'Documento do Autor',
        oab_advogado: 'OAB do Advogado',
        empresa_fundo: 'Empresa Fundo',
        uf: 'UF',
        tribunal: 'Tribunal',
        comarca: 'Comarca',
        vara: 'Vara',
        foro: 'Foro',
        tipo_justica: 'Tipo de Justiça',
        tipo_acao: 'Tipo da ação',
        causa_pedir: 'Causa pedir',
        detalhe_objeto: 'Detalhe do objeto',
        data_distribuicao: 'Data de Distribuição',
        valor_causa: 'Valor da causa',
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
      formBag.setError(campo as keyof DemandaCadastroJuridicoReturn, { type: 'required', message: mensagem });
    });

    return Object.keys(erros).length === 0;
  };

  const onSubmit = async (dados: DemandaCadastroJuridicoReturn) => {
    try {
      setIsEnviandoProximaEtapa(true);

      formBag.clearErrors();

    
      // Validação de campos obrigatórios
      const formValido = formularioValido(dados);

      if (!formValido) {
        return;
      }

      await saveForm();

      const response = await submeterDemanda({ pk, dados });

      const dadosSubmeter = util.actions.convertResponseActionData(response?.data);

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
    } finally { 
      setIsEnviandoProximaEtapa(false);
    }
  };

  const handleConsultaProcesso = async () => {
    try {
      setIsConsultandoProcesso(true);

      const processo = formBag.getValues('processo');

      if (!processo) {
        throw new Error('Número do processo não informado corretamente.');
      }

      if (!user?.email) {
        throw new Error('E-mail do usuário não carregado na autenticação corretamente'); 
      }

      const response = await consultarDadosProcesso({
        processo,
        pk
      });

      const dadosProcesso = util.actions.convertResponseActionData(response?.data) ?? [];

      setProcessoInfos(dadosProcesso);
      setDialogProcessoOpen(true);

      toast.success({
  title: 'Sucesso',
  description: 'Consulta do processo realizada com sucesso.',
});
    } catch (error: any) {
      toast.error({
  title: 'Erro',
  description: error?.message,
});
    } finally {
      setIsConsultandoProcesso(false);
    }
  };

  const handleSelecionarProcesso = async (processoInfo: ProcessoInfo) => {
    try {
      if (!user?.email) {
        throw new Error('E-mail do usuário não carregado na autenticação corretamente'); 
      }

      const response = await selecionaDadoProcesso({
        dado: processoInfo,
        pk,
      });

      util.actions.checkHaveError(response?.data);

      updateFormValues({
        uf: processoInfo.uf,
        tribunal: processoInfo.tribunal,
        comarca: processoInfo.comarca,
        vara: processoInfo.vara,
        foro: processoInfo.foro,
      });

      setDialogProcessoOpen(false);

      toast.success({
  title: 'Sucesso',
  description: 'Processo selecionado com sucesso.',
});
    } catch (error: any) {
      toast.error({
  title: 'Erro',
  description: error?.message,
});
    }
  };

  const handleClickFile = async (params: HandleClickFileParams) => {
    if (params.file.info.url.length > 0) {
      setUrlPdfViewer(params.file.info.url);

      return;
    }

    setIsLoadingFileUrl(true);

    try {
      const urlFile = await arquivo.getFileUrlFromS3({
        s3Key: params.file.info.s3Key,
        s3Bucket: params.file.info.s3Bucket,
      });
  
      setUrlPdfViewer(urlFile);

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
      }
    }

    updateFile(file.id, {
      newFile
    })

    return newFile;
  }

  const onUploadProgress = ({ file, event, updateFile }: OnUploadProgressProps) => {
    const progress = parseInt(
      Math.round((event.loaded * 100) / event.total
      ).toString())

    const newFile: FileItem<FormFile> = {
      ...file,
      status: {
        ...file.status,
        success: undefined,
        progress,
      }
    }

    updateFile(file.id, {
      newFile
    })
  }

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
      }
    }

    updateFile(file.id, {
      newFile
    })
  }

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
      }
    })

    uploadFiles({
      files: newFiles,
    });
  }

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
      }
    })

    uploadFiles({
      files: newFiles,
    });
  }

  const handleProcessUpload = async ({ file, updateFile }: OnProcessUpdateProps) => {
    try {
      setIsPausedCountDown(true);

      if (file.status.success === false) {
        return onUploadError({ file })
      }

      const currentList = uploadRef.current?.list ?? [];

      const totalFilesSizeInBytes = currentList.reduce((acc, file) => acc + fileHelper.convertToBytes({
        size: file.info.size,
        unit: file.info.unit,
      }), 0);

      const isFileSizeExceeded = fileHelper.isFileSizeExceeded({ 
        unit: 'B', 
        size: totalFilesSizeInBytes, 
        limit: {
          unit: 'B',
          size: fileHelper.convertToBytes({ size: 20, unit: 'MB' }),
        } 
      })

      setIsDisabledUpload(isFileSizeExceeded);

      if(isFileSizeExceeded) {
        toast.warning({
  title: 'Aviso',
  description: 'Aviso: Limite total de 20MB de arquivos atingido.',
});
      }

      // if (isFileSizeExceeded) {
      //   return onUploadError({ 
      //     file: {
      //       ...file,
      //       status: {
      //         ...file.status,
      //         success: false,
      //         progress: 100,
      //         message: 'A soma dos arquivos excede o limite de 20MB',
      //       },
      //       allow: {
      //         ...file.allow,
      //         retryUpload: true,
      //         delete: true,
      //       }
      //     }
      //    })
      // }

      const submittedFile = await arquivo.submitFile({
        demandaPk: pk,
        file: {
          name: file.info.name,
          dropzoneFile: file.dropzoneFile as File,
        },
        onUploadProgress: (event) => onUploadProgress({
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
      }

      updateFile(file.id, {
        newFile
      })
    } catch (error: any) {
      processUploadError({
        file,
        updateFile,
        message: error?.message
      })
      toast.error({
  title: 'Erro',
  description: 'Falha ao enviar o arquivo. Por favor, tente novamente.',
});
    } finally {
      setIsPausedCountDown(false);
    }
  }

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
        newFile: { ...file, status: { ...file.status, isDeleting: true } }
      });

      await arquivo.deleteFile({
        demandaPk: pk,
        demandaSk: file.id
      });

      removeFile(file.id);

      setUrlPdfViewer('');
    } catch (error: any) {
      toast.error({
  title: 'Erro',
  description: error?.message,
});
    } finally {
      updateFile(file.id, {
        newFile: { ...file, status: { ...file.status, isDeleting: false } }
      });
    }
  }

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
      }
    });
  }

  const handleFinalCountDown = async () => {
    try {
      await saveForm();
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

  const handleClickSalvar = async () => {
    try {
      await saveForm();
    } catch (error: any) { 
      toast.error({
  title: 'Erro',
  description: error?.message,
});
    } finally {
      setIsSavingForm(false);
    }
  }

  const saveForm = async () => {
    try {
      setIsSavingForm(true);

      if (!user?.email) {
        throw new Error('E-mail do usuário não carregado na autenticação corretamente'); 
      }

      const dados = {
        ...formBag.getValues(),
        valor_causa: convertBRLCurrencyToNumber(formBag.getValues('valor_causa')),
      }

      console.log('Valores do formulário para salvar:', dados);

      const response = await salvarDemanda({
        pk,
        dados,
      });

      util.actions.checkHaveError(response?.data);

      toast.success({
  title: 'Sucesso',
  description: 'Formulário salvo com sucesso.',
});
    } catch (error: any) { 
      toast.error({
  title: 'Erro',
  description: error?.message,
});
    } finally {
      setIsSavingForm(false);
    }
  }

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

      updateFormValues({
        observacao: [
          ...oldObservacoes,
          {
            mensagem: dialogObservacaoInfo.observacao.value,
            criada_por: user?.email,
            criada_em: dateNow.toISOString(),
          }
        ]
      });

      toast.success({
  title: 'Sucesso',
  description: 'Observação adicionada com sucesso.',
});
    } catch (error: any) { 
      toast.error({
  title: 'Erro',
  description: error?.message,
});
    } finally {
      setIsAddingObsForm(false);
    }
  }

  const handleClickEnviarExcecao = () => {
    setDialogExcecaoOpen(true);
  }

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
  title: 'Sucesso',
  description: 'Desdobramento alterado com sucesso, a página será recarregada',
});

      router.push(`/${esteira}/${esteiraTipo}/demanda/${pk}`);
    } catch (error: any) {
      toast.error({
  title: 'Erro',
  description: error?.message,
});
    } finally {
      setIsEnviandoDesdobramento(false);
      setDialogEnviarDesdobramentoOpen(false);
    }
  }

  const handleClickEnviarDesdobramento = () => {
    setDialogEnviarDesdobramentoOpen(true);
  }

  const handleClickConfirmaEnviarExcecao = async () => {
    try {
      setIsEnviandoExcecao(true);

      if (!user?.email) {
        throw new Error('E-mail do usuário não carregado na autenticação corretamente'); 
      }

      await saveForm();

      const response = await enviarDemandaExcecaoOito({
        pk,
        justificativa: excecaoDialogInfo.justificativa.value,
      });

      util.actions.checkHaveError(response?.data);

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
      setDialogExcecaoOpen(false);
    }
  }
  
  const handleClickAdicionaObservacao = () => {
    setDialogObservacaoOpen(true);
  }

  const handleClickConfirmaAdicionaObservacao = async () => {
    try {
      setIsAddingObsForm(true);

      if (!user?.email) {
        throw new Error('E-mail do usuário não carregado na autenticação corretamente'); 
      }

      await adicionaObservacao()
    } catch (error: any) { 
      toast.error({
  title: 'Erro',
  description: error?.message,
});
    } finally {
      setIsAddingObsForm(false);
      setDialogObservacaoOpen(false);
    }
  }

  const handleClickSair = async () => {
    try {
      setIsDesvinculandoUsuario(true);

      await desbloqueiaDemanda();

      router.push(`/${esteira}/${esteiraTipo}`);
    } catch (erro: any) {
      toast.error({
  title: 'Erro',
  description: erro?.message,
});
    }
  }

  const atualizaFormDadosIniciais = useCallback(async () => {
    try {
      setIsLoadingForm(true);
      setIsLoadingFileViewer(true);

      console.log('Dados recebidos:', dadosIniciais);

      if (!dadosIniciais) {
        return
      }

      updateFormValues(dadosIniciais);

      await carregarArquivosDemanda(dadosIniciais?.arquivos);
    } catch (error: any) {
      toast.error({
        title: 'Erro',
        description: error?.message,
      });
    } finally {
      setIsLoadingForm(false);
      setIsLoadingFileViewer(false);
    }
  }, [updateFormValues, carregarArquivosDemanda]);

  useEffect(() => {
    atualizaFormDadosIniciais();
  }, []);

  return (
    <div className="flex w-full h-full gap-4">
      <Card
        style={{ maxHeight: 'calc(100vh - 136px)' }}
        className="sticky top-[72px] w-1/2 gap-4 p-2 rounded bg-zinc-100 dark:bg-zinc-800"
      >
        {
          isLoadingFileViewer ? (
            <Skeleton.Root className='w-full h-full'>
              <Skeleton.Custom className='w-full h-full' />
            </Skeleton.Root>
          ) : (
            <div className="flex flex-col w-full h-full gap-2">
              {
                isDisabledUpload ? (
                  <span className='text-xs text-orange-500 dark:text-yellow-600 bg-zinc-200 dark:bg-zinc-900 rounded p-2'>
                    Aviso: Limite total de 20MB de arquivos atingido.
                  </span>
                ) : null
              }

              <Upload.Bag
                ref={uploadRef}
                visible
                initialList={uploadList}
                onProcessUpload={async (file, updateFile) => {
                  handleProcessUpload({ file, updateFile })
                }}
              >
                {
                  ({ list, uploadFiles, removeFile, retryUpload, updateFile }) => {
                    return (
                      <Upload.Root
                        data-open={isOpenUploadList}
                        className="data-[open=true]:h-1/2"
                      >
                        <Upload.Drop.Root>
                          <Upload.Drop.Dropzone
                            maxSizeFile='20MB'
                            maxFiles={undefined}
                            onDropAccepted={(event, files) => {
                              handleOnDropAccepted({ files, uploadFiles })
                            }}
                            onDropRejected={(event, files) => {
                              handleOnDropRejected({ files, uploadFiles })
                            }}
                            filesAccept={{
                              'application/pdf': ['.pdf'],
                              'text/plain': ['.txt'],
                            }}
                          >
                            {(dropzoneBag) => {
                              return (
                                <Upload.Drop.Drag.Root>
                                  <Upload.Drop.Drag.View
                                    dropzoneBag={dropzoneBag}
                                  />
                                  {/* {
                                    isDisabledUpload ? (
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
                              )
                            }}
                          </Upload.Drop.Dropzone>

                          <Upload.Drop.Info.TooltipIcon />
                        </Upload.Drop.Root>

                        <Upload.List.ToggleOpen
                          show={isOpenUploadList}
                          onClick={(open) => setIsOpenUploadList(open)}
                        >
                          <Upload.List.Root className="min-h-[130px]">
                            {
                              list.sort((a, b) => sortListFiles(a, b)).map((file) => {
                                return (
                                  <Upload.List.Row.Root
                                    key={file.id}
                                    className='cursor-pointer'
                                    onClick={() => handleClickFile({
                                      file,
                                      updateFile,
                                    })}
                                  >
                                    <Upload.List.Row.Name
                                      tooltip={file.info.name}
                                      selected={urlPdfViewer.length > 0 && urlPdfViewer === file.info.url}
                                    >
                                      {
                                        urlPdfViewer.length > 0 && urlPdfViewer === file.info.url ?
                                          <div className="flex items-center gap-1">
                                            <Icon.CaretCircleRight
                                              className='flex-shrink-0 text-blue-500'
                                              weight='fill'
                                            />

                                            {file.info.name}
                                          </div>
                                          :
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
                                              <Upload.List.Row.Action.Status.Success
                                                tooltip={file.status.message}
                                              />
                                              :
                                              <>
                                                {
                                                  file.allow.retryUpload &&
                                                  <Upload.List.Row.Action.Retry
                                                    onClick={() => {
                                                      handleClickRetryUpload({
                                                        file,
                                                        retryUpload,
                                                      })
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
                                    
                                    {/* <Upload.List.Row.Preview.Root>
                                      <Icon.FileText
                                        className='self-center text-3xl text-black dark:text-white'
                                        weight='thin'
                                      />
                                    </Upload.List.Row.Preview.Root> */}

                                    {/* <Upload.List.Row.Description>
                                      Upload por: { file.info.uploadedBy }
                                      <br />
                                      Em: { moment(file.info.uploadedAt).locale('pt-br').format('DD/MM/YYYY HH:mm')}
                                    </Upload.List.Row.Description> */}

                                    <Upload.List.Row.Size className='row-span-2'>
                                      { file.info.sizeFormatted }
                                    </Upload.List.Row.Size>

                                    {
                                      <Upload.List.Row.Remove
                                        disabled={!file.allow.delete || file.status.isDeleting}
                                        onClick={() => {
                                          handleClickDeleteFile({
                                            file,
                                            removeFile,
                                            updateFile,
                                          })
                                        }}
                                      >
                                        {
                                          file.status.isDeleting ?
                                            <Icon.CircleNotch
                                              className="animate-spin text-red-500 text-sm"
                                              weight='bold'
                                            />
                                            :
                                            <span>
                                              Remover
                                            </span>

                                        }
                                      </Upload.List.Row.Remove>
                                    }
                                  </Upload.List.Row.Root>
                                )
                              })
                            }
                          </Upload.List.Root>
                        </Upload.List.ToggleOpen>
                      </Upload.Root>
                    )
                  }
                }
              </Upload.Bag>

              {
                isLoadingFileUrl ? (
                  <Skeleton.Root className="w-full h-full">
                    <Skeleton.Custom className="w-full h-full" />
                  </Skeleton.Root>
                ) : (
                  <PDFViewer 
                    data-open={isOpenUploadList} 
                    className="data-[open=true]:h-1/2" 
                    source={urlPdfViewer} 
                  />
                )
              }
            </div>
          )
        }
      </Card>

      <Card className="flex flex-col w-1/2 gap-4 py-4 h-full overflow-y-auto">
        <CardContent className="flex flex-col gap-4 h-full">
          <Countdown 
            label='Tempo restante para preenchimento:'
            paused={isPausedCountDown}
            time={{
              now: dateNow.toISOString(),
              start: dateNow.toISOString(),
              deadline: moment(dateNow).add(10, 'minutes').toISOString(),
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
                <BasicInfoForm
                  formBag={formBag}
                  isConsultandoAutor={isConsultandoAutor}
                  onClickAdicionarObservacao={handleClickAdicionaObservacao}
                  onClickConsultarAutor={handleConsultarAutor}
                />
   
                <ContractTable 
                  formBag={formBag}
                  isSelecionandoContrato={isSelecionandoContrato}
                  updateContrato={handleUpdateContrato} 
                  pk={pk} 
                />  

                <AdvogadoForm 
                  formBag={formBag}
                />

                <ProcessInfoForm 
                  formBag={formBag}
                  handleClickEnviarDesdobramento={handleClickEnviarDesdobramento}
                  isEnviandoDesdobramento={isEnviandoDesdobramento}
                  handleConsultaProcesso={handleConsultaProcesso} 
                  isConsultandoProcesso={isConsultandoProcesso}
                />

                <DetalheObjetoForm 
                  formBag={formBag}
                />

                <AdditionalInfoForm 
                  formBag={formBag}
                />

                {
                  isDisabledUpload ? (
                    <span className='text-sm text-orange-500 dark:text-yellow-600 bg-zinc-200 dark:bg-zinc-900 rounded p-2'>
                      Aviso: Limite total de 20MB de arquivos atingido.
                    </span>
                  ) : null
                }

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
                    disabled={isEnviandoProximaEtapa || Object.keys(formBag.formState.errors).length > 0}
                  >
                    { isEnviandoProximaEtapa ? 'Submetendo...' : 'Submeter' }
                  </Button>
                </div>
              </form>
            )
          }
        </CardContent>
      </Card>

      <Dialog
        open={dialogEnviarDesdobramentoOpen}
        onOpenChange={setDialogEnviarDesdobramentoOpen}
      >
        <DialogContent 
          aria-describedby='dialog-enviar-desdobramento'
          className="flex flex-col gap-4"
        >
          <DialogHeader>
            <DialogTitle>Desdobramento</DialogTitle>
          </DialogHeader>

          <span>
            Tem certeza que deseja alterar o número do processo? Os dados preenchidos serão salvos e enviados.
          </span>

          <DialogFooter>
            <Button 
              variant='outline'
              onClick={() => setDialogEnviarDesdobramentoOpen(false)}
            >
              Cancelar
            </Button>

            <Button 
              disabled={isEnviandoDesdobramento}
              onClick={handleConfirmaEnviarDesdobramento}
            >
              { isEnviandoDesdobramento ? 'Alterando...' : 'Alterar' }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogObservacaoOpen}
        onOpenChange={setDialogObservacaoOpen}
      >
        <DialogContent 
          aria-describedby='dialog-observacao'
          className="flex flex-col gap-4"
        >
          <DialogHeader>
            <DialogTitle>Adicionar observação</DialogTitle>
          </DialogHeader>

          <FieldMessage.Error.Root>  
            <Textarea 
              id="observacao" 
              rows={6} 
              className="bg-white dark:bg-black"
              onChange={(event) => updateDialogObservacaoInfo({ 
                observacao: {
                  value: event.target.value,
                  isValid: event.target.value.length >= 10,
                }
              })}
              value={dialogObservacaoInfo.observacao.value} 
            />
            <FieldMessage.Error.Text   
              visible={!dialogObservacaoInfo.observacao.isValid}
            >
              A observacao deve conter no mínimo 10 caracteres
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root >

          <DialogFooter>
            <Button 
              onClick={() => setDialogObservacaoOpen(false)}
            >
              Cancelar
            </Button>

            <Button 
              disabled={!dialogObservacaoInfo.observacao.isValid}
              onClick={handleClickConfirmaAdicionaObservacao}
            >
              { isAddingObsForm ? 'Adicionando...' : 'Adicionar' }
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