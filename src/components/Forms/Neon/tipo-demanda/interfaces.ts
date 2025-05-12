import { ArquivoDemanda } from "@/actionsV2/backend/interface";
import { FileItem, RemoveFile, RetryUpload, UpdateFile, UploadFile } from "@/components/Upload2.0/contexts";
import { Unit } from "bytes";
import { FileRejection } from "react-dropzone/.";

export interface DadosDemandaOficioJudicial {
  pk?: string;
  usuario_atuando?: string;
  cliente?: string;
  created_by?: string;
  data_carimbo?: string;
  due_date?: string;
  tipo_demanda?: string;
  status?: string;
  perfil_demanda?: string;
  status_demanda?: string;
  tipo_documento?: string;
  processo?: string;
  identificacao?: string;
  tribunal?: string;
  uf?: string;
  comarca?: string;
  foro?: string;
  vara?: string;
  assunto?: string;
  emails?: string[];
  template_resposta_email?: string;
  partes?: {
    nome: string;
    documento: string;
    relacionamento: boolean;
    saldo: boolean;
  }[];
  arquivos?: ArquivoDemanda[];
  observacao?: {
    mensagem: string;
    criada_em: string;
    criada_por: string;
  }[];
}

export interface ProcessoInfo {
  uf: string;
  tribunal: string;
  comarca: string;
  vara: string;
  foro: string;
}

export interface FormFile {
  id: string;
  info: {
    name: string;
    size: number;
    sizeFormatted: string;
    unit: Unit;
    url: string; 
    s3Key: string;
    s3Bucket: string;
  };
  status: {
    success: boolean | undefined;
    progress: number;
    message: string | undefined;
    isDeleting?: boolean;
  };
  allow: {
    delete: boolean;
    download: boolean;
    retryUpload: boolean;
    link: boolean;
  };
  dropzoneFile: File | FileRejection | undefined;
}

export interface OnUploadErrorProps {
  file: FileItem<FormFile>;
  message?: string;
}

export interface OnDropAccepted {
  files: File[];
  uploadFiles: UploadFile<FormFile>
}

export interface OnDropRejected {
  files: FileRejection[];
  uploadFiles: UploadFile<FormFile>
}

export interface OnProcessUpdateProps {
  file: FileItem<FormFile>;
  updateFile: UpdateFile<FormFile>
}

export interface ProcessUploadErrorProps {
  file: FileItem<FormFile>;
  message: string;
  updateFile: UpdateFile<FormFile>;
}

export interface OnUploadProgressProps {
  file: FileItem<FormFile>;
  event: any;
  updateFile: UpdateFile<FormFile>;
}

export interface HandleClickDeleteFileProps {
  file: FileItem<FormFile>;
  removeFile: RemoveFile<FormFile>;
  updateFile: UpdateFile<FormFile>;
}

export interface HandleClickRetryUploadProps {
  file: FileItem<FormFile>;
  retryUpload: RetryUpload<FormFile>;
}

export interface ExcecaoInfo {
  justificativa: {
    isValid: boolean;
    value: string;
  }
}

export interface ObservacaoInfo {
  observacao: {
    isValid: boolean;
    value: string;
  }
}

export type TipoJustificativaInfo = 'enviar-excecao-cliente' | 
'enviar-esteira-cliente' | 'enviar-esteira-oito' | 'enviar-auditoria-oito' |
'enviar-email' | 'substituir-endereco-email' | 'inativar-demanda' |
'enviar-excecao-oito' | 'reprovar-demanda' | '';

export interface JustificativaInfo {
  tipo: TipoJustificativaInfo;
  title: Partial<{
    text: string;
  }>,
  justificativa: Partial<{
    isValid: boolean;
    value: string;
  }>
}

export interface EmailInfo {
  email: Partial<{
    isValid: boolean;
    value: string;
  }>
}

export interface ParteInfo {
  nome: Partial<{
    isValid: boolean;
    value: string;
  }>;
  documento: Partial<{
    isValid: boolean;
    value: string;
    validate: boolean;
  }>;
}
