'use client'

import { useCallback, useEffect, useMemo, useState } from "react";
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { TabelaContrato } from "./TabelaContrato";
import { Processo } from "./Processo";
import { Complemento } from "./Complemento";
import Countdown from "@/components/Countdown";
import { toast } from "@/utils/toast";
import { Objeto } from "./Objeto";
import { Skeleton } from "@/components/Skeleton2.0";
import { convertBRLCurrencyToNumber, formatNumberBRLCurrency } from "@/utils/String";
import { Textarea } from "@/components/ui/textarea";
import { FieldMessage } from "@/components/FieldMessage";
import { maskCpfCnpj, maskNumeroProcesso, maskOAB } from "@/utils/Masks";
import { Advogado } from "./Advogado";
import { fileHelper } from "@/utils/File";
import { ArquivoDemanda } from "@/actionsV2/backend/interface";
import { actions } from "@/actionsV2"
import { DetalhesCadastro } from "@/components/Forms/util/Components/DetalhesCadastro";
import { FileViewer } from "@/components/Forms/util/Components/FileViewer";

import {
  DemandaCadastroJuridicoReturn,
  ProcessoInfo,
  FormFile,
  ContratoDemanda,
  UpdateContrato,
  ExcecaoInfo,
} from "../../interfaces";
import { Autor } from "./Autor";
import { Informativo } from "./Informativo";

export interface FormValues extends DemandaCadastroJuridicoReturn {
  escritorio: string[];
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

export function FormCadastroJuridicoReturnEsteiraOito({ params }: FormCadastroJuridicoReturnEsteiraOitoProps) {
  const pk = params.id;
  const esteira = params.esteira;
  const esteiraTipo = params.esteiraTipo;
  const dadosIniciais = params.dadosIniciais;

  const router = useRouter();

  const formBag = useForm<FormValues>();

  const [initialUploadList, setInitialUploadList] = useState<FormFile[] | null>(null);

  const [excecaoDialogInfo, setExcecaoDialogInfo] = useState<ExcecaoInfo>({
    justificativa: {
      value: '',
      isValid: false,
    }
  });

  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isLoadingFileViewer, setIsLoadingFileViewer] = useState(false);
  const [isPausedCountDown, setIsPausedCountDown] = useState<boolean>(false);
  const [isSavingForm, setIsSavingForm] = useState(false);
  const [isEnviandoExcecao, setIsEnviandoExcecao] = useState(false);

  const [isDesvinculandoUsuario, setIsDesvinculandoUsuario] = useState(false);

  const [dialogExcecaoOpen, setDialogExcecaoOpen] = useState(false);

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

  const desbloqueiaDemanda = async () => {
    try {
      await actions.backend.demanda.desbloqueiaUsuarioDemanda({ pk })
    } catch(error: any) {
      throw new Error(error?.message);
    }
  }

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

    if (dados.documento_advogado && dados.documento_advogado.length !== 9) {
      erros.documento_advogado = 'OAB do Advogado inválida, exemplo: UF-000000';
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
      formBag.clearErrors();

    
      // Validação de campos obrigatórios
      const formValido = formularioValido(dados);

      if (!formValido) {
        return;
      }

      await saveForm();

      const dadosSubmeter = await actions.backend.demanda.submeterDemanda({ pk, dados });

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

      const dados = {
        ...formBag.getValues(),
        valor_causa: convertBRLCurrencyToNumber(formBag.getValues('valor_causa')),
      }

      console.log('Valores do formulário para salvar:', dados);

      await actions.backend.demanda.salvarDemanda({
        pk,
        dados,
      });

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

  const handleClickEnviarExcecao = () => {
    setDialogExcecaoOpen(true);
  }

  const handleClickConfirmaEnviarExcecao = async () => {
    try {
      setIsEnviandoExcecao(true);

      await saveForm();

      await actions.backend.demanda.enviarDemandaExcecaoOito({
        pk,
        justificativa: excecaoDialogInfo.justificativa.value,
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
      setDialogExcecaoOpen(false);
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

  const carregarArquivosDemanda = useCallback(async (files: ArquivoDemanda[] | undefined) => {
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

                <Informativo formBag={formBag} />

                <Autor 
                  pk={pk}
                  formBag={formBag}
                  saveForm={saveForm}
                  updateFormValues={updateFormValues}
                />
   
                <TabelaContrato 
                  formBag={formBag}
                  updateFormValues={updateFormValues}
                  pk={pk} 
                />  

                <Advogado formBag={formBag} />

                <Processo 
                  pk={pk}
                  esteira={esteira}
                  esteiraTipo={esteiraTipo}
                  formBag={formBag}
                  updateFormValues={updateFormValues}
                />

                <Objeto formBag={formBag} />

                <Complemento formBag={formBag} />

                <div className="flex justify-center space-x-2">
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
                    disabled={formBag.formState.isSubmitting || Object.keys(formBag.formState.errors).length > 0}
                  >
                    { formBag.formState.isSubmitting ? 'Submetendo...' : 'Submeter' }
                  </Button>
                </div>

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
                </div>
              </form>
            )
          }
        </CardContent>
      </Card>

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