import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DadosDemandaOficioJudicial } from '../../interfaces';
import { UseFormReturn } from 'react-hook-form';
import { picklist } from '../../../picklists';
import { maskNumeroProcesso } from '@/utils/Masks';

interface ProcessInfoFormProps {
  formBag: UseFormReturn<DadosDemandaOficioJudicial, any, undefined>;
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
          {/* <Button type="button" onClick={handleConsultaProcesso}>
            { isConsultandoProcesso ? 'Consultando...' : 'Consultar' }
          </Button> */}
          {/* <Button 
            type="button"
            onClick={handleClickEnviarDesdobramento}
            disabled={isEnviandoDesdobramento}
          >
            { isEnviandoDesdobramento ? 'Enviando...' : 'Desdobramento' }
          </Button> */}
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
        <Label htmlFor="tribunal">Tribunal</Label>
        <Input disabled id="tribunal" {...register('tribunal')} placeholder="Tribunal" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="comarca">Comarca</Label>
        <Input disabled id="comarca" {...register('comarca')} placeholder="Comarca" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="foro">Foro</Label>
        <Input disabled id="foro" {...register('foro')} placeholder="Foro" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="vara">Vara</Label>
        <Input disabled id="vara" {...register('vara')} placeholder="Vara" />
      </div>
    </div>
  );
}
