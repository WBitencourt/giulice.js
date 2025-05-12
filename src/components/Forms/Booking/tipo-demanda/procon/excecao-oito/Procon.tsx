import React from 'react';
import { FileSignature, X } from 'lucide-react';
import { Controller, ControllerRenderProps, useFormContext, UseFormReturn, useFormState, useWatch } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import { DatePicker } from '@/components/ui/date-picker';
import { FieldMessage } from '@/components/FieldMessage';
import { toast } from '@/utils/toast';
import { DemandaProcon } from '../../interfaces';

interface ProconProps {
  formBag: UseFormReturn<DemandaProcon>;
  validaDataAudiencia: (data: Date | null) => void;
  validaDataReclamacao: (data: Date | null) => void;
}

const ProconComponent = ({ formBag, validaDataAudiencia, validaDataReclamacao }: ProconProps) => {
  console.log('Componente Procon renderizado');

  const { register, setValue, control } = formBag;

  const { errors } = useFormState({
    control,
    name: ['identificacao', 'tipificacao', 'origem_reclamacao', 'tipo_processo', 'data_audiencia', 'data_defesa', 'data_reclamacao'], // 👈 monitora só esses erros
  });

  const values = {
    identificacao: useWatch({ control, name: 'identificacao' }),
    tipificacao: useWatch({ control, name: 'tipificacao' }),
    origem_reclamacao: useWatch({ control, name: 'origem_reclamacao' }),
    tipo_processo: useWatch({ control, name: 'tipo_processo' }),
    data_audiencia: useWatch({ control, name: 'data_audiencia' }),
    data_defesa: useWatch({ control, name: 'data_defesa' }),
    data_reclamacao: useWatch({ control, name: 'data_reclamacao' }),
  }

  const handleDataAudienciaChange = (selectedDate: Date | null, field: ControllerRenderProps<DemandaProcon, "data_audiencia">) => {
    validaDataAudiencia(selectedDate ?? null  );

    if (!selectedDate) {
      field.onChange('');
      return;
    }

    field.onChange(selectedDate.toISOString());
  };

  const handleDataReclamacaoChange = (selectedDate: Date | null | undefined, field: ControllerRenderProps<DemandaProcon, "data_reclamacao">) => {
    validaDataReclamacao(selectedDate ?? null);

    if (!selectedDate) {
      field.onChange('');
      return;
    }

    field.onChange(selectedDate.toISOString());
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
            <Controller
              name="tipificacao"
              control={formBag.control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}>
                  <SelectTrigger ref={field.ref} className={errors.tipificacao ? "border-red-500" : ""} disabled>
                    <SelectValue placeholder="Selecione uma tipificação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Procon">Procon</SelectItem>
                    <SelectItem value="Procon / Consumidor.gov.br">Procon / Consumidor.gov.br</SelectItem>
                    <SelectItem value="Procon / Proconsumidor">Procon / Proconsumidor</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            <FieldMessage.Error.Text visible={!!errors.tipificacao}>
              {errors.tipificacao?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>

        <div className="space-y-2">
          <Label htmlFor="origem_reclamacao">Identificação da origem da reclamação</Label>
          <FieldMessage.Error.Root>
            <Controller
              name="origem_reclamacao"
              control={formBag.control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}>
                  <SelectTrigger className={errors.origem_reclamacao ? "border-red-500" : ""} disabled>
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
              )}
            />
            <FieldMessage.Error.Text visible={!!errors.origem_reclamacao}>
              {errors.origem_reclamacao?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo_processo">Tipo de processo</Label>
          <FieldMessage.Error.Root>
            <Controller
              name="tipo_processo"
              control={formBag.control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className={errors.tipo_processo ? "border-red-500" : ""} disabled>
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
              )}
            />
            <FieldMessage.Error.Text visible={!!errors.tipo_processo}>
              {errors.tipo_processo?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
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
                      disabled
                      onSelect={(selectedDate) => {
                        handleDataAudienciaChange(selectedDate, field);
                      }}
                    />
                    <X
                      className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-not-allowed"
                    />
                  </div>
                )}
              />
          </div>
          <FieldMessage.Error.Text>
            {errors.data_audiencia?.message}
          </FieldMessage.Error.Text>
        </FieldMessage.Error.Root>

        <div className="space-y-2">
          <Label htmlFor="data_defesa">Data de defesa</Label>
          <div className="group flex gap-2 items-center">
            <DatePicker
              date={values.data_defesa ? new Date(values.data_defesa) : undefined}
              disabled
              onSelect={(date) => {
                setValue('data_defesa', date?.toISOString());
              }}
            />
            <X
              className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-not-allowed"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="data_reclamacao">Data da reclamação</Label>
          <FieldMessage.Error.Root>
            <Controller
                name="data_reclamacao"
                control={control}
                render={({ field }) => (
                  <div className="group flex gap-2 items-center">
                    <DatePicker
                      date={values.data_reclamacao ? new Date(values.data_reclamacao) : undefined}
                      disabled
                      onSelect={(date) => {
                        handleDataReclamacaoChange(date, field);
                      }}
                    />
                    <X
                      className="w-4 h-4 text-gray-400 hover:text-red-500 cursor-not-allowed"
                    />
                  </div>
                )}
              />
            <FieldMessage.Error.Text visible={!!errors.data_reclamacao}>
              {errors.data_reclamacao?.message}
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
