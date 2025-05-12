import { FormValues } from '.';
import { Controller, UseFormReturn, useFormState } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { FieldMessage } from '@/components/FieldMessage';
import { Briefcase } from 'lucide-react';
import React from 'react';
import { maskOAB } from '@/utils/Masks';

interface AdvogadoProps {
  formBag: UseFormReturn<FormValues, any, undefined>;
}

export function AdvogadoComponent({ 
  formBag
}: AdvogadoProps) {
  console.log('Componente Advogado renderizado');
  
  const { register, setValue, clearErrors, control } = formBag;

  const { errors } = useFormState({
    control,
    name: ['nome_advogado', 'documento_advogado'],
  });

  const handleAdvogadoInexistente = () => {
    setValue('documento_advogado', 'SP-000000');
    setValue('nome_advogado', 'Advogado Inexistente');

    clearErrors('documento_advogado');
    clearErrors('nome_advogado');
  };

  return (
    <div>
      <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
        <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
        <span>Advogado</span>
      </h3>

      <div className="space-y-4 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md">
        <div className="space-y-2">
          <Label htmlFor="nome_advogado">Nome Advogado</Label>
          <FieldMessage.Error.Root> 
            <Input 
              {...register('nome_advogado')} 
              id="nome_advogado" 
              className={errors.nome_advogado ? 'border-red-500' : ''}
              placeholder="Nome do Advogado" 
            />
            <FieldMessage.Error.Text>
              {errors.nome_advogado?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>

        <div className="space-y-2">
          <Label htmlFor="documento_advogado">OAB Advogado</Label>
          <FieldMessage.Error.Root>
            <Controller
              name="documento_advogado"
              control={control}
              render={({ field }) => (
                <div className="flex space-x-2">
                  <Input 
                    id="documento_advogado" 
                    placeholder="OAB do Advogado" 
                    className={errors.documento_advogado ? 'border-red-500' : ''}
                    onChange={(e) => {
                      field.onChange(maskOAB(e.target.value))
                    }}
                    value={field.value}
                  />
                  <Button 
                    type="button" 
                    className="whitespace-nowrap" 
                    onClick={handleAdvogadoInexistente}
                  >
                    Advogado inexistente
                  </Button>
                </div>
              )}
            />

            <FieldMessage.Error.Text>
              {errors.documento_advogado?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>
      </div>
    </div>
  );
}

export const Advogado = React.memo(AdvogadoComponent, (prevProps, nextProps) => {
  return true
}); 
