import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DadosDemandaOficioJudicial } from '../../interfaces';
import { UseFormReturn } from 'react-hook-form';
import { picklist } from '../../../picklists';
import { maskNumeroProcesso } from '@/utils/Masks';
import { FieldMessage } from '@/components/FieldMessage';

interface ProcessInfoFormProps {
  formBag: UseFormReturn<DadosDemandaOficioJudicial, any, undefined>;
  isConsultandoProcesso: boolean;
  handleConsultaProcesso: () => void;
}

export function ProcessInfoForm({ 
  formBag, 
  isConsultandoProcesso, 
  handleConsultaProcesso,
}: ProcessInfoFormProps) {
  const { register, setValue, watch, formState, clearErrors } = formBag;

  const values = watch()
  
  return (
    <div className="flex flex-col gap-2">
      <div className="space-y-2">
        <Label htmlFor="processo">Número do processo</Label>
        <div className="flex space-x-2">
          <Input 
            id="processo" 
            disabled
            {...register('processo')} 
            placeholder="...número do processo..." 
            onChange={(e) => setValue('processo', maskNumeroProcesso(e.target.value))}
          />
          <Button type="button" onClick={handleConsultaProcesso}>
            { isConsultandoProcesso ? 'Consultando...' : 'Consultar' }
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="identificacao">Identificação</Label>
        <Input 
          id="identificacao" 
          {...formBag.register('identificacao')} 
          placeholder="...número do identificação..." 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="uf">UF</Label>
        <FieldMessage.Error.Root>  
          <Select 
            value={values.uf} 
            onValueChange={(value) => {
              setValue('uf', value);
              clearErrors('uf');
            }}
          >
            <SelectTrigger className={formState.errors.uf ? 'border-red-500' : ''}>
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
          <FieldMessage.Error.Text>
            {formState.errors.uf?.message}
          </FieldMessage.Error.Text>
        </FieldMessage.Error.Root>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tribunal">Tribunal</Label>
        <FieldMessage.Error.Root>  
          <Input 
            id="tribunal" 
            {...register('tribunal')} 
            placeholder="Tribunal" 
            className={formState.errors.tribunal ? 'border-red-500' : ''}
            onChange={(e) => {
              setValue('tribunal', e.target.value);
              clearErrors('tribunal');
            }}
          />
          <FieldMessage.Error.Text>
            {formState.errors.tribunal?.message}
          </FieldMessage.Error.Text>
        </FieldMessage.Error.Root>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comarca">Comarca</Label>
        <FieldMessage.Error.Root>  
          <Input 
            id="comarca" 
            {...register('comarca')} 
            placeholder="Comarca" 
            className={formState.errors.comarca ? 'border-red-500' : ''}
            onChange={(e) => {
              setValue('comarca', e.target.value);
              clearErrors('comarca');
            }}
          />
          <FieldMessage.Error.Text>
            {formState.errors.comarca?.message}
          </FieldMessage.Error.Text>
        </FieldMessage.Error.Root>
      </div>

      <div className="space-y-2">
        <Label htmlFor="foro">Foro</Label>
        <FieldMessage.Error.Root>  
          <Input 
            id="foro" 
            {...register('foro')} 
            placeholder="Foro" 
            className={formState.errors.foro ? 'border-red-500' : ''}
            onChange={(e) => {
              setValue('foro', e.target.value);
              clearErrors('foro');
            }}
          />
          <FieldMessage.Error.Text>
            {formState.errors.foro?.message}
          </FieldMessage.Error.Text>
        </FieldMessage.Error.Root>
      </div>

      <div className="space-y-2">
        <Label htmlFor="vara">Vara</Label>
        <FieldMessage.Error.Root>  
          <Input 
            id="vara" 
            {...register('vara')} 
            placeholder="Vara" 
            className={formState.errors.vara ? 'border-red-500' : ''}
            onChange={(e) => {
              setValue('vara', e.target.value);
              clearErrors('vara');
            }}
          />
          <FieldMessage.Error.Text>
            {formState.errors.vara?.message}
          </FieldMessage.Error.Text>
        </FieldMessage.Error.Root>
      </div>
    </div>
  );
}
