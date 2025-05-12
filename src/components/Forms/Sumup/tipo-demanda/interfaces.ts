import { ArquivoDemanda } from "@/actionsV2/backend/interface";
import { FileItem, RemoveFile, RetryUpload, UpdateFile, UploadFile } from "@/components/Upload2.0/contexts";
import { Unit } from "bytes";
import { FileRejection } from "react-dropzone/.";

export interface Autor {
  id: string;
  nome: string;
  documento: string;
  email: string;
  telefone: string;
}

export interface Reu {
  id: string;
  nome: string;
  documento: string;
}

export interface GetDadosConsultaProps {
  pk: string | undefined;
}

export interface DadosDemandaOficioJudicial {
  pk?: string;
  usuario_atuando?: string;
  created_by?: string;
  cliente?: string;
  data_carimbo?: string;
  due_date?: string;
  tipo_demanda?: string;
  perfil_demanda?: string;
  status?: string;
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
  exequentes?: string[];
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

export interface DadosDemandaOficioPolicial {
  pk?: string;
  usuario_atuando?: string;
  created_by?: string;
  cliente?: string;
  data_carimbo?: string;
  due_date?: string;
  tipo_demanda?: string;
  status?: string;
  status_demanda?: string;
  perfil_demanda?: string;
  tipo_documento?: string;
  processo?: string;
  identificacao?: string;
  uf?: string;
  delegacia?: string;
  distrito?: string;
  assunto?: string;
  emails?: string[];
  exequentes?: string[];
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

export interface DadosDemandaProcon {
  pk?: string;
  usuario_atuando?: string;
  created_by?: string;
  cliente?: string;
  data_carimbo?: string;
  due_date?: string;
  arquivos?: ArquivoDemanda[];
  tipo_demanda?: string;
  perfil_demanda?: string;
  status?: string;
  status_demanda?: string;
  identificacao?: string;
  
  campos_auditados?: any;

  numero_reserva?: string;
  data_defesa?: string;
  data_audiencia?: string;
  tipificacao?: string;
  uf?: string;
  cidade?: string;
  objeto?: string;
  data_distribuicao?: string;
  data_reclamacao?: string;
  resumo_processo?: string;
  tipo_processo?: string;
  origem_reclamacao?: string;
  causa_raiz?: string;
  sub_causa_raiz?: string;
  lista_autores?: Autor[];
  lista_reus?: Reu[];
  observacao?: {
    mensagem: string;
    criada_em: string;
    criada_por: string;
  }[];
}

export interface CamposAuditadosCadastroJuridico {
  data_audiencia: boolean | undefined;
  numero_reserva: boolean | undefined;
  lista_autores: boolean | undefined;
}

export interface Pedido {
  id: string;
  descricao: string;
  valor: string;
}

export interface DadosDemandaCadastroJuridico {
  pk?: string;
  created_by?: string;
  usuario_atuando?: string;
  data_carimbo?: string;
  due_date?: string;
  desdobramento?: boolean;
  cliente?: string;
  processo?: string;
  perfil_demanda?: string;
  data_distribuicao?: string;
  data_audiencia?: string;
  data_citacao?: string;
  acao?: string;
  tipo_acao?: string;
  tipo_acao2?: string;
  prazo_liminar?: string;
  conteudo_liminar?: string;
  prazo_tipo?: string;
  prazo_contestacao?: string;
  arquivos?: ArquivoDemanda[];
  status?: string;
  uf?: string;
  cidade?: string;
  foro?: string;
  vara?: string;
  tipo_demanda?: string;
  status_demanda?: string;
  tipificacao?: string;
  tribunal?: string;
  processo_originario?: string;
  nome_desdobramento?: string;
  procedimento?: string;
  resumo_processo?: string;
  objeto?: string;
  pedido?: string;
  valor_pedido?: string;
  valor_causa?: string;
  causa_raiz?: string;
  sub_causa_raiz?: string;
  lista_pedidos?: Pedido[];
  lista_autores?: Autor[];
  lista_reus?: Reu[];
  numero_reserva?: string;
  observacao?: {
    mensagem: string;
    criada_em: string;
    criada_por: string;
  }[];

  campos_auditados?: CamposAuditadosCadastroJuridico;
}

export interface FormFile {
  id: string;
  info: {
    name: string;
    size: number;
    sizeFormatted: string;
    url: string; 
    unit: Unit;
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

export interface ProcessoInfo {
  uf: string;
  tribunal: string;
  comarca: string;
  vara: string;
  foro: string;
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

export interface ExcecaoInfo {
  justificativa: {
    isValid: boolean;
    value: string;
  }
}

export interface ExequenteInfo {
  exequente: Partial<{
    error: {
      message: string;
    }
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

export interface ExequenteInput {
  value: string;
}

export interface EmailInput {
  value: string;
}

export interface ParteInput {
  nome: Partial<{
    value: string;
  }>;
  documento: Partial<{
    value: string;
  }>;
}
