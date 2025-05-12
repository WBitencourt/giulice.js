'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { util } from '@/utils';
import { useAuthStore } from '@/zustand-store/auth.store';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useShallow } from 'zustand/shallow';
import Link from 'next/link'
import { FieldMessage } from '@/components/FieldMessage';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import moment from 'moment';
import { toast } from '@/utils/toast';
import { actions } from '@/actionsV2';

interface HistoricoLinkGerado {
  cliente: string;
  relatorio: string;
  link: string;
  data: Date;
}

interface SelectedOption {
  label: string;
  value: string;
}

type FormDados = {
  cliente: SelectedOption;
  relatorio: SelectedOption;
};

const defaultValues: FormDados = {
  cliente: {
    label: '',
    value: '',
  },
  relatorio: {
    label: '',
    value: '',
  },
}

const ReportFormGlobal: React.FC = () => { 
  const formBag = useForm<FormDados>({
    defaultValues,
  });

  const values = formBag.watch()

  const { user } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
    }))
  );

  const [linkRelatorio, setLinkRelatorio] = React.useState('');
  const [linkHistorico, setLinkHistorico] = React.useState<HistoricoLinkGerado[]>([]);
  const [isAbleDownload, setIsAbleDownload] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const clientes = user?.rules.consultas?.map((cliente) => {
    return {
      label: cliente,
      value: cliente,
    };
  }) ?? [];

  const relatorios = [
    {
      label: 'Demandas do mês anterior',
      value: 'demanda-mes-anterior',
    },
    {
      label: 'Demandas do mês corrente',
      value: 'demanda-mes-corrente',
    },
  ]

  const validateForm = () => {   
    let haveErrors = false;

    if (!values.cliente.value) {
      formBag.setError('cliente', {
        type: 'required',
        message: '*Cliente é obrigatório',
      });

      haveErrors = true;
    } else {
      formBag.clearErrors('cliente');
    }

    if (!values.relatorio.value) {
      formBag.setError('relatorio', {
        type: 'required',
        message: '*Relatório é obrigatório',
      });

      haveErrors = true;
    } else { 
      formBag.clearErrors('relatorio');
    }

    return !haveErrors;
  };

  const onSubmit = async (dados: FormDados) => {
    try {
      setIsSubmitting(true);

      const formIsValid = validateForm();

      if (!formIsValid) {
        return;
      }

      const link = await obterLinkRelatorio(dados);

      if (!link) {
        throw new Error('Não foi possível obter o link para download do relatório', { cause: 'validation' });
      }

      setLinkRelatorio(link);

      setLinkHistorico(prevState => {
        return [
          ...prevState,
          {
            cliente: dados.cliente.label,
            relatorio: dados.relatorio.label,
            link,
            data: new Date(),
          }
        ];
      });

      setIsAbleDownload(true);
    } catch(error: any) {
      setIsAbleDownload(false);

      if(error?.cause === 'validation') {
        toast.warning({
          title: 'Validação',
          description: error?.message,
        });

        return;
      }

      toast.error({
        title: 'Falha ao solicitar relatório',
        description: error?.message ?? 'Erro desconhecido',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const obterLinkRelatorio = async (dados: FormDados) => {
    switch (dados.relatorio.value) {
      case 'demanda-mes-anterior':
        return await actions.backend.relatorio.getLinkRelatorioDemandasMesAnterior({
          cliente: dados.cliente.value,
        });

      case 'demanda-mes-corrente':
        return await actions.backend.relatorio.getLinkRelatorioDemandasMesCorrente({
          cliente: dados.cliente.value,
        });

      default:
        toast.warning({
          title: 'Validação',
          description: 'Relatório não selecionado',
        });
        break;
    }
  }

  const handleChangeCliente = (newValue: string) => {
    formBag.setValue('cliente', {
      label: clientes.find((cliente) => cliente.value === newValue)?.label ?? '',
      value: newValue,
    });

    setIsAbleDownload(false);
  }

  const handleChangeRelatorio = (newValue: string) => {
    formBag.setValue('relatorio', {
      label: relatorios.find((relatorio) => relatorio.value === newValue)?.label ?? '',
      value: newValue,
    });

    setIsAbleDownload(false);
  }

  return (
    <Card
      className="flex flex-col gap-4 py-4 h-full w-full overflow-y-auto"
    >
      <CardContent>
        <form 
          className="space-y-6 flex flex-col gap-4 w-full"
          onSubmit={(event) => {
            formBag.handleSubmit(onSubmit)(event); // Garante que o `handleSubmit` seja chamado corretamente
          }}
        >
          <FieldMessage.Error.Root>
            <div className="space-y-1 w-full">
              <Label htmlFor="relatorio">Relatório</Label>
              <Select 
                {...formBag.register('relatorio')} 
                value={values.relatorio.value}
                onValueChange={handleChangeRelatorio}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Não selecionado" />
                </SelectTrigger>
                <SelectContent>
                  {relatorios.map((relatorio) => (
                    <SelectItem key={relatorio.value} value={relatorio.value}>
                      {relatorio.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <FieldMessage.Error.Text>
              { formBag.formState.errors.relatorio?.message }
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>

          <FieldMessage.Error.Root>
            <div className="space-y-1 w-full">
              <Label htmlFor="cliente">Cliente</Label>
              <Select 
                {...formBag.register('cliente')} 
                value={values.cliente.value}
                onValueChange={handleChangeCliente}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Não selecionado" />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem key={cliente.value} value={cliente.value}>
                      {cliente.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <FieldMessage.Error.Text>
              { formBag.formState.errors.cliente?.message }
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
                      
          <div className="flex flex-col w-full justify-center items-center gap-2">
            {
              isAbleDownload ? (
                <Link
                  href={linkRelatorio}
                  target="_blank"
                  className={[
                    'cursor-pointer', 
                    'bg-green-500 hover:bg-opacity-50', 
                    'text-white dark:text-black', 
                    'py-2 px-4 rounded text-sm font-semibold'
                  ].join(' ')}
                >
                  Download disponível
                </Link>
              ) : (
                <Button 
                  type="submit"
                  disabled={isSubmitting}
                >
                  { isSubmitting ? 'Solicitando...' : 'Solicitar relatório' }
                </Button>
              )
            }

          </div>

          <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Relatório</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Data e hora</TableHead>
              <TableHead>Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              linkHistorico.length > 0 ? (
              linkHistorico
                .sort((a, b) => b.data.getTime() - a.data.getTime())
                .map((item, index) => (
                <TableRow key={item.data.getTime()}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell className='w-full text-nowrap'>{item.relatorio}</TableCell>
                  <TableCell className='w-full text-nowrap'>{item.cliente}</TableCell>
                  <TableCell className='w-full text-nowrap'>{moment(item.data).locale('pt-br').format('DD/MM/YYYY HH:mm:ss')}</TableCell>
                  <TableCell className='w-full text-nowrap'>
                    <Link
                      href={item.link}
                      target="_blank"
                      className='text-green-500 font-semibold hover:bg-opacity-50'
                    >
                      Download
                    </Link>
                  </TableCell>
                </TableRow>
                ))
              ) : (
              <TableRow>
                <TableCell 
                colSpan={5}
                className='text-center'
                >
                Nenhum relatório solicitado
                </TableCell>
              </TableRow>
              )
            }
          </TableBody>
        </Table>
        </form>
      </CardContent>
    </Card>
  );
};

export default ReportFormGlobal;