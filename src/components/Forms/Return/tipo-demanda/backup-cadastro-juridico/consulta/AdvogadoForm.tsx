import { FormValues } from '.';
import { UseFormReturn } from 'react-hook-form';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { maskOAB } from '@/utils/Masks';

interface AdvogadoFormProps {
  formBag: UseFormReturn<FormValues, any, undefined>;
}

export function AdvogadoForm({ 
  formBag
}: AdvogadoFormProps) {
  const { register, setValue } = formBag;

  const handleAdvogadoInexistente = () => {
    setValue('documento_advogado', 'SP-000000');
    setValue('nome_advogado', 'Advogado Inexistente');
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nome_advogado">Nome Advogado</Label>
        <Input 
          id="nome_advogado" 
          disabled
          {...register('nome_advogado')} 
          placeholder="Nome do Advogado" 
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="documento_advogado">OAB Advogado</Label>
        <div className="flex space-x-2">
          <Input 
            id="documento_advogado" 
            disabled
            {...register('documento_advogado')} 
            onChange={(e) => setValue('documento_advogado', maskOAB(e.target.value))}
            placeholder="OAB do Advogado" 
          />
          <Button disabled variant="secondary" type="button" className="whitespace-nowrap" onClick={handleAdvogadoInexistente}>
            Advogado inexistente
          </Button>
        </div>
      </div>
    </div>
  );
}
