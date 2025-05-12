import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormValues } from '.';
import { UseFormReturn } from 'react-hook-form';
import { picklist } from '../../../picklists';
import { maskNumeroProcesso } from '@/utils/Masks';

interface ProcessInfoFormProps {
  formBag: UseFormReturn<FormValues, any, undefined>;
  isConsultandoProcesso: boolean;
  handleConsultaProcesso: () => void;
}

export function ProcessInfoForm({ 
  formBag, 
  isConsultandoProcesso, 
  handleConsultaProcesso 
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
            disabled
            {...register('processo')} 
            placeholder="...número do processo..." 
            onChange={(e) => setValue('processo', maskNumeroProcesso(e.target.value))}
          />
          <Button 
            type="button" 
            disabled
            onClick={handleConsultaProcesso}
          >
            { isConsultandoProcesso ? 'Consultando...' : 'Consultar' }
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="empresa_fundo">Empresa/Fundo</Label>
        <Select 
          {...register('empresa_fundo')} 
          disabled
          value={values.empresa_fundo}
          onValueChange={(value) => setValue('empresa_fundo', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a empresa/fundo" />
          </SelectTrigger>
          <SelectContent>
            {picklist.tipoEmpresaFundo.map((empresa) => (
              <SelectItem key={empresa.nome} value={empresa.nome}>
                {empresa.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
        <Input id="tribunal" disabled {...register('tribunal', { required: true })} placeholder="Tribunal" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="comarca">Comarca</Label>
        <Input id="comarca" disabled {...register('comarca', { required: true })} placeholder="Comarca" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="foro">Foro</Label>
        <Input id="foro" disabled {...register('foro', { required: true })} placeholder="Foro" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="vara">Vara</Label>
        <Input id="vara" disabled {...register('vara', { required: true })} placeholder="Vara" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tipo_justica">Tipo de Justiça</Label>
        <Select 
          {...register('tipo_justica')} 
          disabled
          value={values.tipo_justica}
          onValueChange={(value) => setValue('tipo_justica', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de justiça" />
          </SelectTrigger>
          <SelectContent>
            {picklist.tipoJustica.map((justica) => (
              <SelectItem key={justica.nome} value={justica.nome}>
                {justica.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="acao">Tipo de Ação</Label>
        <Select 
          {...register('tipo_acao')} 
          disabled
          value={values.tipo_acao}
          onValueChange={(value) => setValue('tipo_acao', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo de ação" />
          </SelectTrigger>
          <SelectContent>
            {picklist.tipoAcao.map((acao) => (
              <SelectItem key={acao.nome} value={acao.nome}>
                {acao.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="causa_pedir">Causa Pedir</Label>
        <Select 
          {...register('causa_pedir')} 
          disabled
          value={values.causa_pedir}
          onValueChange={(value) => setValue('causa_pedir', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a causa pedir" />
          </SelectTrigger>
          <SelectContent>
            {picklist.tipoCausaPedir.map((causa) => (
              <SelectItem key={causa.nome} value={causa.nome}>
                {causa.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
