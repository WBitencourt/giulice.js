import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DatePicker } from '@/components/ui/date-picker';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { FormValues } from '.';
import { UseFormReturn } from 'react-hook-form';
import { maskCurrencyBRL } from '@/utils/Masks';
import { Checkbox } from '@/components/ui/checkbox';

interface AdditionalInfoFormProps {
  formBag: UseFormReturn<FormValues, any, undefined>;
}

export function AdditionalInfoForm({ formBag }: AdditionalInfoFormProps) {
  const { register, setValue, getValues } = formBag;

  const values = getValues()

  return (
    <div className="flex flex-col gap-2">
      <div className="space-y-2">
        <Label htmlFor="data_distribuicao">Data de Distribuição</Label>
        <DatePicker
          disabled
          date={values.data_distribuicao ? new Date(values.data_distribuicao) : undefined}
          onSelect={(date) => {
            console.log(date?.toISOString())
            setValue('data_distribuicao', date?.toISOString())
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="data_citacao">Data da Citação</Label>
        <DatePicker
          disabled
          date={values.data_citacao ? new Date(values.data_citacao) : undefined}
          onSelect={(date) => setValue('data_citacao', date?.toISOString())}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="data_audiencia">Data da Audiência</Label>
        <DateTimePicker
          disabled
          date={values.data_audiencia ? new Date(values.data_audiencia) : undefined}
          onSelect={(date) => setValue('data_audiencia', date?.toISOString())}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="data_citacao_positiva">Data da citação positiva</Label>
        <DatePicker
          disabled
          date={values.data_citacao_positiva ? new Date(values.data_citacao_positiva) : undefined}
          onSelect={(date) => setValue('data_citacao_positiva', date?.toISOString())}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="prazo_liminar">Prazo da Liminar</Label>
        <Input
          {...register('prazo_liminar')}
          disabled
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
          disabled
          {...register('prazo_contestacao', { required: true })}
          placeholder="...prazo para apresentar contestação em dias..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="valor_causa">Valor da Causa</Label>
        <Input
          {...register('valor_causa', { required: true })}
          disabled
          id="valor_causa"
          type="text"
          placeholder="...valor da causa..."
          onChange={(event) => {
            const rawValue = event.target.value.replace(/\D/g, ''); // Remove tudo que não for número
            const formattedValue = maskCurrencyBRL(rawValue); // Formata o valor para BRL
            setValue('valor_causa', formattedValue); // Atualiza o valor não formatado no formulário
          }}
        />
      </div>

      <br />

      <div className="flex flex-col gap-4 rounded-md border p-2 bg-slate-100 dark:bg-slate-950">
        <legend className="text-sm">Andamentos</legend>

        <div className="flex gap-2 items-center">
          <Checkbox 
            id='checkbox-andamento_cedente_assumiu_demanda'
            disabled
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
