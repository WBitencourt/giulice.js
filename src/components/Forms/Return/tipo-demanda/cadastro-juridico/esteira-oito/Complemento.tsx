import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { FormValues } from '.';
import { Controller, UseFormReturn, useFormState, useWatch } from 'react-hook-form';
import { maskCurrencyBRL } from '@/utils/Masks';
import { Checkbox } from '@/components/ui/checkbox';
import { FieldMessage } from '@/components/FieldMessage';
import { GitBranchPlus } from 'lucide-react';
import React from 'react';

interface ComplementoProps {
  formBag: UseFormReturn<FormValues, any, undefined>;
}

export function ComplementoComponent({ formBag }: ComplementoProps) {
  console.log('Componente Complemento renderizado');
  
  const { register, control } = formBag;

  const { errors } = useFormState({
    control,
    name: ['data_distribuicao', 'data_citacao', 'data_audiencia', 'data_citacao_positiva', 'prazo_liminar', 'prazo_contestacao', 'valor_causa', 'andamento_cedente_assumiu_demanda'],
  });

  return (
    <div>
      <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
        <GitBranchPlus className="w-5 h-5 mr-2 text-rose-500" />
        <span>Complemento</span>
      </h3>

      <div className="space-y-4 bg-rose-50 dark:bg-rose-950/30 p-3 rounded-md">
        <div className="space-y-2">
          <Label htmlFor="data_distribuicao">Data de distribuição</Label>
          <FieldMessage.Error.Root>
            <Controller
              name="data_distribuicao"
              control={control}
              render={({ field }) => (
                <DatePicker
                  date={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => {
                    field.onChange(date?.toISOString())
                  }}
                />
              )}
            />
              
            <FieldMessage.Error.Text>
              {
                errors.data_distribuicao?.message
              }
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>

        </div>

        <div className="space-y-2">
          <Label htmlFor="data_citacao">Data da citação</Label>
          <Controller
            name="data_citacao"
            control={control}
            render={({ field }) => (
              <DatePicker
                date={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  field.onChange(date?.toISOString())
                }}
              />
            )}
          />

        </div>

        <div className="space-y-2">
          <Label htmlFor="data_audiencia">Data da audiência</Label>
          <Controller
            name="data_audiencia"
            control={control}
            render={({ field }) => (
              <DateTimePicker
                date={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  field.onChange(date?.toISOString())
                }}
              />
            )}
          />

        </div>

        <div className="space-y-2">
          <Label htmlFor="data_citacao_positiva">Data da citação positiva</Label>
          <Controller
            name="data_citacao_positiva"
            control={control}
            render={({ field }) => (
              <DatePicker
                date={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => {
                  field.onChange(date?.toISOString())
                }}
              />
            )}
          />

        </div>

        <div className="space-y-2">
          <Label htmlFor="prazo_liminar">Prazo da liminar</Label>
          <Input
            {...register('prazo_liminar')}
            id="prazo_liminar"
            type="number"
            placeholder="Prazo da Liminar"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="prazo_contestacao">Prazo para apresentar contestação em dias</Label>
          <Input
            {...register('prazo_contestacao')}
            id="prazo_contestacao"
            type="number"
            placeholder="...prazo para apresentar contestação em dias..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="valor_causa">Valor da causa</Label>
          <FieldMessage.Error.Root>
            <Controller
              name="valor_causa"
              control={control}
              render={({ field }) => (
                <Input
                  id="valor_causa"
                  type="text"
                  placeholder="R$ 0,00"
                  className={errors.valor_causa ? 'border-red-500' : ''}
                  value={field.value}
                  onChange={(event) => {
                    field.onChange(maskCurrencyBRL(event.target.value));
                  }}
                />
              )}
            />

          <FieldMessage.Error.Text>
            {
              errors.valor_causa?.message
            }
          </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>

        <br />

        <div className="flex flex-col gap-4 rounded-md border p-2 bg-slate-100 dark:bg-slate-950">
          <legend className="text-sm">Andamentos</legend>
          <Controller
            name="andamento_cedente_assumiu_demanda"
            control={control}
            render={({ field }) => (
              <div className="flex gap-2 items-center">
                <Checkbox 
                  id='checkbox-andamento_cedente_assumiu_demanda'
                  checked={field.value}
                  onCheckedChange={(checked) => {
                    field.onChange(checked === true);
                  }}
                />
                <Label 
                  htmlFor='checkbox-andamento_cedente_assumiu_demanda'
                >
                  Cedente assumiu a demanda
                </Label>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}

export const Complemento = React.memo(ComplementoComponent, (prevProps, nextProps) => {
  return true
}); 
