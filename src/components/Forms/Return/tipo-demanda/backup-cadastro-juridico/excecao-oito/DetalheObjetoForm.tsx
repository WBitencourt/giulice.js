import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { picklist } from '../../../picklists';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from '.';

interface DetalheObjetoFormProps {
  formBag: UseFormReturn<FormValues, any, undefined>;
}

export function DetalheObjetoForm({ formBag }: DetalheObjetoFormProps) {
  const { register, setValue, getValues } = formBag;

  const textAreaValue = getValues('detalhe_objeto');

  const handleRadioChange = (value: string) => {
    setValue('detalhe_objeto', value);
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
                disabled
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

      <Textarea 
        id="detalhe_objeto" 
        {...register('detalhe_objeto')} 
        disabled
        rows={6} 
        className="bg-white dark:bg-black" 
      />
    </div>
  );
}
