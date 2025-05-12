import React from 'react';
import { FileSignature, X } from 'lucide-react';
import { useFormContext, UseFormReturn, useWatch } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { DatePicker } from '@/components/ui/date-picker';
import { FieldMessage } from '@/components/FieldMessage';
import { toast } from '@/utils/toast';
import { DadosDemandaProcon } from '../../interfaces';

interface ProconProps {
  formBag: UseFormReturn<DadosDemandaProcon>;
}

const ProconComponent = ({ formBag }: ProconProps) => {
  console.log('Componente Procon renderizado');

  const { register, formState, setValue, setError, clearErrors, control } = formBag;

  const values = {
    identificacao: useWatch({ control, name: 'identificacao' }),
    tipificacao: useWatch({ control, name: 'tipificacao' }),
    origem_reclamacao: useWatch({ control, name: 'origem_reclamacao' }),
    tipo_processo: useWatch({ control, name: 'tipo_processo' }),
    data_audiencia: useWatch({ control, name: 'data_audiencia' }),
    data_defesa: useWatch({ control, name: 'data_defesa' }),
    data_reclamacao: useWatch({ control, name: 'data_reclamacao' }),
  }

  const handleDataAudienciaChange = (selectedDate: Date | null) => {
    clearErrors('data_audiencia');

    if (!selectedDate) {
      setValue('data_audiencia', '');
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

    setValue('data_audiencia', selectedDate.toISOString());
  };

  return (
    <div>
      <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
        <FileSignature className="w-5 h-5 mr-2 text-blue-500" />
        <span>Detalhes do procon</span>
      </h3>

      <div className="space-y-4 bg-blue-50 dark:bg-blue-950/50 p-3 rounded-md mb-4">
        <div>
          <Label className="block text-sm mb-1">Número de identificação</Label>
          <div className="flex items-center">
            <Input
              type="text"
              disabled
              placeholder="Número de identificação"
              className="w-full p-2 border rounded-l-md text-sm"
              {...register('identificacao')}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipificacao">Tipificação</Label>
          <FieldMessage.Error.Root>
            <Select
              {...register('tipificacao')}
              value={values.tipificacao}
              disabled
              onValueChange={(value) => {
                setValue('tipificacao', value);
                clearErrors('tipificacao');
              }}>
              <SelectTrigger className={formState.errors.tipificacao ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecione uma tipificação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Procon">Procon</SelectItem>
                <SelectItem value="Procon / Consumidor.gov.br">Procon / Consumidor.gov.br</SelectItem>
                <SelectItem value="Procon / Proconsumidor">Procon / Proconsumidor</SelectItem>
              </SelectContent>
            </Select>
            <FieldMessage.Error.Text visible={!!formState.errors.tipificacao}>
              {formState.errors.tipificacao?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>

        <div className="space-y-2">
          <Label htmlFor="origem_reclamacao">Identificação da origem da reclamação</Label>
          <FieldMessage.Error.Root>
            <Select
              {...register('origem_reclamacao')}
              value={values.origem_reclamacao}
              disabled
              onValueChange={(value) => {
                setValue('origem_reclamacao', value);
                clearErrors('origem_reclamacao');
              }}>
              <SelectTrigger className={formState.errors.origem_reclamacao ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecione a origem da reclamação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Procon">Procon</SelectItem>
                <SelectItem value="Procon / Consumidor.gov.br">Procon / Consumidor.gov.br</SelectItem>
                <SelectItem value="CIP (Procon SP)">CIP (Procon SP)</SelectItem>
                <SelectItem value="Processo Administrativo (Procon SP)">
                  Processo Administrativo (Procon SP)
                </SelectItem>
                <SelectItem value="Proconsumidor">Proconsumidor</SelectItem>
                <SelectItem value="Upload físico">Upload físico</SelectItem>
              </SelectContent>
            </Select>
            <FieldMessage.Error.Text visible={!!formState.errors.origem_reclamacao}>
              {formState.errors.origem_reclamacao?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo_processo">Tipo de processo</Label>
          <FieldMessage.Error.Root>
            <Select
              {...register('tipo_processo')}
              value={values.tipo_processo}
              disabled
              onValueChange={(value) => {
                setValue('tipo_processo', value);
                clearErrors('tipo_processo');
              }}>
              <SelectTrigger className={formState.errors.tipo_processo ? "border-red-500" : ""}>
                <SelectValue placeholder="Selecione o tipo de processo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CIP">CIP</SelectItem>
                <SelectItem value="F.A.">F.A.</SelectItem>
                <SelectItem value="Processo Administrativo">Processo Administrativo</SelectItem>
                <SelectItem value="Reclamação">Reclamação</SelectItem>
                <SelectItem value="Recurso Administrativo">Recurso Administrativo</SelectItem>
              </SelectContent>
            </Select>
            <FieldMessage.Error.Text visible={!!formState.errors.tipo_processo}>
              {formState.errors.tipo_processo?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>

        <FieldMessage.Error.Root>
          <div className="space-y-2">
            <Label htmlFor="data_audiencia">Data da audiência</Label>
            <div className="group flex gap-2 items-center">
              <DateTimePicker
                disabled
                date={values.data_audiencia ? new Date(values.data_audiencia) : undefined}
                onSelect={handleDataAudienciaChange}
              />
              <X
                className="w-4 h-4 cursor-pointer text-gray-400 hover:text-red-500"
              />
            </div>
          </div>
          <FieldMessage.Error.Text>
            {formState.errors.data_audiencia?.message}
          </FieldMessage.Error.Text>
        </FieldMessage.Error.Root>

        <div className="space-y-2">
          <Label htmlFor="data_defesa">Data de defesa</Label>
          <div className="group flex gap-2 items-center">
            <DatePicker
              disabled
              date={values.data_defesa ? new Date(values.data_defesa) : undefined}
              onSelect={(date) => {
                setValue('data_defesa', date?.toISOString());
              }}
            />
            <X
              className="w-4 h-4 cursor-pointer text-gray-400 hover:text-red-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="data_reclamacao">Data da reclamação</Label>
          <FieldMessage.Error.Root>
            <div className={`group flex gap-2 items-center ${formState.errors.data_reclamacao ? "border border-red-500 rounded-md" : ""}`}>
              <DatePicker
                disabled
                date={values.data_reclamacao ? new Date(values.data_reclamacao) : undefined}
                onSelect={(date) => {
                  setValue('data_reclamacao', date?.toISOString());
                  clearErrors('data_reclamacao');
                }}
              />
              <X
                className="w-4 h-4 cursor-pointer text-gray-400 hover:text-red-500"
              />
            </div>
            <FieldMessage.Error.Text visible={!!formState.errors.data_reclamacao}>
              {formState.errors.data_reclamacao?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>
      </div>
    </div>
  );
};

export const DetalhesProcon = React.memo(ProconComponent, (prevProps, nextProps) => {
  // como não há props, sempre retorna true para não re-renderizar
  return true;
});
