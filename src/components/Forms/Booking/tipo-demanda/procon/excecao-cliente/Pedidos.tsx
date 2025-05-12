import React from 'react';
import { Controller, ControllerRenderProps, UseFormReturn, useFormState } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FieldMessage } from '@/components/FieldMessage';
import { FileText } from 'lucide-react';
import { DemandaProcon } from '../../interfaces';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface PedidosProps {
  formBag: UseFormReturn<DemandaProcon>;
}

const PedidosComponent = ({ formBag }: PedidosProps) => {
  console.log('Componente Pedidos renderizado');

  const { register, control } = formBag;

  const { errors } = useFormState({
    control,
    name: ['resumo_processo'],
  });

  const handleNumeroReservaChange = (e: React.ChangeEvent<HTMLInputElement>, field: ControllerRenderProps<DemandaProcon, "numero_reserva">) => {
    const value = e.target.value;
    
    // Verifica se o valor contém apenas números e no máximo um hífen
    if (/^[0-9]+(-[0-9]+)?$|^[0-9]*-?[0-9]*$/.test(value)) {
      field.onChange(value);
    }
  };

  return (
    <div>
      <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
        <FileText className="w-5 h-5 mr-2 text-cyan-500" />
        <span>Objetos e pedidos</span>
      </h3>
      <div className="space-y-4 bg-cyan-50 dark:bg-cyan-950/30 p-3 rounded-md">
        <div className="space-y-2">
          <Label htmlFor="objeto">Objeto</Label>
          <FieldMessage.Error.Root>
            <Controller
              name="objeto"
              control={formBag.control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}>
                  <SelectTrigger ref={field.ref} className={formBag.formState.errors.objeto ? "border-red-500" : ""} disabled>
                    <SelectValue placeholder="Selecione o Objeto" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Passagem aérea">Passagem aérea</SelectItem>
                    <SelectItem value="Hospedagem">Hospedagem</SelectItem>
                    <SelectItem value="Locação de veículo">Locação de veículo</SelectItem>
                    <SelectItem value="Seguro viagem">Seguro viagem</SelectItem>
                    <SelectItem value="Serviços diversos">Serviços diversos</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldMessage.Error.Text visible={!!formBag.formState.errors.objeto}>
              {formBag.formState.errors.objeto?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>
        <div>
          <Controller
            name="numero_reserva"
            control={formBag.control}
            render={({ field }) => (
              <div>
                <Label className="block text-sm mb-1">Número da reserva</Label>
                <Input
                  ref={field.ref}
                  type="text"
                  disabled
                  placeholder="Número da reserva"
                  className="w-full p-2 border rounded-md text-sm"
                  onChange={(e) => handleNumeroReservaChange(e, field)}
                  value={field.value}
                />
              </div>
            )}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="resumo_processo">Transcrição da reclamação</Label>
          <FieldMessage.Error.Root>
            <Textarea
              {...register('resumo_processo')}
              id="resumo_processo"
              rows={8}
              placeholder="Digite a transcrição da reclamação..."
              disabled
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
