import React from 'react';
import { Controller, ControllerRenderProps, UseFormReturn, useFormState, useWatch } from 'react-hook-form';
import { FileSignature, Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldMessage } from '@/components/FieldMessage';
import { maskNumeroProcesso } from '@/utils/Masks';
import { DemandaCadastroJuridico } from '../../interfaces';
import { DatePicker } from '@/components/ui/date-picker';
import { Button } from '@/components/ui/button';
import { toast } from '@/utils/toast';

interface DetalhesProcessoProps {
  formBag: UseFormReturn<DemandaCadastroJuridico>;
}

const DetalhesProcessoComponent = ({ 
  formBag, 
}: DetalhesProcessoProps) => {
  console.log('Componente DetalhesProcesso renderizado');
  const { control, setValue, getValues, setError, register, clearErrors, formState } = formBag;

  const { errors } = useFormState({
    control,
    name: ['processo', 'tipificacao', 'desdobramento', 'processo_originario', 'nome_desdobramento', 'data_distribuicao_desdobramento'],
  });

  const values = {
    processo: useWatch({ control, name: 'processo' }),
    tipificacao: useWatch({ control, name: 'tipificacao' }),
    desdobramento: useWatch({ control, name: 'desdobramento' }) || false,
    processo_originario: useWatch({ control, name: 'processo_originario' }),
    nome_desdobramento: useWatch({ control, name: 'nome_desdobramento' }),
    data_distribuicao_desdobramento: useWatch({ control, name: 'data_distribuicao_desdobramento' }),
  }

  const handleDesdobramentoChange = () => {
    const newState = !getValues('desdobramento');

    setValue('desdobramento', newState);


    if (newState) {
      setValue('processo_originario', '');
      setValue('nome_desdobramento', '');
      setValue('data_distribuicao_desdobramento', '');

      clearErrors('processo_originario');
      clearErrors('nome_desdobramento');
      clearErrors('data_distribuicao_desdobramento');
    }
  };

  const handleProcessoChange = (event: React.ChangeEvent<HTMLInputElement>, field: ControllerRenderProps<DemandaCadastroJuridico, "processo">) => {
    const numeroProcesso = maskNumeroProcesso(event.currentTarget.value)
    field.onChange(numeroProcesso)
  };

  const handleProcessoOriginarioChange = (event: React.ChangeEvent<HTMLInputElement>, field: ControllerRenderProps<DemandaCadastroJuridico, "processo_originario">) => {
    const numeroProcesso = maskNumeroProcesso(event.currentTarget.value)
    field.onChange(numeroProcesso)
  };

  const handleDataDistribuicaoDesdobramentoChange = (selectedDate: Date | undefined, field: ControllerRenderProps<DemandaCadastroJuridico, "data_distribuicao_desdobramento">) => {
    if (!selectedDate) {
      field.onChange('');
      return;
    }

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (selectedDate >= today) {
      toast.warning({
        title: 'Aviso!',
        description: 'A data de distribuição não pode ser igual ou superior a data atual.',
      });

      setError('data_distribuicao_desdobramento', {
        message: 'A data de distribuição não pode ser igual ou superior a data atual.',
      });

      return;
    }

    field.onChange(selectedDate.toISOString());
  };

  return (
    <div>
      <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
        <FileSignature className="w-5 h-5 mr-2 text-blue-500" />
        <span>Detalhes do processo</span>
      </h3>

      <div className="space-y-4 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md">
        <div className="w-full">
          <Label className="block text-sm mb-1">NUP (LA)</Label>
          <div className="flex items-center w-full">
            <FieldMessage.Error.Root className="w-full">
              <Controller
                name="processo"
                control={control}
                render={({ field }) => (
                  <Input
                    {...register('processo')}
                    ref={field.ref}
                    type="text"
                    disabled
                    placeholder="Número de processo padrão CNJ"
                    className={`w-full p-2 border rounded-md text-sm ${
                      errors.processo ? 'border-red-500' : ''
                    }`}
                    value={field.value}
                    onChange={(event) => handleProcessoChange(event, field)}
                  />
                )}
              />
              <FieldMessage.Error.Text>
                {errors.processo?.message}
              </FieldMessage.Error.Text>
            </FieldMessage.Error.Root>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipificacao">Tipificação</Label>
          <FieldMessage.Error.Root>
            <Controller
              name="tipificacao"
              control={control}
              render={({ field }) => (
                <div className="flex items-center gap-2">
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}       
                    disabled          
                  >
                    <SelectTrigger ref={field.ref} className={errors.tipificacao ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione uma tipificação" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="Citação/Intimação">Citação/Intimação</SelectItem>
                    <SelectItem value="Documentos/íntegra do processo">Documentos/íntegra do processo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            />
            <FieldMessage.Error.Text>
              {errors.tipificacao?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>

        <div className="flex items-center justify-between cursor-not-allowed">
          <Label className="text-sm">Desdobramento</Label>
          <div
            className={`relative inline-block w-10 h-5 rounded-full transition-colors duration-200 ease-in-out ${
              values.desdobramento ? 'bg-blue-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                values.desdobramento ? 'transform translate-x-5' : ''
              }`}
            />
            <Input
              type="checkbox"
              className="sr-only"
              checked={values.desdobramento}
              disabled
              onChange={handleDesdobramentoChange}
            />
          </div>
        </div>

        {/* Campo condicional que aparece quando Desdobramento está ativado */}
        {values.desdobramento && (
          <div className="mt-3 pl-4 border-l-2 border-blue-300 space-y-4">
            <div>
              <Label className="block text-sm mb-1">Número do processo originário</Label>
              <FieldMessage.Error.Root>
                <Controller
                  name="processo_originario"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...register('processo_originario')}
                      type="text"
                      disabled
                      placeholder="Número de processo originário CNJ"
                      className={`w-full p-2 border rounded-md text-sm ${
                        errors.processo_originario ? 'border-red-500' : ''
                      }`}
                      value={field.value}
                      onChange={(event) => handleProcessoOriginarioChange(event, field)}
                    />
                  )}
                />
                <FieldMessage.Error.Text>
                  {errors.processo_originario?.message}
                </FieldMessage.Error.Text>
              </FieldMessage.Error.Root>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nome_desdobramento">Nome do desdobramento</Label>
              <FieldMessage.Error.Root>
                <Controller
                  name="nome_desdobramento"
                  control={control}
                  render={({ field }) => (
                    <div className="flex items-center gap-2">
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}  
                        disabled
                      >
                        <SelectTrigger ref={field.ref} className={errors.nome_desdobramento ? 'border-red-500' : ''}>
                          <SelectValue placeholder="Selecione um desdobramento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Agravo de Instrumento.">Agravo de Instrumento.</SelectItem>
                          <SelectItem value="Carta Precatória">Carta Precatória</SelectItem>
                          <SelectItem value="Cumprimento de Sentença">Cumprimento de Sentença</SelectItem>
                          <SelectItem value="Recurso Inominado">Recurso Inominado</SelectItem>
                        </SelectContent>
                      </Select>
  
                    </div>
                  )}
                />
                <FieldMessage.Error.Text>
                  {errors.nome_desdobramento?.message}
                </FieldMessage.Error.Text>
              </FieldMessage.Error.Root>
            </div>
            <div className="space-y-2">
              <Label htmlFor="data_distribuicao_desdobramento">Data de distribuição do desdobramento</Label>
              <FieldMessage.Error.Root>
                <Controller
                  name="data_distribuicao_desdobramento"
                  control={control}
                  render={({ field }) => (
                    <div className="group flex gap-2 items-center">
                      <DatePicker
                        disabled
                        date={field.value ? new Date(field.value) : undefined}
                        onSelect={(selectedDate) => {
                          handleDataDistribuicaoDesdobramentoChange(selectedDate, field);
                        }}
                      />
                    </div>
                  )}
                />
                <FieldMessage.Error.Text>
                  {errors.data_distribuicao_desdobramento?.message}
                </FieldMessage.Error.Text>
              </FieldMessage.Error.Root>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const DetalhesProcesso = React.memo(DetalhesProcessoComponent, (prevProps, nextProps) => {
  return true
}); 