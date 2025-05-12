import { ArquivoDemanda } from "@/actionsV2/backend/interface";
import { FileItem, RemoveFile, RetryUpload, UpdateFile, UploadFile } from "@/components/Upload2.0/contexts";
import { Unit } from "bytes";
import { FileRejection } from "react-dropzone/.";

export interface DadosDemandaReturn {
  [key: string]: any;
}

export interface DemandaAtualizacaoReturn {
  pk?: string;
  usuario_atuando?: string;
  created_by?: string;
  cliente?: string;
  data_carimbo?: string;
  due_date?: string;
  arquivos?: ArquivoDemanda[];
  tipo_demanda?: string;
  perfil_demanda?: string;
  status_demanda?: string;
  status?: string;
  processo?: string;
  identificacao?: string;
  data_citacao?: string;
  data_audiencia?: string;
  prazo_contestacao?: string;
  data_liminar?: string;
  prazo_liminar?: string;
  suit_id?: string;
  observacao?: {
    mensagem: string;
    criada_em: string;
    criada_por: string;
  }[];
}

export interface Escritorio {
  officeName: string;
  officeID: number;
  suitID: number;
  fullName: string;
  ResultCodeMsg: string | null;
  userEmail: string;
  userName: string;
  officeEmail: string;
  ResultCode: number;
}

export interface DemandaCadastroJuridicoReturn {
  pk?: string;
  usuario_atuando?: string;
  created_by?: string;
  cliente?: string;
  documento_autor?: string;
  processo?: string;
  data_carimbo?: string;
  data_citacao?: string;
  perfil_demanda?: string;
  status?: string;
  data_distribuicao?: string;
  data_audiencia?: string;
  data_liminar?: string;
  data_citacao_positiva?: string;
  due_date?: string;
  tipo_acao?: string;
  causa_pedir?: string;
  contrato?: ContratoDemanda[];
  prazo_liminar?: string;
  andamento_cedente_assumiu_demanda?: boolean | undefined;
  prazo_contestacao?: string;
  detalhe_objeto?: string;
  arquivos?: ArquivoDemanda[];
  tribunal?: string;
  uf?: string;
  comarca?: string;
  foro?: string;
  vara?: string;
  empresa_fundo?: string;
  tipo_justica?: string;
  valor_causa?: string;
  nome_autor?: string;
  nome_advogado?: string;
  documento_advogado?: string;
  portfolio?: string[];
  escritorio?: string | string[] | Escritorio | Escritorio[];
  tipo_demanda?: string;
  status_demanda?: string;
  observacao?: {
    mensagem: string;
    criada_em: string;
    criada_por: string;
  }[];
}

export interface DemandaNotificacaoExtrajudicialReturn {
  pk?: string;
  usuario_atuando?: string;
  created_by?: string;
  cliente?: string;
  data_carimbo?: string;
  due_date?: string;
  arquivos?: ArquivoDemanda[];
  tipo_demanda?: string;
  processo?: string;
  identificacao?: string;
  suit_id?: string;
  status_demanda?: string;
  status?: string;
  perfil_demanda?: string;
  observacao?: {
    mensagem: string;
    criada_em: string;
    criada_por: string;
  }[];
}

export interface DemandaProcessoTrabalhistaReturn {
  pk?: string;
  usuario_atuando?: string;
  created_by?: string;
  cliente?: string;
  data_carimbo?: string;
  due_date?: string;
  arquivos?: ArquivoDemanda[];
  tipo_demanda?: string;
  status_demanda?: string;
  status?: string;
  perfil_demanda?: string;
  processo?: string;
  identificacao?: string;
  suit_id?: string;
  observacao?: {
    mensagem: string;
    criada_em: string;
    criada_por: string;
  }[];
}

export interface DemandaProconReturn {
  pk?: string;
  usuario_atuando?: string;
  created_by?: string;
  cliente?: string;
  data_carimbo?: string;
  due_date?: string;
  arquivos?: ArquivoDemanda[];
  tipo_demanda?: string;
  status_demanda?: string;
  status?: string;
  perfil_demanda?: string;
  processo?: string;
  identificacao?: string;
  suit_id?: string;
  observacao?: {
    mensagem: string;
    criada_em: string;
    criada_por: string;
  }[];
}

