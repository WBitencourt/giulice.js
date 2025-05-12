import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { FormValues } from '.';
import { UseFormReturn } from 'react-hook-form';
import { maskCurrencyBRL } from '@/utils/Masks';
import { Checkbox } from '@/components/ui/checkbox';
import { FieldMessage } from '@/components/FieldMessage';

interface AdditionalInfoFormProps {
  formBag: UseFormReturn<FormValues, any, undefined>;
}

export function AdditionalInfoForm({ formBag }: AdditionalInfoFormProps) {
  const { register, setValue, watch, formState, clearErrors } = formBag;

  const values = watch();

  return (
    <div className="flex flex-col gap-2">
      <div className="space-y-2">
        <Label htmlFor="data_distribuicao">Data de Distribuição</Label>
        <FieldMessage.Error.Root>
          <DatePicker
            date={values.data_distribuicao ? new Date(values.data_distribuicao) : undefined}
            onSelect={(date) => {
              setValue('data_distribuicao', date?.toISOString())
              clearErrors('data_distribuicao');
            }}
          />
          <FieldMessage.Error.Text>
            {formState.errors.data_distribuicao?.message}
          </FieldMessage.Error.Text>
        </FieldMessage.Error.Root>

      </div>

      <div className="space-y-2">
        <Label htmlFor="data_citacao">Data da Citação</Label>
        <DatePicker
          date={values.data_citacao ? new Date(values.data_citacao) : undefined}
          onSelect={(date) => setValue('data_citacao', date?.toISOString())}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="data_audiencia">Data da Audiência</Label>
        <DateTimePicker
          date={values.data_audiencia ? new Date(values.data_audiencia) : undefined}
          onSelect={(date) => setValue('data_audiencia', date?.toISOString())}
        />
      </div>

      {/* <div className="space-y-2">
        <Label htmlFor="data_liminar">Data da liminar/intimação</Label>
        <DatePicker
          date={values.data_liminar ? new Date(values.data_liminar) : undefined}
          onSelect={(date) => setValue('data_liminar', date?.toISOString())}
        />
      </div> */}

      <div className="space-y-2">
        <Label htmlFor="data_citacao_positiva">Data da citação positiva</Label>
        <DatePicker
          date={values.data_citacao_positiva ? new Date(values.data_citacao_positiva) : undefined}
          onSelect={(date) => setValue('data_citacao_positiva', date?.toISOString())}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prazo_liminar">Prazo da Liminar</Label>
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
          id="prazo_contestacao"
          type="number"
          {...register('prazo_contestacao')}
          placeholder="...prazo para apresentar contestação em dias..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="valor_causa">Valor da Causa</Label>
        <FieldMessage.Error.Root>
          <Input
            id="valor_causa"
            type="text"
            {...register('valor_causa')}
            placeholder="R$ 0,00"
            className={formState.errors.valor_causa ? 'border-red-500' : ''}
            value={values.valor_causa}
            onChange={(event) => {
              setValue('valor_causa', maskCurrencyBRL(event.target.value));
              clearErrors('valor_causa');
            }}
          />
          <FieldMessage.Error.Text>
            {formState.errors.valor_causa?.message}
          </FieldMessage.Error.Text>
        </FieldMessage.Error.Root>
      </div>

      <br />

      <div className="flex flex-col gap-4 rounded-md border p-2 bg-slate-100 dark:bg-slate-950">
        <legend className="text-sm">Andamentos</legend>

        <div className="flex gap-2 items-center">
          <Checkbox 
            id='checkbox-andamento_cedente_assumiu_demanda'
            checked={values?.andamento_cedente_assumiu_demanda}
            onCheckedChange={(checked) => {
              setValue('andamento_cedente_assumiu_demanda', checked === true);
            }}
          />
          <Label 
            htmlFor='checkbox-andamento_cedente_assumiu_demanda'
          >
            Cedente assumiu a demanda
          </Label>
        </div>
      </div>
      {/* <div className="flex flex-col gap-4 rounded-md border p-2 bg-slate-100 dark:bg-slate-950">
        <legend className="text-sm">Andamentos da demanda</legend>

        {andamentos?.map((option) => (
          <div key={option} className="flex gap-2 items-center">
            <Checkbox 
              id={`checkbox-${option}`} 
              checked={values?.andamentos?.includes(option)}
              onCheckedChange={(checked) => {
                if(checked) {
                  setValue('andamentos', [...values?.andamentos, option])
                } else {
                  setValue('andamentos', values?.andamentos
                    ?.filter((andamento) => andamento !== option)
                  )
                }
              }}
            />
            <Label htmlFor={`checkbox-${option}`}>{option}</Label>
          </div>
        ))}
      </div> */}
    </div>
  );
}
