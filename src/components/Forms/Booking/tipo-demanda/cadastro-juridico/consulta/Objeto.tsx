import React from 'react';
import { Controller, ControllerRenderProps, UseFormReturn, useFormState, useWatch } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { FieldMessage } from '@/components/FieldMessage';
import { Briefcase, X } from 'lucide-react';
import { DemandaCadastroJuridico } from '../../interfaces';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface PedidosProps {
  formBag: UseFormReturn<DemandaCadastroJuridico>;
}

const ObjetoComponent = ({ formBag }: PedidosProps) => {
  console.log('Componente Objeto renderizado');

  const { control, register, setValue } = formBag;

  const { errors } = useFormState({
    control,
    name: ['objeto'],
  });

  const values = {
    objeto: useWatch({ control, name: 'objeto' }),
    numero_reserva: useWatch({ control, name: 'numero_reserva' }),
  }

  const handleNumeroReservaChange = (e: React.ChangeEvent<HTMLInputElement>, field: ControllerRenderProps<DemandaCadastroJuridico, "numero_reserva">) => {
    const value = e.target.value;
    
    // Verifica se o valor contém apenas números e no máximo um hífen
    if (/^[0-9]+(-[0-9]+)?$|^[0-9]*-?[0-9]*$/.test(value)) {
      field.onChange(value);
    }
  };

  return (
    <div>
      <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
        <Briefcase className="w-5 h-5 mr-2 text-cyan-500" />
        <span>Objetos</span>
      </h3>
      <div className="space-y-4 bg-cyan-50 dark:bg-cyan-950/30 p-3 rounded-md">
        <div className="flex flex-col gap-2">
          <Label className="block text-sm mb-1">Objeto</Label>
          <FieldMessage.Error.Root>     
            <Controller
              name="objeto"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}                 
                    disabled
                  >
                    <SelectTrigger ref={field.ref} className={errors.objeto ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecione o objeto" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Passagem aérea">Passagem aérea</SelectItem>
                      <SelectItem value="Parceiro">Parceiro</SelectItem>
                      <SelectItem value="Hospedagem">Hospedagem</SelectItem>
                      <SelectItem value="Aluguel de carro">Aluguel de carro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
            <FieldMessage.Error.Text>
              {errors.objeto?.message}
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
      </div>
    </div>
  );
};

export const Objeto = React.memo(ObjetoComponent, (prevProps, nextProps) => {
  // como não há props, sempre retorna true para não re-renderizar
  return true;
});
