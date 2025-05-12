'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { v4 as uuid } from 'uuid';
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useShallow } from "zustand/shallow";
import { useResourcesStore } from "@/zustand-store/resources";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import Backdrop from "@/components/Backdrop";
import { Upload } from "@/components/Upload2.0";
import * as Icon from '@phosphor-icons/react';
import { PDFViewer } from "@/components/PDFViewer";
import { FileItem, UpdateFile, UploadRootHandles } from "@/components/Upload2.0/contexts";
import { BasicInfoForm } from "./BasicInfoForm";
import { ContractTable } from "./ContractTable";
import { ProcessInfoForm } from "./ProcessInfoForm";
import { AdditionalInfoForm } from "./AdditionalInfoForm";
import { toast } from "@/utils/toast";
import { DetalheObjetoForm } from "./DetalheObjetoForm";
import { Skeleton } from "@/components/Skeleton2.0";
import { useAuthStore } from "@/zustand-store/auth.store";
import { formatNumberBRLCurrency } from "@/utils/String";
import { Textarea } from "@/components/ui/textarea";
import { FieldMessage } from "@/components/FieldMessage";
import { util } from "@/utils";
import { maskCpfCnpj, maskNumeroProcesso, maskOAB } from "@/utils/Masks";
import { AdvogadoForm } from "./AdvogadoForm";
import { fileHelper } from "@/utils/File";
import { ArquivoDemanda } from "@/actions/backend/interface";
import { aprovarDemanda, reprovarDemanda } from "@/actions/backend/auditoria";

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
  JustificativaInfo
} from "../../interfaces";

import {
  adicionaObservacaoDemanda,
  desbloqueiaUsuarioDemanda,
  enviarDemandaExcecaoOito,
  getDadosDemandaConsulta,
  consultarDadosProcesso,
  selecionaDadoProcesso,
} from "@/actions/backend/demanda";

