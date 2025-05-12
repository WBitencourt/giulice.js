import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DadosDemandaOficioPolicial } from '../../interfaces';
import { UseFormReturn } from 'react-hook-form';
import { picklist } from '../../../picklists';
import { maskNumeroProcesso } from '@/utils/Masks';

interface ProcessInfoFormProps {
  formBag: UseFormReturn<DadosDemandaOficioPolicial, any, undefined>;
}

export function ProcessInfoForm({ 
  formBag,
}: ProcessInfoFormProps) {
  const { register, setValue, watch } = formBag;

  const values = watch()
  
  return (
    <div className="flex flex-col gap-2">
      <div className="space-y-2">
        <Label htmlFor="processo">Número do processo</Label>
        <div className="flex space-x-2">
          <Input 
            id="processo" 
            {...register('processo')} 
            disabled
            placeholder="...número do processo..." 
            onChange={(e) => setValue('processo', maskNumeroProcesso(e.target.value))}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="identificacao">Identificação</Label>
        <Input 
          id="identificacao" 
          {...formBag.register('identificacao')} 
          disabled
          placeholder="...número do identificação..." 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="uf">UF</Label>
        <Select 
          {...register('uf')} 
          disabled
          value={values.uf} 
          onValueChange={(value) => setValue('uf', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a UF" />
          </SelectTrigger>
          <SelectContent>
            {picklist.ufs.map((uf) => (
              <SelectItem key={uf.nome} value={uf.nome}>
                {uf.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="delegacia">Delegacia</Label>
        <Input id="delegacia" {...register('delegacia')} placeholder="delegacia" disabled />
      </div>

      <div className="space-y-2">
        <Label htmlFor="distrito">Distrito</Label>
        <Input id="distrito" {...register('distrito')} placeholder="distrito" disabled />
      </div>
    </div>
  );
}
