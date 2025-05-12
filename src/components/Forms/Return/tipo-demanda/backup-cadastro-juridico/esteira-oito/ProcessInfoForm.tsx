import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormValues } from '.';
import { UseFormReturn } from 'react-hook-form';
import { picklist } from '../../../picklists';
import { maskNumeroProcesso } from '@/utils/Masks';
import { FieldMessage } from '@/components/FieldMessage';

interface ProcessInfoFormProps {
  formBag: UseFormReturn<FormValues, any, undefined>;
  isConsultandoProcesso: boolean;
  isEnviandoDesdobramento: boolean;
  handleConsultaProcesso: () => void;
  handleClickEnviarDesdobramento: () => void;
}

export function ProcessInfoForm({ 
  formBag, 
  isConsultandoProcesso, 
  isEnviandoDesdobramento,
  handleConsultaProcesso,
  handleClickEnviarDesdobramento
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
            {...register('processo')} 
            placeholder="...número do processo..." 
            className={formState.errors.processo ? 'border-red-500' : ''}
            onChange={(e) => {
              setValue('processo', maskNumeroProcesso(e.target.value));
              clearErrors('processo');
            }}
          />
          <Button type="button" onClick={handleConsultaProcesso}>
            { isConsultandoProcesso ? 'Consultando...' : 'Consultar' }
          </Button>
          <Button 
            type="button"
            onClick={handleClickEnviarDesdobramento}
            disabled={isEnviandoDesdobramento}
          >
            { isEnviandoDesdobramento ? 'Enviando...' : 'Desdobramento' }
          </Button>
        </div>
        {formState.errors.processo && (
          <FieldMessage.Error.Text>
            {formState.errors.processo.message}
          </FieldMessage.Error.Text>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="empresa_fundo">Empresa/Fundo</Label>
        <FieldMessage.Error.Root>
          <Select 
            value={values.empresa_fundo} 
            onValueChange={(value) => {
              setValue('empresa_fundo', value);
              clearErrors('empresa_fundo');
            }}
          >
            <SelectTrigger className={formState.errors.empresa_fundo ? 'border-red-500' : ''}>
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
          <FieldMessage.Error.Text>
            {formState.errors.empresa_fundo?.message}
          </FieldMessage.Error.Text>
        </FieldMessage.Error.Root>
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

      <div className="space-y-2">
        <Label htmlFor="tipo_justica">Tipo de Justiça</Label>
        <FieldMessage.Error.Root>
          <Select 
            value={values.tipo_justica} 
            onValueChange={(value) => {
              setValue('tipo_justica', value);
              clearErrors('tipo_justica');
            }}
          >
            <SelectTrigger className={formState.errors.tipo_justica ? 'border-red-500' : ''}>
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
          <FieldMessage.Error.Text>
            {formState.errors.tipo_justica?.message}
          </FieldMessage.Error.Text>
        </FieldMessage.Error.Root>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tipo_acao">Tipo de Ação</Label>
        <FieldMessage.Error.Root>
          <Select 
            value={values.tipo_acao} 
            onValueChange={(value) => {
              setValue('tipo_acao', value);
              clearErrors('tipo_acao');
            }}
          >
            <SelectTrigger className={formState.errors.tipo_acao ? 'border-red-500' : ''}>
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
          <FieldMessage.Error.Text>
            {formState.errors.tipo_acao?.message}
          </FieldMessage.Error.Text>
        </FieldMessage.Error.Root>
      </div>

      <div className="space-y-2">
        <Label htmlFor="causa_pedir">Causa Pedir</Label>
        <FieldMessage.Error.Root>
          <Select 
            value={values.causa_pedir} 
            onValueChange={(value) => {
              setValue('causa_pedir', value);
              clearErrors('causa_pedir');
            }}
          >
            <SelectTrigger className={formState.errors.causa_pedir ? 'border-red-500' : ''}>
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
          <FieldMessage.Error.Text>
            {formState.errors.causa_pedir?.message}
          </FieldMessage.Error.Text>
        </FieldMessage.Error.Root>
      </div>
    </div>
  );
}
