import React from 'react';
import { useFormContext, UseFormReturn, useWatch } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FieldMessage } from '@/components/FieldMessage';
import { FileText } from 'lucide-react';
import { DadosDemandaProcon } from '../../interfaces';

interface PedidosProps {
  formBag: UseFormReturn<DadosDemandaProcon>;
}

const PedidosComponent = ({ formBag }: PedidosProps) => {
  console.log('Componente Pedidos renderizado');

  const { register, formState, setValue, clearErrors } = formBag;

  return (
    <div>
      <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
        <FileText className="w-5 h-5 mr-2 text-cyan-500" />
        <span>Pedidos</span>
      </h3>
      <div className="space-y-4 bg-cyan-50 dark:bg-cyan-950/30 p-3 rounded-md">
        <div className="space-y-2">
          <Label htmlFor="resumo_processo">Transcrição da reclamação</Label>
          <FieldMessage.Error.Root>
            <Textarea
              id="resumo_processo"
              rows={8}
              disabled
              placeholder="Digite a transcrição da reclamação..."
              className={`w-full  ${formState.errors.resumo_processo ? "border-red-500" : ""}`}
              {...register('resumo_processo')}
              onChange={(e) => {
                setValue('resumo_processo', e.target.value);
                clearErrors('resumo_processo');
              }}
            />
            <FieldMessage.Error.Text visible={!!formState.errors.resumo_processo}>
              {formState.errors.resumo_processo?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>
      </div>
    </div>
  );
};

export const Pedidos = React.memo(PedidosComponent, (prevProps, nextProps) => {
  // como não há props, sempre retorna true para não re-renderizar
  return true;
});
