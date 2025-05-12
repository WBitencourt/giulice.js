import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ContratoDemanda, DemandaCadastroJuridicoReturn } from '../../interfaces';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { LoaderCircle, ReceiptText } from 'lucide-react';
import { FormValues } from '.';
import { useState } from 'react';
import { actions } from '@/actionsV2';
import { toast } from '@/utils/toast';
import React from 'react';

interface TabelaContratoProps {
  pk: string;
  formBag: UseFormReturn<FormValues, any, undefined>;
  updateFormValues: (newValues: Partial<DemandaCadastroJuridicoReturn>) => void;
}

interface UpdateContrato {
  selectedContrato: ContratoDemanda,
  checked: boolean,
}

export function TabelaContratoComponent({ 
  pk, 
  formBag,
  updateFormValues
}: TabelaContratoProps) {
  console.log('Componente TabelaContrato renderizado');
  const { control } = formBag;

  const [isSelecionandoContrato, setIsSelecionandoContrato] = useState(false);

  const values = {
    contratos: useWatch({ control, name: 'contrato' }),
  }

  if (!values.contratos || values.contratos.length === 0) return null;

  const handleUpdateContrato = async ({
    selectedContrato,
    checked,
  }: UpdateContrato) => {
    try {
      setIsSelecionandoContrato(true);

      if (!values.contratos) {
        return;
      }
  
      await actions.backend.cliente.return.selecionaContrato({
        pk, 
        bindingId: selectedContrato.bindingId.toString(),
      });

      toast.success({
        title: 'Sucesso',
        description: `Contrato ${checked ? 'selecionado' : 'desconsiderado'} com sucesso.`,
      });

      const dadosEsteiraOito = await actions.backend.demanda.getDadosDemandaEsteiraOito({ pk });

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

  return (
    <div>
    <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
      <ReceiptText className="w-5 h-5 mr-2 text-green-500" />
      <span>Contratos</span>
    </h3>

    <div className="space-y-4 bg-green-50 dark:bg-green-950/30 p-3 rounded-md">
      <div className="overflow-x-auto rounded-md bg-slate-100 dark:bg-slate-950">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Selecionar</TableHead>
              <TableHead>Contrato Original</TableHead>
              <TableHead>ID do Débito</TableHead>
              <TableHead>ID de Vinculação</TableHead>
              <TableHead>Saldo Original</TableHead>
              <TableHead>1o Atraso</TableHead>
              <TableHead>Nome do Portfólio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {values.contratos.map((contrato, index) => (
              <TableRow
                key={index}
                className={`${contrato.selected ? 'bg-green-100 dark:bg-emerald-950' : ''} ${!contrato.located ? 'bg-red-100 dark:bg-red-950' : ''}`}
              >
                <TableCell>
                  {
                    isSelecionandoContrato ? (
                      <LoaderCircle
                        className="animate-spin text-black dark:text-white h-4 w-4" 
                      />
                    ) : (
                      <Checkbox
                        id={`contract-${index}`}
                        checked={contrato.selected}
                        disabled
                        onCheckedChange={(checked) => handleUpdateContrato({
                          selectedContrato: contrato,
                          checked: checked as boolean,
                        })}
                      />
                    )
                  }
                </TableCell>
                <TableCell>{contrato.ContratoOriginal}</TableCell>
                <TableCell>{contrato.debtId}</TableCell>
                <TableCell>{contrato.bindingId}</TableCell>
                <TableCell>
                  {contrato.SaldoOriginal?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </TableCell>
                <TableCell>
                  {contrato.PrimeiroAtraso ? new Date(contrato.PrimeiroAtraso).toLocaleDateString('pt-BR') : ''}
                </TableCell>
                <TableCell>
                  {contrato.located ? contrato.portfolioName : `Erro => **${contrato.portfolioName}**`}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  </div>

  );
}

export const TabelaContrato = React.memo(TabelaContratoComponent, (prevProps, nextProps) => {
  if (prevProps.pk !== nextProps.pk) {
    return false;
  }

  return true
}); 
