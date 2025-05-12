import { Label } from '@/components/ui/label';
import { UseFormReturn, useFormState, useWatch } from 'react-hook-form';
import { FormValues } from '.';
import { FieldMessage } from '@/components/FieldMessage';
import { User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { actions } from '@/actionsV2';
import { useState } from 'react';
import { DemandaCadastroJuridicoReturn } from '../../interfaces';
import { toast } from '@/utils/toast';
import { cn } from '@/utils/ClassName';
import React from 'react';

interface AutorProps {
  pk: string;
  formBag: UseFormReturn<FormValues, any, undefined>;
  saveForm: () => Promise<void>;
  updateFormValues: (dados: DemandaCadastroJuridicoReturn) => void;
}

export function AutorComponent({ 
  pk, 
  formBag,
  saveForm,
  updateFormValues,
}: AutorProps) {
  console.log('Componente Autor renderizado');
  
  const { control, register } = formBag;

  const [isConsultandoAutor, setIsConsultandoAutor] = useState(false);

  const { errors } = useFormState({
    control,
    name: ['documento_autor', 'nome_autor'],
  });

  const values = {
    documento_autor: useWatch({ control, name: 'documento_autor' }),
  }

  const handleConsultarAutor = async () => {
    try {
      setIsConsultandoAutor(true);

      const documentoAutor = values.documento_autor;

      if (!documentoAutor) {
        throw new Error('Documento do autor não informado corretamente.');
      }

      await saveForm();

      await actions.backend.cliente.return.getDadosAutor({
        pk,
        cpfCnpj: documentoAutor,
      });

      const dadosEsteiraOito = await actions.backend.demanda.getDadosDemandaEsteiraOito({ pk });

      console.log('Novos dados esteira oito:', dadosEsteiraOito);

      if (!dadosEsteiraOito) {
        return;
      }

      updateFormValues(dadosEsteiraOito);

      toast.success({
        title: 'Sucesso',
        description: 'Informações do autor e campos do formulário atualizados com sucesso.',
      });
    } catch (error: any) {
      toast.error({
        title: 'Erro',
        description: error?.message,
      });
    } finally {
      setIsConsultandoAutor(false);
    }
  };

  return (
    <div>
      <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
        <User className="w-5 h-5 mr-2 text-rose-500" />
        <span>Autor</span>
      </h3>

      <div className="space-y-4 bg-rose-50 dark:bg-rose-950/30 p-3 rounded-md">
      <div className="flex flex-col w-full space-y-2">
        <Label htmlFor="documento_autor">Documento Autor</Label>
          <FieldMessage.Error.Root>
            <div className='flex flex-row gap-2'>
              <Input
                {...register('documento_autor')}
                id="documento_autor"
                placeholder="Documento Autor"
                className={cn('w-full', errors.documento_autor ? 'border-red-500' : '')}
                disabled
              />
              <Button type="button" onClick={handleConsultarAutor} disabled>
                {
                  isConsultandoAutor ? (
                    'Consultando...'
                  ) : (
                    'Consultar'
                  )
                }
              </Button>
            </div>
            <FieldMessage.Error.Text>
              {errors.documento_autor?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>

        <div className="flex space-x-2">
          <div className="flex flex-1 flex-col space-y-2">
            <Label htmlFor="nome_autor">Nome Autor</Label>
            <FieldMessage.Error.Root>
              <Input 
                {...register('nome_autor')} 
                id="nome_autor" 
                placeholder="Nome do Autor" 
                className={errors.nome_autor ? 'border-red-500' : ''}
                disabled
              />
              <FieldMessage.Error.Text>
                {errors.nome_autor?.message}
              </FieldMessage.Error.Text>
            </FieldMessage.Error.Root>
          </div>
        </div>
      </div>
    </div>
  
  );
}

export const Autor = React.memo(AutorComponent, (prevProps, nextProps) => {
  if (prevProps.pk !== nextProps.pk) {
    return false;
  }

  return true
}); 