export interface DemandaOutroReturn {
  pk?: string;
  usuario_atuando?: string;
  created_by?: string;
  cliente?: string;
  data_carimbo?: string;
  due_date?: string;
  arquivos?: ArquivoDemanda[];
  tipo_demanda?: string;
  status_demanda?: string;
  status?: string;
  perfil_demanda?: string;
  processo?: string;
  identificacao?: string;
  suit_id?: string;
  observacao?: {
    mensagem: string;
    criada_em: string;
    criada_por: string;
  }[];
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

export type TipoJustificativaInfo = 'enviar-excecao-oito' | 'reprovar-demanda' | 
  'inativar-demanda' | 'enviar-esteira-oito' | 'enviar-auditoria-oito' | '';

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

// export interface ContratoDemandaV2 {
//   bindingId: number;
//   CodigoProduto?: string;
//   ContratoOriginal: string;
//   debtId: number;
//   digito_conta?: string | number;
//   nome_parte: string;
//   NomeProduto?: string;
//   NumDivida?: string | number;
//   num_agencia?: string | number;
//   num_banco?: string | number;
//   num_carteira?: string | number;
//   num_conta?: string | number;
//   portfolioID: number;
//   portfolioName: string;
//   PrimeiroAtraso: string;
//   SaldoAtualizado?: number;
//   SaldoOriginal?: number;
//   Situacao?: string;
//   escritorio?: string;
//   selected: boolean;
//   located: boolean;
// }

// export interface ContratoDemandaV1 {
//   binding_id: number;
//   codigo_produto?: string;
//   contrato_original: string;
//   debit_id: number;
//   digito_conta?: string | number | null;
//   id_portfolio_contrato: number;
//   located: boolean;
//   nome_parte: string;
//   nome_produto?: string;
//   num_agencia?: string | number | null;
//   num_banco?: string | number | null;
//   num_carteira?: string | number | null;
//   num_conta?: string | number | null;
//   num_divida?: string | number;
//   portfolio_name: string;
//   primeiro_atraso: string;
//   saldo_atualizado?: number;
//   saldo_original?: number;
//   selected: boolean;
//   situacao?: string;
// }

// export interface ContratoDemanda {
//   bindingId: number;
//   codigoProduto?: string;
//   contratoOriginal: string;
//   debtId: number;
//   digitoConta?: string | number;
//   escritorio?: string;
//   located: boolean;
//   nomeParte: string;
//   nomeProduto?: string;
//   numAgencia?: string | number;
//   numBanco?: string | number;
//   numCarteira?: string | number;
//   numConta?: string | number;
//   numDivida?: string | number;
//   portfolioId: number;
//   portfolioName: string;
//   primeiroAtraso: string;
//   saldoAtualizado?: number;
//   saldoOriginal?: number;
//   selected: boolean;
//   situacao?: string;
// }

export interface ContratoDemanda {
  //Desde 24/02/2025
  bindingId: number; //OK
  ContratoOriginal: string; //OK
  debtId: number; //OK
  portfolioName: string; //OK
  PrimeiroAtraso: string; //OK
  SaldoOriginal?: number; //OK
  selected: boolean; //OK
  located: boolean; //OK

  //Antes de 24/02/2025
  binding_id?: number;
  contrato_original?: string | null;
  debit_id?: number;
  portfolio_name?: string;
  primeiro_atraso?: string;
  saldo_original?: number;

  // //v2 dynamodb
  // bindingId: 42969907,
  // CodigoProduto: "",
  // ContratoOriginal: "C26422463061865600060806639377",
  // debtId: 45952274,
  // DigitoConta: null,
  // located: true,
  // NomeProduto: "CARTÃO MATEUSCARD VISA NACIONAL",
  // NumDivida: "C264224645952274",
  // NumeroAgencia: null,
  // NumeroBanco: null,
  // NumeroCarteira: null,
  // NumeroConta: null,
  // portfolioID: 125,
  // portfolioName: "Bradesco VI (P2)",
  // PrimeiroAtraso: "2020-12-28T00:00:00",
  // SaldoAtualizado: 338.54,
  // SaldoOriginal: 224,
  // selected: true,
  // Situacao: ""

  // //V1 dynamodb
  // binding_id: number;
  // codigo_produto?: string | null;
  // contrato_original?: string | null;
  // debit_id: number;
  // digito_conta?: string | number | null;
  // escritorio?: string;
  // id_portfolio_contrato: number;
  // located: boolean;
  // nome_parte: string;
  // nome_produto?: string | null;
  // num_agencia?: string | number | null;
  // num_banco?: string | number | null;
  // num_carteira?: string | number | null;
  // num_conta?: string | number | null;
  // num_divida?: string | number;
  // portfolio_name: string;
  // primeiro_atraso: string;
  // saldo_atualizado?: number;
  // saldo_original?: number;
  // selected: boolean;
  // situacao?: string;


}

export interface ProcessoInfo {
  uf: string;
  tribunal: string;
  comarca: string;
  vara: string;
  foro: string;
}

export interface UpdateContrato {
  selectedContrato: ContratoDemanda,
  rowIndex: number, 
  checked: boolean,
  pk: string 
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