import {
  getDadosAutor,
  enviarDesdobramentoProcesso,
  selecionaContrato,
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

interface FormCadastroJuridicoReturnAuditoriaOitoProps {
  params: CadastroJuridicoReturnParams;
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

export function FormCadastroJuridicoReturnAuditoriaOito({ params }: FormCadastroJuridicoReturnAuditoriaOitoProps) {
  const pk = params.id;
  const esteira = params.esteira;
  const esteiraTipo = params.esteiraTipo;
  const dadosIniciais = params.dadosIniciais;

  const router = useRouter();
  const searchParams = useSearchParams()

  

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

  const [dialogObservacaoInfo, setDialogObservacaoInfo] = useState<ObservacaoInfo>({
    observacao: {
      value: '',
      isValid: false,
    }
  })

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
  const [isConsultandoAutor, setIsConsultandoAutor] = useState(false);
  const [isConsultandoProcesso, setIsConsultandoProcesso] = useState(false);
  const [isSelecionandoContrato, setIsSelecionandoContrato] = useState(false);
  const [isOpenUploadList, setIsOpenUploadList] = useState<boolean>(false);
  const [isAddingObsForm, setIsAddingObsForm] = useState(false);
  const [isEnviandoExcecao, setIsEnviandoExcecao] = useState(false);
  const [isDisabledUpload, setIsDisabledUpload] = useState(false);
  const [isEnviandoDesdobramento, setIsEnviandoDesdobramento] = useState(false);
  const [isDesvinculandoUsuario, setIsDesvinculandoUsuario] = useState(false);
  const [isAprovandoForm, setIsAprovandoForm] = useState(false);
  const [isReprovandoForm, setIsReprovandoForm] = useState(false);
  const [isJustificandoEnvio, setIsJustificandoEnvio] = useState(false);

  const [dialogProcessoOpen, setDialogProcessoOpen] = useState(false);
  const [dialogObservacaoOpen, setDialogObservacaoOpen] = useState(false);
  const [dialogEnviarDesdobramentoOpen, setDialogEnviarDesdobramentoOpen] = useState(false);
  const [dialogJustificarEnvioOpen, setDialogJustificarEnvioOpen] = useState(false);

  const dateNow = useMemo(() => new Date(), []);

  const formatFormValues = useCallback((values: Partial<DemandaCadastroJuridicoReturn>) => {
    const formattedValues: FormValues = {
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
    formattedValues.prazo_contestacao = values?.prazo_contestacao?.toString() ?? "0";
    formattedValues.prazo_liminar = values?.prazo_liminar?.toString() ?? "0";
    formattedValues.andamento_cedente_assumiu_demanda = values?.andamento_cedente_assumiu_demanda ?? false;
    formattedValues.processo = maskNumeroProcesso(values?.processo);
    formattedValues.documento_autor = maskCpfCnpj(values?.documento_autor);
    formattedValues.documento_advogado = maskOAB(values?.documento_advogado);
    formattedValues.tipo_demanda = values?.tipo_demanda ?? 'Cadastro Jurídico';
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

    return formattedValues;
  }, []);

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
            }

            return errorFile;
          }
        }) || []
      );

      //console.log('Lista de arquivos carregados:', uploadList);

      const firstItemUploadConfigList = uploadList.find((item) => !!item.info.url);

      setInitialUploadList(uploadList);
      setUrlPdfViewer(firstItemUploadConfigList?.info.url ?? '');

      const totalFilesSizeInBytes = uploadList.reduce((acc, file) => acc + fileHelper.convertToBytes({
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

    } catch (error) {
      toast.error({
  title: 'Erro',
  description: 'Falha ao carregar o arquivo. Por favor, tente novamente.',
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

  const loadPage = () => {
    router.push(`/${esteira}/${esteiraTipo}/demanda/${pk}`);
  };

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

      const contratos = formBag.getValues('contrato') as ContratoDemanda[];

      if (!contratos) {
        return;
      }
  
      // const updatedContratos = contratos.map((contrato, index) => {
      //   if (index === rowIndex) {
      //     return {
      //       ...contrato,
      //       selected: checked,
      //     }
      //   }
  
      //   return contrato;
      // });
  
      const responseSelectContract = await selecionaContrato({
        pk, 
        bindingId: selectedContrato.bindingId.toString(),
      });

      util.actions.checkHaveError(responseSelectContract?.data);

      toast.success({
        title: 'Sucesso',
        description: 'Contrato selecionado com sucesso.',
      });

      const responseGetFillData = await getDadosDemandaConsulta({ pk });
      const data = util.actions.convertResponseActionData(responseGetFillData?.data);

      if (!data) {
        return;
      }

      updateFormValues(data);
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

      const response = await getDadosAutor({
        pk,
        cpfCnpj: documentoAutor,
      });

      util.actions.checkHaveError(response?.data);

      const responseGetFillData = await getDadosDemandaConsulta({ pk });
      const data = util.actions.convertResponseActionData(responseGetFillData?.data);

      if (!data) {
        return;
      }

      updateFormValues(data);

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
        title: 'Sucesso',
        description: 'Formulário enviado com sucesso.',
      });
    } catch (error: any) {
      toast.error({
        title: 'Erro',
        description: error?.message,
      });
    } finally {
      setIsEnviandoExcecao(false);
    }
  }

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
        title: 'Sucesso',
        description: 'Formulário reprovado com sucesso.',
      });
    } catch (error: any) {
      toast.error({
        title: 'Erro',
        description: error?.message,
      });
    } finally { 
      setIsReprovandoForm(false);
    }
  };

  const pushBack = () => {
    const urlQuery = searchParams.toString() ?? '';

    router.push(`/${esteira}/${esteiraTipo}?${urlQuery}`);
  }
  
  const onSubmit = async (dados: DemandaCadastroJuridicoReturn) => {
    try {
      console.log('Dados do formulário:', dados);
      setIsAprovandoForm(true);

      const response = await aprovarDemanda({ pk, dados });

      util.actions.checkHaveError(response?.data);

      toast.success({
  title: 'Sucesso',
  description: 'Formulário aprovado com sucesso.',
});

      pushBack();
    } catch (error: any) {
      toast.error({
  title: 'Erro',
  description: error?.message,
});
    } finally { 
      setIsAprovandoForm(false);
    }
  };

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

  const handleClickReprovar = async () => {
    setDialogJustificarEnvioOpen(true);

    updateDialogJustificarEnvioInfo({
      tipo: 'reprovar-demanda',
      title: {
        text: 'Justificar reprovação',
      },
    });
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
        case 'reprovar-demanda':
          await reprovar();
          break;

        case 'enviar-excecao-oito':
          await enviarExcecaoOito();
          break;
          
        default:
          break;
      }

      pushBack();
    } catch (error: any) {
      toast.error({
  title: 'Erro',
  description: error?.message,
});
    } finally {
      setIsJustificandoEnvio(false);
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
  }

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
        pk,
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

  const handleClickFile = (file: FormFile) => {
    setUrlPdfViewer(file.info.url);
  }

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
  description: 'Formulário enviado com sucesso.',
});

      pushBack();
    } catch (error: any) {
      toast.error({
  title: 'Erro',
  description: error?.message,
});
    } finally {
      setIsEnviandoDesdobramento(false);
    }
  }

  const handleClickEnviarDesdobramento = () => {
    setDialogEnviarDesdobramentoOpen(true);
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

  const handleClickDesvincularUsuario = async () => {
    try {
      setIsDesvinculandoUsuario(true);

      await desbloqueiaDemanda();

      pushBack();
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
                                    onClick={() => handleClickFile(file)}
                                  >
                                    <Upload.List.Row.Name
                                      tooltip={file.info.name}
                                      selected={urlPdfViewer.length > 0 && urlPdfViewer === file.info.url}
                                      onClick={() => handleClickFile(file)}
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

              <PDFViewer
                data-open={isOpenUploadList}
                className="data-[open=true]:h-1/2"
                source={urlPdfViewer}
              />
            </div>
          )
        }
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
                  formBag.handleSubmit(onSubmit)(event);
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
                    type="submit"
                    className='bg-green-700'
                    disabled={isAprovandoForm}
                  >
                    { isAprovandoForm ? 'Aprovando...' : 'Aprovar' }
                  </Button>

                  <Button 
                    type="button" 
                    className='bg-red-700'
                    disabled={isReprovandoForm} 
                    onClick={handleClickReprovar}
                  >
                    { isReprovandoForm ? 'Reprovando...' : 'Reprovar' }
                  </Button>
                </div>

                <div className="flex justify-center space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    disabled={isLoadingForm} 
                    onClick={handleClickDesvincularUsuario}
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