'use client';

import { useCallback, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/Skeleton2.0';
import { Textarea } from '@/components/ui/textarea';
import { FieldMessage } from '@/components/FieldMessage';
import { fileHelper } from '@/utils/File';
import { toast } from '@/utils/toast';

import { ArquivoDemanda } from '@/actionsV2/backend/interface';
import { DetalhesCadastro } from '@/components/Forms/util/Components/DetalhesCadastro';
import { actions } from '@/actionsV2'
import { formatNumberBRLCurrency } from '@/utils/String';

import {
  CamposAuditadosCadastroJuridico,
  DemandaCadastroJuridico,
  FormFile,
  JustificativaInfo,
} from '../../interfaces';

import { DetalhesAcao } from './DetalhesAcao';
import { DetalhesProcesso } from './DetalhesProcesso';
import { DetalhesAutor } from './DetalhesAutor';
import { DetalhesReu } from './DetalhesReu';
import { CausaRaiz } from './CausaRaiz';
import { Pedidos } from './Pedidos';
import { FileViewer } from '@/components/Forms/util/Components/FileViewer';
import { Objeto } from './Objeto';

interface CadastroJuridicoReturnParams {
  id: string;
  esteira: string;
  esteiraTipo: string;
  dadosIniciais: DemandaCadastroJuridico;
}

interface FormCadastroJuridicoBookingAuditoriaOitoProps {
  params: CadastroJuridicoReturnParams;
}

interface DadosClienteForm {
  timeOut: number;
}

export function FormCadastroJuridicoBookingAuditoriaOito({ params }: FormCadastroJuridicoBookingAuditoriaOitoProps) {
  const pk = params.id;
  const esteira = params.esteira;
  const esteiraTipo = params.esteiraTipo;
  const dadosIniciais = params.dadosIniciais;

  const router = useRouter();
  const searchParams = useSearchParams();

  const formBag = useForm<DemandaCadastroJuridico>({
    defaultValues: {
      observacao: [],
      tipificacao: '',
      uf: '',
      cidade: '',
      resumo_processo: '',
      causa_raiz: '',
      sub_causa_raiz: '',
      lista_autores: [],
      lista_reus: [],
      processo: '',
      processo_originario: '',
      nome_desdobramento: '',
      data_distribuicao_desdobramento: '',
      tipo_demanda: '',
      status_demanda: '',
      data_distribuicao: '',
      data_audiencia: '',
      data_citacao: '',
      acao: '',
      tipo_acao: '',
      tipo_acao2: '',
      prazo_liminar: '',
      conteudo_liminar: '',
      prazo_tipo: '',
      prazo_contestacao: '',
      pedido: '',
      valor_pedido: '',
      valor_causa: '',
      orgao_tribunal: '',
      foro: '',
      vara: '',
      arquivos: [],
      campos_auditados: {
        data_audiencia: undefined,
        numero_reserva: undefined,
        lista_autores: undefined,
      },
    },
  });

  const [initialUploadList, setInitialUploadList] = useState<FormFile[] | null>(null);

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

  const [isLoadingForm, setIsLoadingForm] = useState(true);
  const [isLoadingFileViewer, setIsLoadingFileViewer] = useState(true);
  const [isDesvinculandoUsuario, setIsDesvinculandoUsuario] = useState(false);
  const [isJustificandoEnvio, setIsJustificandoEnvio] = useState(false);
  const [isReprovandoForm, setIsReprovandoForm] = useState(false);

  const [dialogJustificarEnvioOpen, setDialogJustificarEnvioOpen] = useState(false);

  const formatInitialFormValues = useCallback((values: Partial<DemandaCadastroJuridico>) => {
    const formattedValues = {
      ...values,
    } as DemandaCadastroJuridico;

    formattedValues.valor_causa = values?.valor_causa ? formatNumberBRLCurrency(values?.valor_causa.toString()) : '';

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

    formattedValues.lista_pedidos = values?.lista_pedidos
      ? values?.lista_pedidos.map((item) => {
          return {
            id: item?.id ?? uuid(),
            descricao: item?.descricao,
            valor: item?.valor,
          };
        })
      : [];

    console.log('Valores NAO formatados:', values);
    console.log('Valores formatados:', formattedValues);

    return formattedValues;
  }, []);

  const updateInitialFormValues = useCallback(
    (newValues: Partial<DemandaCadastroJuridico>) => {
      try {
        const oldValues = formBag.getValues();

        const sanitizedValues = Object.fromEntries(
          Object.entries(newValues || {}).filter(([key, value]) => value !== undefined && value !== null && key !== 'campos_auditados')
        )

        const formattedValues = formatInitialFormValues({
          ...oldValues,
          ...sanitizedValues,
        });

        formBag.reset(formattedValues);
      } catch (error: any) {
        toast.error({
          title: 'Falha ao atualizar os dados do formulário',
          description: error?.message,
        });
      }
    },
    [formatInitialFormValues]
  );

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

  const desbloqueiaDemanda = async () => {
    try {
      await actions.backend.demanda.desbloqueiaUsuarioDemanda({ pk });
    } catch (error: any) {
      throw new Error(error?.message);
    }
  };

  const pushBack = () => {
    const urlQuery = searchParams.toString() ?? '';

    router.push(`/${esteira}/${esteiraTipo}?${urlQuery}`);
  };

  const reprovar = async () => {
    try {
      setIsReprovandoForm(true);

      await actions.backend.auditoria.reprovarDemanda({
        pk,
        justificativa: justificarEnvioDialogInfo.justificativa.value ?? '',
      });

      toast.success({
        title: 'Reprovado!',
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

  const validarCamposAuditados = () => {
    const camposAuditaveis = formBag.getValues('campos_auditados') as CamposAuditadosCadastroJuridico;

    console.log('Campos auditaveis:', camposAuditaveis);

    const allCamposAuditados = Object.values(camposAuditaveis).every((value) => value === true || value === false);

    if (allCamposAuditados) {
      return true;
    }

    const dicionarioCamposAuditados = {
      data_audiencia: 'Data de Audiência',
      numero_reserva: 'Número da Reserva',
      lista_autores: 'Detalhes do Autor',
    };

    const chavesCamposNaoAuditados = Object.keys(camposAuditaveis).filter(
      (key) => camposAuditaveis[key as keyof CamposAuditadosCadastroJuridico] === undefined
    );

    const nomesCamposNaoAuditados = chavesCamposNaoAuditados.map(
      (key) => dicionarioCamposAuditados[key as keyof typeof dicionarioCamposAuditados]
    );

    toast.custom.warning('Há campos não auditados. Por favor, revise os campos e tente novamente.', {
      duration: Infinity,
      closeButton: true,
      dismissible: true,
      icon: <></>,
      description: (
        <div>
          <p>Campos não auditados:</p>
          <br />
          <ul>
            {nomesCamposNaoAuditados.map((nome) => (
              <li key={nome}>{nome}</li>
            ))}
          </ul>
        </div>
      ),
    });

    return false;
  };

  const onSubmit = async (dados: DemandaCadastroJuridico) => {
    try {
      console.log('Dados do formulário:', dados);

      if (!validarCamposAuditados()) {
        return;
      }

      await actions.backend.auditoria.aprovarDemanda({ pk, dados });

      toast.success({
        title: 'Aprovado!',
        description: 'Formulário aprovado com sucesso',
      });

      pushBack();
    } catch (error: any) {
      toast.error({
        title: 'Falha ao aprovar o formulário',
        description: error?.message,
      });
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

  const enviarExcecaoOito = async () => {
    try {
      await actions.backend.demanda.enviarDemandaExcecaoOito({
        pk,
        justificativa: justificarEnvioDialogInfo.justificativa.value ?? '',
      });

      toast.success({
        title: 'Enviado',
        description: 'Formulário enviado com sucesso.',
      });
    } catch (error: any) {
      toast.error({
        title: 'Falha ao enviar o formulário',
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

        case 'reprovar-demanda':
          await reprovar();
          break;

        default:
          break;
      }

      pushBack();
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

  const handleClickSair = async () => {
    try {
      setIsDesvinculandoUsuario(true);

      await desbloqueiaDemanda();

      pushBack();
    } catch (error: any) {
      toast.error({
        title: 'Falha ao desbloquear a demanda',
        description: error?.message,
      });
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
        tipo: file.info.tipo,
      }));

    formBag.setValue('arquivos', novosArquivos);
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
              tipo: file.tipo,
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
              tipo: file.tipo,
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

      console.log('Dados recebidos:', dadosIniciais);

      if (!dadosIniciais) {
        return;
      }

      const dadosCliente = await getDadosCliente();

      updateDadosCliente({
        timeOut: dadosCliente?.time_out?.['Cadastro Jurídico'],
      });

      updateInitialFormValues(dadosIniciais);

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

  console.log('RENDER FORM PRINCIPAL');

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
          showTipo
        />
      </Card>

      <Card className="flex flex-col w-1/2 gap-4 py-4 h-full overflow-y-auto">
        <CardContent className="flex flex-col gap-4 h-full">
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
                  formBag.handleSubmit(onSubmit)(event);
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

                <DetalhesProcesso 
                  formBag={formBag} 
                />

                <DetalhesAcao 
                  formBag={formBag}
                  dadosConsultaProcesso={[]}
                />

                <DetalhesAutor formBag={formBag} />
                
                <DetalhesReu formBag={formBag} />

                <Objeto formBag={formBag} />
                
                <Pedidos formBag={formBag} />
                
                <CausaRaiz formBag={formBag} />

                <div className="flex justify-center space-x-2">
                  <Button 
                    type="submit" 
                    className="bg-green-700" 
                    disabled={formBag.formState.isSubmitting}
                  >
                    {formBag.formState.isSubmitting ? 'Aprovando...' : 'Aprovar'}
                  </Button>

                  <Button 
                    type="button" 
                    className="bg-red-700" 
                    disabled={isReprovandoForm} 
                    onClick={handleClickReprovar}
                  >
                    {isReprovandoForm ? 'Reprovando...' : 'Reprovar'}
                  </Button>
                </div>

                <div className="flex justify-center space-x-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    disabled={isDesvinculandoUsuario} 
                    onClick={handleClickSair}
                  >
                    {isDesvinculandoUsuario ? 'Desvinculando...' : 'Desvincular usuário'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    disabled={isJustificandoEnvio}
                    onClick={handleClickEnviarExcecao}>
                    {isJustificandoEnvio ? 'Enviando...' : 'Enviar para exceção oito'}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </CardContent>
      </Card>

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
