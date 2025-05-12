import { FormValues } from '.';
import { UseFormReturn } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { maskOAB } from '@/utils/Masks';
import { FieldMessage } from '@/components/FieldMessage';

interface AdvogadoFormProps {
  formBag: UseFormReturn<FormValues, any, undefined>;
}

export function AdvogadoForm({ 
  formBag
}: AdvogadoFormProps) {
  const { register, setValue, clearErrors } = formBag;

  const handleAdvogadoInexistente = () => {
    setValue('documento_advogado', 'SP-000000');
    setValue('nome_advogado', 'Advogado Inexistente');

    clearErrors('documento_advogado');
    clearErrors('nome_advogado');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome_advogado">Nome Advogado</Label>
        <FieldMessage.Error.Root> 
          <Input 
            {...register('nome_advogado')} 
            id="nome_advogado" 
            className={formBag.formState.errors.nome_advogado ? 'border-red-500' : ''}
            placeholder="Nome do Advogado" 
            onChange={(e) => {
              setValue('nome_advogado', e.target.value);
              clearErrors('nome_advogado');
            }}
          />
          <FieldMessage.Error.Text>
            {formBag.formState.errors.nome_advogado?.message}
          </FieldMessage.Error.Text>
        </FieldMessage.Error.Root>
      </div>

      <div className="space-y-2">
        <Label htmlFor="documento_advogado">OAB Advogado</Label>
        <FieldMessage.Error.Root>
          <div className="flex space-x-2">
            <Input 
              id="documento_advogado" 
              {...register('documento_advogado')} 
              onChange={(e) => {
                setValue('documento_advogado', maskOAB(e.target.value))
                clearErrors('documento_advogado');
              }}
              placeholder="OAB do Advogado" 
              className={formBag.formState.errors.documento_advogado ? 'border-red-500' : ''}
            />
            <Button variant="secondary" type="button" className="whitespace-nowrap" onClick={handleAdvogadoInexistente}>
              Advogado inexistente
            </Button>
          </div>
          <FieldMessage.Error.Text>
            {formBag.formState.errors.documento_advogado?.message}
          </FieldMessage.Error.Text>
        </FieldMessage.Error.Root>
      </div>
    </div>
  );
}
