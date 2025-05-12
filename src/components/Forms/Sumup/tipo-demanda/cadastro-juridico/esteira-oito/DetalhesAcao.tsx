import React, { useCallback, useEffect, useState } from 'react';
import { Controller, ControllerRenderProps, UseFormReturn, useFormState, useWatch } from 'react-hook-form';
import { Briefcase, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldMessage } from '@/components/FieldMessage';
import { DatePicker } from '@/components/ui/date-picker';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { maskCurrencyBRL } from '@/utils/Masks';
import { DadosDemandaCadastroJuridico } from '../../interfaces';
import { actions } from '@/actionsV2';
import { picklist } from '../../../picklists';
import { toast } from '@/utils/toast';
import { DadosProcesso } from '@/actionsV2/backend/demanda';
import { isEqual } from '@/utils/Array';

interface DetalhesAcaoProps {
  formBag: UseFormReturn<DadosDemandaCadastroJuridico>;
  dadosConsultaProcesso: DadosProcesso[];
}

interface Options {
  uf: string[];
  cidade: string[];
  tribunais: string[];
}

const DetalhesAcaoComponent = ({ formBag, dadosConsultaProcesso }: DetalhesAcaoProps) => {
  console.log('Componente DetalhesAcao renderizado');

  const { control, setValue, setError, register } = formBag;

  const [options, setOptions] = useState<Options>({
    uf: [],
    cidade: [],
    tribunais: [],
  });

  const { errors } = useFormState({
    control,
    name: ['tipo_acao', 'acao', 'tipo_acao2', 'procedimento', 'uf', 'cidade', 'tribunal', 'data_distribuicao', 'data_citacao', 'resumo_processo', 'valor_causa', 'prazo_liminar', 'prazo_tipo', 'conteudo_liminar', 'prazo_contestacao', 'data_audiencia'],
  });
  
  const values = {
    tipo_acao: useWatch({ control, name: 'tipo_acao' }),
    acao: useWatch({ control, name: 'acao' }),
    tipo_acao2: useWatch({ control, name: 'tipo_acao2' }),
    procedimento: useWatch({ control, name: 'procedimento' }),
    uf: useWatch({ control, name: 'uf' }),
    cidade: useWatch({ control, name: 'cidade' }),
    tribunal: useWatch({ control, name: 'tribunal' }),
    data_distribuicao: useWatch({ control, name: 'data_distribuicao' }),
    data_citacao: useWatch({ control, name: 'data_citacao' }),
    resumo_processo: useWatch({ control, name: 'resumo_processo' }),
    valor_causa: useWatch({ control, name: 'valor_causa' }),
    prazo_liminar: useWatch({ control, name: 'prazo_liminar' }),
    prazo_tipo: useWatch({ control, name: 'prazo_tipo' }) || 'dias_corridos',
    conteudo_liminar: useWatch({ control, name: 'conteudo_liminar' }),
    prazo_contestacao: useWatch({ control, name: 'prazo_contestacao' }),
    data_audiencia: useWatch({ control, name: 'data_audiencia' }),
  }

  const updateOptions = useCallback((novosDados: Partial<Options>) => {
    setOptions((prevState) => {
      return {
        ...prevState,
        ...novosDados,
      };
    });
  }, []);

  const updateCidadesPorUf = async (uf: string | undefined) => {
    const isUfValida = uf && uf.trim().length > 0 && picklist.ufs.find((item) => item.nome === uf?.trim());

    if (!isUfValida) {
      updateOptions({
        uf: picklist.ufs.map((uf) => uf.nome),
        cidade: values.cidade ? [values.cidade] : [],
      });
      return;
    }

    const cidades = await actions.backend.local.getCidadesPorUf({ uf });

    updateOptions({
      uf: picklist.ufs.map((uf) => uf.nome),
      cidade: cidades,
    });
  };

  const updateTribunaisPorUf = async (uf: string | undefined) => {
    if (!uf || uf.trim() === '') {
      updateOptions({
        tribunais: picklist.orgaoTribunal,
      });
      return;
    }

    const tribunais = picklist.orgaoTribunal.filter((tribunal) => tribunal.includes(uf));

    updateOptions({ tribunais });
  };

  const handleUfChange = (value: string, field: ControllerRenderProps<DadosDemandaCadastroJuridico, "uf">) => {
    field.onChange(value);

    updateCidadesPorUf(value);
    updateTribunaisPorUf(value);

    setValue('cidade', '');
    setValue('tribunal', '');
    setValue('vara', '');
  };

  const handleDataDistribuicaoChange = (selectedDate: Date | undefined, field: ControllerRenderProps<DadosDemandaCadastroJuridico, "data_distribuicao">) => {
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
      return;
    }

    field.onChange(selectedDate.toISOString());
  };

  const handleDataCitacaoChange = (selectedDate: Date | undefined, field: ControllerRenderProps<DadosDemandaCadastroJuridico, "data_citacao">) => {
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
      return;
    }

    field.onChange(selectedDate.toISOString());
  };
  
  const handlePrazoLiminarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove qualquer caractere não numérico

    if (value === '' || parseInt(value) > 0) {
      setValue('prazo_liminar', value);
    }
  };

  const handlePrazoTipoChange = () => {
    const prazoTipo = values.prazo_tipo;

    if (prazoTipo === 'dias_corridos') {
      setValue('prazo_tipo', 'horas_corridas');
    }

    if (prazoTipo === 'horas_corridas') {
      setValue('prazo_tipo', 'dias_corridos');
    }
  };

  const handleDataAudienciaChange = (selectedDate: Date | null, field: ControllerRenderProps<DadosDemandaCadastroJuridico, "data_audiencia">) => {
    if (!selectedDate) {
      field.onChange('');
      return;
    }

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const diaSemana = selectedDate.getDay();
    const ehFinalDeSemana = diaSemana === 0 || diaSemana === 6; // 0 = domingo, 6 = sábado
    const ehRetroativa = selectedDate < hoje;

    if (ehRetroativa && ehFinalDeSemana) {
      toast.warning({
        title: 'Data inválida',
        description: 'A data da audiência não pode ser em um final de semana ou retroativa.'
      });

      setError('data_audiencia', {
        message: 'A data da audiência não pode ser em um final de semana ou retroativa.'
      });
    }

    if (ehFinalDeSemana) {
      toast.warning({
        title: 'Data inválida',
        description: 'A data da audiência não pode ser em um final de semana.'
      });

      setError('data_audiencia', {
        message: 'A data da audiência não pode ser em um final de semana.'
      });
    }

    if (ehRetroativa) {
      toast.warning({
        title: 'Data inválida',
        description: 'A data da audiência não pode ser retroativa.'
      });

      setError('data_audiencia', {
        message: 'A data da audiência não pode ser retroativa.'
      });
    }

    field.onChange(selectedDate.toISOString());
  };

  useEffect(() => {
    if (dadosConsultaProcesso.length === 1) {
      const uf = dadosConsultaProcesso[0].uf;
      const tribunal = dadosConsultaProcesso[0].tribunal;

      setValue('uf', uf);
      setValue('cidade', '');
      setValue('tribunal', tribunal);

      updateCidadesPorUf(uf);
      updateTribunaisPorUf(uf);

      return;
    }

    updateCidadesPorUf(values.uf);
    updateTribunaisPorUf(values.uf);
  }, [dadosConsultaProcesso]);

  return (
    <div>
      <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
        <Briefcase className="w-5 h-5 mr-2 text-green-500" />
        <span>Detalhes da Ação</span>
      </h3>

      <div className="space-y-4 bg-green-50 dark:bg-green-950/30 p-3 rounded-md">
        <div>
          <Label className="block text-sm mb-1">Tipo de ação</Label>
          <Input
            type="text"
            value={values.tipo_acao}
            disabled
            className="w-full p-2 bg-gray-100 dark:bg-gray-900 border rounded-md text-sm"
          />
        </div>

        <div>
          <Label className="block text-sm mb-1">Ação</Label>
          <Input
            type="text"
            value={values.acao}
            disabled
            className="w-full p-2 bg-gray-100 dark:bg-gray-900 border rounded-md text-sm"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo_acao2">Tipo de ação 2</Label>
          <FieldMessage.Error.Root>
            <Controller
              name="tipo_acao2"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger ref={field.ref} className={errors.tipo_acao2 ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecione o tipo de ação 2" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Consumidor">Consumidor</SelectItem>
                    <SelectItem value="Parceiro">Parceiro</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldMessage.Error.Text>
              {errors.tipo_acao2?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>

        <div className="space-y-2">
          <Label htmlFor="procedimento">Procedimento</Label>
          <FieldMessage.Error.Root>
            <Controller
              name="procedimento"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}                 
                >
                  <SelectTrigger ref={field.ref} className={errors.procedimento ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Selecione um procedimento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cível">Cível</SelectItem>
                    <SelectItem value="Juizado Especial Cível">Juizado Especial Cível</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldMessage.Error.Text>
              {errors.procedimento?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>

        <div className="space-y-2">
          <Label htmlFor="uf">UF</Label>
          <FieldMessage.Error.Root>
            <div className="flex items-center gap-2">
              <Controller
                name="uf"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => handleUfChange(value, field)}
                  >
                    <SelectTrigger ref={field.ref} className={errors.uf ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione a UF" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.uf.map((uf) => (
                        <SelectItem key={uf} value={uf}>
                          {uf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              <X
                onClick={() => {
                  setValue('uf', '');
                  setValue('cidade', '');
                  setValue('tribunal', '');
                  updateCidadesPorUf('');
                  updateTribunaisPorUf('');
                }}
                className="w-4 h-4 cursor-pointer text-gray-400 hover:text-red-500"
              />
            </div>
            <FieldMessage.Error.Text>
              {errors.uf?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cidade">Cidade</Label>
          <FieldMessage.Error.Root>
            <div className="flex items-center gap-2">
              <Controller
                name="cidade"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}                 
                  >
                    <SelectTrigger ref={field.ref} className={errors.cidade ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione uma cidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.cidade.map((cidade) => (
                        <SelectItem key={cidade} value={cidade}>
                          {cidade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              <X
                onClick={() => {
                  setValue('cidade', '');
                }}
                className="w-4 h-4 cursor-pointer text-gray-400 hover:text-red-500"
              />
            </div>
            <FieldMessage.Error.Text>
              {errors.cidade?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tribunal">Órgão / Tribunal</Label>
          <FieldMessage.Error.Root>
            <div className="flex items-center gap-2">
              <Controller
                name="tribunal"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}                 
                  >
                    <SelectTrigger ref={field.ref} className={errors.tribunal ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Selecione um Órgão / Tribunal" />
                    </SelectTrigger>
                    <SelectContent>
                      {options.tribunais.map((tribunal) => (
                        <SelectItem key={tribunal} value={tribunal}>
                          {tribunal}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              <X
                onClick={() => {
                  setValue('tribunal', '');
                }}
                className="w-4 h-4 cursor-pointer text-gray-400 hover:text-red-500"
              />
            </div>
            <FieldMessage.Error.Text>
              {errors.tribunal?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>

        <div className="space-y-2">
          <Label htmlFor="data_distribuicao">Data de Distribuição</Label>
          <FieldMessage.Error.Root>
            <div className="group flex gap-2 items-center">
              <Controller
                name="data_distribuicao"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    date={field.value ? new Date(field.value) : undefined}
                    onSelect={(selectedDate) => {
                      handleDataDistribuicaoChange(selectedDate, field);
                    }}
                  />
                )}
              />
              <X
                onClick={() => setValue('data_distribuicao', '')}
                className="w-4 h-4 cursor-pointer text-gray-400 hover:text-red-500"
              />
            </div>
            <FieldMessage.Error.Text>
              {errors.data_distribuicao?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>

        <div className="space-y-2">
          <Label htmlFor="data_citacao">Data de citação</Label>
          <div className="group flex gap-2 items-center">
            <Controller
              name="data_citacao"
              control={control}
              render={({ field }) => (
                <DatePicker
                  date={field.value ? new Date(field.value) : undefined}
                  onSelect={(selectedDate) => {
                    handleDataCitacaoChange(selectedDate, field);
                  }}
                />
              )}
            />
            <X
              onClick={() => setValue('data_citacao', '')}
              className="w-4 h-4 cursor-pointer text-gray-400 hover:text-red-500"
            />
          </div>
        </div>

        <div>
          <Label className="block text-sm mb-1">Resumo do processo</Label>
          <FieldMessage.Error.Root>
            <Textarea
              {...register('resumo_processo')}
              id="resumo_processo"
              rows={4}
              className={`bg-white dark:bg-black ${errors.resumo_processo ? 'border-red-500' : ''}`}
            />
            <FieldMessage.Error.Text>
              {errors.resumo_processo?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>

        <div>
          <Label className="block text-sm mb-1">Valor de causa</Label>
          <FieldMessage.Error.Root>
            <Controller
              name="valor_causa"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  value={field.value}
                  placeholder="R$ 0,00"
                  className={`w-full p-2 border rounded-md text-sm ${
                    errors.valor_causa ? 'border-red-500' : ''
                  }`}
                  onChange={(event) => {
                    const value = event.target.value;
                    const formattedValue = maskCurrencyBRL(value);
                    field.onChange(formattedValue);
                  }}
                />
              )}
            />
            <FieldMessage.Error.Text>
              {errors.valor_causa?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>

        <div>
          <Label className="block text-sm mb-1">Prazo para cumprimento da liminar</Label>
          <div className="flex items-center gap-3">
            <Input
              type="text"
              placeholder="Prazo"
              className="w-24 p-2 border rounded-md text-sm"
              {...register('prazo_liminar')}
              onChange={handlePrazoLiminarChange}
            />
            <div className="flex items-center gap-2">
              <span
                className={`text-xs ${
                  values.prazo_tipo === 'dias_corridos' ? 'text-gray-500' : 'text-blue-600 font-medium'
                }`}>
                horas corridas
              </span>
              <div
                className={`relative inline-block w-10 h-5 rounded-full transition-colors duration-200 ease-in-out ${
                  values.prazo_tipo === 'dias_corridos' ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                onClick={handlePrazoTipoChange}>
                <span
                  className={`absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ease-in-out ${
                    values.prazo_tipo === 'dias_corridos' ? 'transform translate-x-5' : ''
                  }`}
                />
                <Input
                  type="checkbox"
                  className="sr-only"
                  checked={values.prazo_tipo === 'dias_corridos'}
                  onChange={handlePrazoTipoChange}
                />
              </div>
              <span
                className={`text-xs ${
                  values.prazo_tipo === 'dias_corridos' ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}>
                dias corridos
              </span>
            </div>
          </div>
        </div>

        <div>
          <Label className="block text-sm mb-1">Conteúdo da liminar</Label>
          <Textarea
            id="conteudo_liminar"
            {...register('conteudo_liminar')}
            rows={3}
            placeholder="Transcrição da liminar deferida"
            className="bg-white dark:bg-black"
          />
        </div>

        <div>
          <Label className="block text-sm mb-1">
            Prazo para apresentar contestação (dias corridos)
          </Label>
          <Controller
            name="prazo_contestacao"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                placeholder="Prazo em dias"
                className="w-full p-2 border rounded-md text-sm"
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, ''); // Remove qualquer caractere não numérico

                  if (value === '' || parseInt(value) > 0) {
                    field.onChange(value);
                  }
                }}
              />
            )}
          />
        </div>

        <FieldMessage.Error.Root>
          <div className="space-y-2">
            <Label htmlFor="data_audiencia">Data da audiência</Label>
            
              <Controller
                name="data_audiencia"
                control={control}
                render={({ field }) => (
                  <div className="group flex gap-2 items-center">
                    <DateTimePicker
                      date={field.value ? new Date(field.value) : undefined}
                      onSelect={(selectedDate) => {
                        handleDataAudienciaChange(selectedDate, field);
                      }}
                    />
                    <X
                      onClick={() => handleDataAudienciaChange(null, field)}
                      className="w-4 h-4 cursor-pointer text-gray-400 hover:text-red-500"
                    />
                  </div>
                )}
              />
          </div>
          <FieldMessage.Error.Text>
            {errors.data_audiencia?.message}
          </FieldMessage.Error.Text>
        </FieldMessage.Error.Root>
      </div>
    </div>
  );
}

export const DetalhesAcao = React.memo(DetalhesAcaoComponent, (prevProps, nextProps) => {
  // console.log('prevProps', prevProps);
  // console.log('nextProps', nextProps);

  // console.log('prevProps.dadosConsultaProcesso', prevProps.dadosConsultaProcesso);
  // console.log('nextProps.dadosConsultaProcesso', nextProps.dadosConsultaProcesso);
  // console.log('isEqual(prevProps.dadosConsultaProcesso, nextProps.dadosConsultaProcesso)', isEqual(prevProps.dadosConsultaProcesso, nextProps.dadosConsultaProcesso));

  if (!isEqual(prevProps.dadosConsultaProcesso, nextProps.dadosConsultaProcesso)) {
    return false;
  }

  return true;
});
