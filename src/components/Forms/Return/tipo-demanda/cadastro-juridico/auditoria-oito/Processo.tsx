import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormValues } from '.';
import { Controller, UseFormReturn, useFormState, useWatch } from 'react-hook-form';
import { picklist } from '../../../picklists';
import { maskNumeroProcesso } from '@/utils/Masks';
import { FieldMessage } from '@/components/FieldMessage';
import { BookText } from 'lucide-react';
import { useState } from 'react';
import { actions } from '@/actionsV2';
import { toast } from '@/utils/toast';
import { useRouter } from 'next/navigation';
import { DemandaCadastroJuridicoReturn } from '../../interfaces';
import React from 'react';

interface ProcessoProps {
  pk: string;
  esteira: string;
  esteiraTipo: string;
  formBag: UseFormReturn<FormValues, any, undefined>;
  updateFormValues: (newValues: Partial<DemandaCadastroJuridicoReturn>) => void;
}

export interface DadosProcesso {
  uf: string;
  tribunal: string;
  comarca: string;
  vara: string;
  foro: string;
}

export function ProcessoComponent({
  pk,
  esteira,
  esteiraTipo,
  formBag,
  updateFormValues
}: ProcessoProps) {
  console.log('Componente Processo renderizado');

  const { register, control } = formBag;

  const router = useRouter();

  const [dialogProcessoOpen, setDialogProcessoOpen] = useState(false);
  const [dialogEnviarDesdobramentoOpen, setDialogEnviarDesdobramentoOpen] = useState(false);

  const [isEnviandoDesdobramento, setIsEnviandoDesdobramento] = useState(false);
  const [isConsultandoProcesso, setIsConsultandoProcesso] = useState(false);
  const [dadosProcesso, setDadosProcesso] = useState<DadosProcesso[]>([]);

  const { errors } = useFormState({
    control,
    name: ['processo', 'empresa_fundo', 'uf', 'tribunal', 'comarca', 'foro', 'vara', 'tipo_justica', 'tipo_acao', 'causa_pedir'],
  });

  const values = {
    processo: useWatch({ control, name: 'processo' }),
    empresa_fundo: useWatch({ control, name: 'empresa_fundo' }),
    uf: useWatch({ control, name: 'uf' }),
    tribunal: useWatch({ control, name: 'tribunal' }),
    comarca: useWatch({ control, name: 'comarca' }),
    foro: useWatch({ control, name: 'foro' }),
    vara: useWatch({ control, name: 'vara' }),
    tipo_justica: useWatch({ control, name: 'tipo_justica' }),
    tipo_acao: useWatch({ control, name: 'tipo_acao' }),
    causa_pedir: useWatch({ control, name: 'causa_pedir' }),
  }

  const handleClickEnviarDesdobramento = () => {
    setDialogEnviarDesdobramentoOpen(true);
  }

  const handleConfirmaEnviarDesdobramento = async () => {
    try {
      setIsEnviandoDesdobramento(true);

      console.log('Valores do formulário para desdobramento:', formBag.getValues());

      await actions.backend.cliente.return.enviarDesdobramentoProcesso({
        dados: formBag.getValues(),
      });

      toast.success({
        title: 'Sucesso',
        description: 'Desdobramento alterado com sucesso, a página será recarregada',
      });

      router.push(`/${esteira}/${esteiraTipo}/demanda/${pk}`);
    } catch (error: any) {
      toast.error({
        title: 'Erro',
        description: error?.message,
      });
    } finally {
      setIsEnviandoDesdobramento(false);
      setDialogEnviarDesdobramentoOpen(false);
    }
  }

  const handleConsultaProcesso = async () => {
    try {
      setIsConsultandoProcesso(true);

      const processo = formBag.getValues('processo');

      if (!processo) {
        throw new Error('Número do processo não informado corretamente.');
      }

      const dadosProcesso = await actions.backend.demanda.consultarDadosProcesso({
        processo,
        pk
      });

      setDadosProcesso(dadosProcesso);
      setDialogProcessoOpen(true);

      toast.success({
        title: 'Sucesso',
        description: 'Consulta do processo realizada com sucesso.',
      });
    } catch (error: any) {
      toast.error({
        title: 'Erro',
        description: error?.message,
      });
    } finally {
      setIsConsultandoProcesso(false);
    }
  };

  const handleSelecionarProcesso = async (processo: DadosProcesso) => {
    try {
      await actions.backend.demanda.selecionaDadoProcesso({
        dado: processo,
        pk,
      });

      updateFormValues({
        uf: processo.uf,
        tribunal: processo.tribunal,
        comarca: processo.comarca,
        vara: processo.vara,
        foro: processo.foro,
      });

      setDialogProcessoOpen(false);

      toast.success({
        title: 'Sucesso',
        description: 'Processo selecionado com sucesso.',
      });
    } catch (error: any) {
      toast.error({
        title: 'Erro',
        description: error?.message,
      });
    }
  };
  
  return (
    <div>
      <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
        <BookText className="w-5 h-5 mr-2 text-orange-500" />
        <span>Informações do Processo</span>
      </h3>

      <div className="space-y-4 bg-orange-50 dark:bg-orange-950/30 p-3 rounded-md">
        <div className="space-y-2">
          <Label htmlFor="processo">Número do processo</Label>
          <div className="flex space-x-2">
            <Controller
              name="processo"
              control={control}
              render={({ field }) => (
                <Input 
                  id="processo" 
                  placeholder="...número do processo..." 
                  className={errors.processo ? 'border-red-500' : ''}
                  onChange={(e) => {
                    field.onChange(maskNumeroProcesso(e.target.value));
                  }}
                  disabled
                  value={field.value}
                />
              )}
            />

            <Button type="button" onClick={handleConsultaProcesso} disabled>
              { isConsultandoProcesso ? 'Consultando...' : 'Consultar' }
            </Button>
            <Button 
              type="button"
              onClick={handleClickEnviarDesdobramento}
              disabled
            >
              { isEnviandoDesdobramento ? 'Enviando...' : 'Desdobramento' }
            </Button>
          </div>
          {errors.processo && (
            <FieldMessage.Error.Text>
              {errors.processo.message}
            </FieldMessage.Error.Text>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="empresa_fundo">Empresa/Fundo</Label>
          <FieldMessage.Error.Root>
            <Controller
              name="empresa_fundo"
              control={control}
              render={({ field }) => (
                <Select 
                  onValueChange={field.onChange}
                  value={values.empresa_fundo} 
                >
                  <SelectTrigger ref={field.ref} className={errors.empresa_fundo ? 'border-red-500' : ''}>
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
              )}
            />


            <FieldMessage.Error.Text>
              {errors.empresa_fundo?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>

        <div className="space-y-2">
          <Label htmlFor="uf">UF</Label>
          <FieldMessage.Error.Root>
            <Controller
              name="uf"
              control={control}
              render={({ field }) => (
                <Select 
                  value={values.uf} 
                  onValueChange={field.onChange}
                >
                  <SelectTrigger ref={field.ref} className={errors.uf ? 'border-red-500' : ''}>
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
              )}
            />
            <FieldMessage.Error.Text>
              {errors.uf?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tribunal">Tribunal</Label>
          <FieldMessage.Error.Root>
            <Controller
              name="tribunal"
              control={control}
              render={({ field }) => (
                <Select 
                  value={values.tribunal} 
                  onValueChange={field.onChange}
                >
                  <SelectTrigger ref={field.ref} className={errors.tribunal ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecione o tribunal" />
                  </SelectTrigger>
                  <SelectContent>
                    {picklist.tribunais.map((tribunal) => (
                      <SelectItem key={tribunal} value={tribunal}>
                        {tribunal}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            <FieldMessage.Error.Text>
              {errors.tribunal?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>

        <div className="space-y-2">
          <Label htmlFor="comarca">Comarca</Label>
          <FieldMessage.Error.Root>
            <Input 
              {...register('comarca')} 
              id="comarca" 
              placeholder="Comarca" 
              className={errors.comarca ? 'border-red-500' : ''}
              disabled
            />
            <FieldMessage.Error.Text>
              {errors.comarca?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>

        <div className="space-y-2">
          <Label htmlFor="foro">Foro</Label>
          <FieldMessage.Error.Root>
            <Input 
              {...register('foro')} 
              id="foro" 
              placeholder="Foro" 
              className={errors.foro ? 'border-red-500' : ''}
              disabled
            />
            <FieldMessage.Error.Text>
              {errors.foro?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>

        <div className="space-y-2">
          <Label htmlFor="vara">Vara</Label>
          <FieldMessage.Error.Root>
            <Input 
              {...register('vara')} 
              id="vara" 
              placeholder="Vara" 
              className={errors.vara ? 'border-red-500' : ''}
              disabled
            />
            <FieldMessage.Error.Text>
              {errors.vara?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo_justica">Tipo de Justiça</Label>
          <FieldMessage.Error.Root>
            <Controller
              name="tipo_justica"
              control={control}
              render={({ field }) => (
                <Select 
                  value={field.value} 
                  onValueChange={field.onChange}
                >
                  <SelectTrigger ref={field.ref} className={errors.tipo_justica ? 'border-red-500' : ''}>
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
              )}
            />
            <FieldMessage.Error.Text>
              {errors.tipo_justica?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo_acao">Tipo de Ação</Label>
          <FieldMessage.Error.Root>
            <Controller
              name="tipo_acao"
              control={control}
              render={({ field }) => (
                <Select 
                  value={field.value} 
                  onValueChange={field.onChange}
                >
                  <SelectTrigger ref={field.ref} className={errors.tipo_acao ? 'border-red-500' : ''}>
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
              )}
            />
            <FieldMessage.Error.Text>
              {errors.tipo_acao?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>

        <div className="space-y-2">
          <Label htmlFor="causa_pedir">Causa Pedir</Label>
          <FieldMessage.Error.Root>
            <Controller
              name="causa_pedir"
              control={control}
              render={({ field }) => (
                <Select 
                  value={field.value} 
                  onValueChange={field.onChange}
                >
                  <SelectTrigger ref={field.ref} className={errors.causa_pedir ? 'border-red-500' : ''}>
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
              )}
            />

            <FieldMessage.Error.Text>
              {errors.causa_pedir?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>
      </div>

      <Dialog
        open={dialogEnviarDesdobramentoOpen}
        onOpenChange={setDialogEnviarDesdobramentoOpen}
      >
        <DialogContent 
          aria-describedby='dialog-enviar-desdobramento'
          className="flex flex-col gap-4"
        >
          <DialogHeader>
            <DialogTitle>Desdobramento</DialogTitle>
          </DialogHeader>

          <span>
            Tem certeza que deseja alterar o número do processo? Os dados preenchidos serão salvos e enviados.
          </span>

          <DialogFooter>
            <Button 
              variant='outline'
              onClick={() => setDialogEnviarDesdobramentoOpen(false)}
            >
              Cancelar
            </Button>

            <Button 
              disabled={isEnviandoDesdobramento}
              onClick={handleConfirmaEnviarDesdobramento}
            >
              { isEnviandoDesdobramento ? 'Alterando...' : 'Alterar' }
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialogProcessoOpen}
        onOpenChange={setDialogProcessoOpen}
      >
        <DialogContent 
          aria-describedby='dialog-processo'
          className="max-h-[90vh] max-w-[90vw] overflow-auto"
        >
          <DialogHeader>
            <DialogTitle>Informações do Processo</DialogTitle>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Selecionar</TableHead>
                <TableHead>UF</TableHead>
                <TableHead>Tribunal</TableHead>
                <TableHead>Comarca</TableHead>
                <TableHead>Vara</TableHead>
                <TableHead>Foro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {dadosProcesso.map((info, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Button onClick={() => handleSelecionarProcesso(info)}>Selecionar</Button>
                  </TableCell>
                  <TableCell>{info.uf}</TableCell>
                  <TableCell>{info.tribunal}</TableCell>
                  <TableCell>{info.comarca}</TableCell>
                  <TableCell>{info.vara}</TableCell>
                  <TableCell>{info.foro}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export const Processo = React.memo(ProcessoComponent, (prevProps, nextProps) => {
  return true
}); 
