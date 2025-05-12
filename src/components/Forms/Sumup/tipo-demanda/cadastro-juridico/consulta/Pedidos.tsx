import React from 'react';
import { UseFormReturn, useFormState } from 'react-hook-form';
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

  const { register, control } = formBag;

  const { errors } = useFormState({
    control,
    name: ['resumo_processo'],
  });

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
              {...register('resumo_processo')}
              id="resumo_processo"
              rows={8}
              disabled
              placeholder="Digite a transcrição da reclamação..."
              className={`w-full  ${errors.resumo_processo ? "border-red-500" : ""}`}
            />
            <FieldMessage.Error.Text visible={!!errors.resumo_processo}>
              {errors.resumo_processo?.message}
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
