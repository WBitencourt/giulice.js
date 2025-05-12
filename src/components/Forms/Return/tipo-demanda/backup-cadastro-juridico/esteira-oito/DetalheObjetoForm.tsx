import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { picklist } from '../../../picklists';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '.';
import { FieldMessage } from '@/components/FieldMessage';

interface DetalheObjetoFormProps {
  formBag: UseFormReturn<FormValues, any, undefined>;
}

export function DetalheObjetoForm({ formBag }: DetalheObjetoFormProps) {
  const { register, setValue, watch, formState, clearErrors } = formBag;

  const values = watch();
  const textAreaValue = values.detalhe_objeto;

  const handleRadioChange = (value: string) => {
    setValue('detalhe_objeto', value);
    clearErrors('detalhe_objeto');
  };

  return (
    <div className="space-y-4 border rounded-md p-2 bg-slate-100 dark:bg-slate-950">
      <Label htmlFor="detalhe_objeto">Detalhe do Objeto</Label>

      <RadioGroup 
        onValueChange={handleRadioChange} 
        className="space-y-3"
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

      <FieldMessage.Error.Root>
        <Textarea 
          id="detalhe_objeto" 
          {...register('detalhe_objeto')} 
          rows={6} 
          className={`bg-white dark:bg-black ${formState.errors.detalhe_objeto ? 'border-red-500' : ''}`}
          onChange={(e) => {
            setValue('detalhe_objeto', e.target.value);
            clearErrors('detalhe_objeto');
          }}
        />
        <FieldMessage.Error.Text>
          {formState.errors.detalhe_objeto?.message}
        </FieldMessage.Error.Text>
      </FieldMessage.Error.Root>
    </div>
  );
}
