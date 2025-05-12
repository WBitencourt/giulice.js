import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { picklist } from '../../../picklists';
import { Controller, UseFormReturn, useFormState, useWatch } from 'react-hook-form';
import { FormValues } from '.';
import { FieldMessage } from '@/components/FieldMessage';
import { FileText } from 'lucide-react';
import React from 'react';

interface ObjetoProps {
  formBag: UseFormReturn<FormValues, any, undefined>;
}

export function ObjetoComponent({ formBag }: ObjetoProps) {
  console.log('Componente Objeto renderizado');
  const { control, register } = formBag;

  const { errors } = useFormState({
    control,
    name: ['detalhe_objeto'],
  });

  const values = {
    detalhe_objeto: useWatch({ control, name: 'detalhe_objeto' }),
  }

  const textAreaValue = values.detalhe_objeto;

  return (
    <div>
      <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
        <FileText className="w-5 h-5 mr-2 text-cyan-500" />
        <span>Objeto</span>
      </h3>

      <div className="space-y-4 bg-cyan-50 dark:bg-cyan-950/30 p-3 rounded-md">
        <Label htmlFor="detalhe_objeto">Detalhe do objeto</Label>

        <Controller
          name="detalhe_objeto"
          control={control}
          render={({ field }) => (
            <RadioGroup 
              onValueChange={(value) => {
                field.onChange(value);
                formBag.setValue('detalhe_objeto', value);
              }} 
              className="space-y-3"
              disabled
            >
              {
                picklist.tipoDescricao.map((descricao, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <RadioGroupItem 
                      value={descricao} 
                      id={`descricao-${index}`} 
                      className="mt-1" 
                      checked={descricao === textAreaValue}
                    />
                    <Label 
                      htmlFor={`descricao-${index}`} 
                      className="text-sm font-normal leading-relaxed cursor-pointer"
                    >
                      { descricao }
                    </Label>
                  </div>
                ))
              }
            </RadioGroup>
          )}
        />

        <FieldMessage.Error.Root>
          <Textarea 
            {...register('detalhe_objeto')} 
            id="detalhe_objeto" 
            rows={6} 
            disabled
            className={`bg-white dark:bg-black ${errors.detalhe_objeto ? 'border-red-500' : ''}`}
          />
        <FieldMessage.Error.Text>
          {errors.detalhe_objeto?.message}
        </FieldMessage.Error.Text>
        </FieldMessage.Error.Root>
      </div>
    </div>
  
  );
}

export const Objeto = React.memo(ObjetoComponent, (prevProps, nextProps) => {
  return true
}); 
