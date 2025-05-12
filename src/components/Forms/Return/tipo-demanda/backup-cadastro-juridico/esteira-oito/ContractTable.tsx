import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { ContratoDemanda, UpdateContrato } from '../../interfaces';
import { UseFormReturn } from 'react-hook-form';
import { LoaderCircle } from 'lucide-react';
import { FormValues } from '.';

interface ContractTableProps {
  pk: string;
  isSelecionandoContrato: boolean;
  updateContrato: (props: UpdateContrato) => void;
  formBag: UseFormReturn<FormValues, any, undefined>;
}

export function ContractTable({ 
  pk, 
  updateContrato, 
  isSelecionandoContrato,
  formBag
}: ContractTableProps) {
  const { getValues } = formBag;

  const contratos = getValues('contrato') as ContratoDemanda[];

  if (!contratos || contratos.length === 0) return null;

  return (
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
            {/* <TableHead>Nome da Parte</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {contratos.map((contrato, index) => (
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
                      disabled={!contrato.located}
                      onCheckedChange={(checked) => updateContrato({
                        pk,
                        selectedContrato: contrato,
                        checked: checked as boolean,
                        rowIndex: index,
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
              {/* <TableCell>{contrato.nome_parte}</TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
