import React from 'react';
import { Controller, UseFormReturn, useFormState, useWatch } from 'react-hook-form';
import { FileSignature, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldMessage } from '@/components/FieldMessage';
import { maskNumeroProcesso } from '@/utils/Masks';
import { DadosDemandaCadastroJuridico } from '../../interfaces';

interface DetalhesProcessoProps {
  formBag: UseFormReturn<DadosDemandaCadastroJuridico>;
  isConsultandoProcesso: boolean;
  onConsultaProcesso: () => void;
}

const DetalhesProcessoComponent = ({ formBag, onConsultaProcesso, isConsultandoProcesso }: DetalhesProcessoProps) => {
  console.log('Componente DetalhesProcesso renderizado');

  const { control, setValue, getValues } = formBag;

  const { errors } = useFormState({
    control,
    name: ['processo', 'tipificacao', 'desdobramento', 'processo_originario', 'nome_desdobramento'],
  });

  const values = {
    processo: useWatch({ control, name: 'processo' }),
    tipificacao: useWatch({ control, name: 'tipificacao' }),
    desdobramento: useWatch({ control, name: 'desdobramento' }) || false,
    processo_originario: useWatch({ control, name: 'processo_originario' }),
    nome_desdobramento: useWatch({ control, name: 'nome_desdobramento' }),
  }

  const handleOnConsultaProcesso = () => {
    onConsultaProcesso();
  }

  const handleDesdobramentoChange = () => {
    const newState = !getValues('desdobramento');

    setValue('desdobramento', newState);

    if (newState) {
      setValue('processo_originario', '');
    }
  };

  return (
    <div>
      <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
        <FileSignature className="w-5 h-5 mr-2 text-blue-500" />
        <span>Detalhes do processo</span>
      </h3>

      <div className="space-y-4 bg-blue-50 dark:bg-blue-950/30 p-3 rounded-md">
        <div>
          <Label className="block text-sm mb-1">NUP (LA)</Label>
          <div className="flex items-center">
            <Input
              type="text"
              placeholder="Número de processo padrão CNJ"
              className="w-full p-2 border rounded-l-md text-sm"
              disabled
              value={values.processo}
              onChange={(event) =>
                setValue('processo', maskNumeroProcesso(event.currentTarget.value))
              }
            />
            <button
              type="button"
              className={`bg-blue-500 text-white px-3 py-2 rounded-r-md text-sm flex items-center disabled:opacity-70 disabled:cursor-not-allowed ${
                isConsultandoProcesso ? 'opacity-70 cursor-not-allowed' : ''
              }`}
              onClick={handleOnConsultaProcesso}
              disabled
            >
              {isConsultandoProcesso ? (
                <span>Consultando...</span>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-1" /> Consultar
                </>
              )}
            </button>
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
              )}
            />
            <FieldMessage.Error.Text>
              {errors.tipificacao?.message}
            </FieldMessage.Error.Text>
          </FieldMessage.Error.Root>
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm">Desdobramento</Label>
          <div
            className={`relative inline-block w-10 h-5 rounded-full transition-colors duration-200 ease-in-out ${
              values.desdobramento ? 'bg-blue-500' : 'bg-gray-300'
            }`}
            onClick={() => {}}
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
              onChange={() => {}}
              disabled
            />
          </div>
        </div>

        {/* Campo condicional que aparece quando Desdobramento está ativado */}
        {values.desdobramento && (
          <div className="mt-3 pl-4 border-l-2 border-blue-300 space-y-4">
            <div>
              <Label className="block text-sm mb-1">Número do processo originário</Label>
              <Input
                type="text"
                placeholder="Número de processo originário CNJ"
                value={values.processo_originario}
                disabled
                className="w-full p-2 border rounded-md text-sm"
                onChange={(event) =>
                  setValue('processo_originario', maskNumeroProcesso(event.currentTarget.value))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nome_desdobramento">Nome do desdobramento</Label>
              <Controller
                name="nome_desdobramento"
                control={formBag.control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled
                  >
                    <SelectTrigger ref={field.ref}>
                      <SelectValue placeholder="Selecione um desdobramento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Agravo de Instrumento">Agravo de Instrumento</SelectItem>
                      <SelectItem value="Carta Precatória">Carta Precatória</SelectItem>
                      <SelectItem value="Cautelar">Cautelar</SelectItem>
                      <SelectItem value="Conexão">Conexão</SelectItem>
                      <SelectItem value="Consulta">Consulta</SelectItem>
                      <SelectItem value="Convertido">Convertido</SelectItem>
                      <SelectItem value="Cumprimento de Sentença">Cumprimento de Sentença</SelectItem>
                      <SelectItem value="Distribuição por Dependência">Distribuição por Dependência</SelectItem>
                      <SelectItem value="Embargos à execução">Embargos à execução</SelectItem>
                      <SelectItem value="Embargos de terceiros">Embargos de terceiros</SelectItem>
                      <SelectItem value="Habeas corpus">Habeas corpus</SelectItem>
                      <SelectItem value="Mandado de segurança">Mandado de segurança</SelectItem>
                      <SelectItem value="Mesmo processo">Mesmo processo</SelectItem>
                      <SelectItem value="Migrado para o EPROC">Migrado para o EPROC</SelectItem>
                      <SelectItem value="Notificação Extrajudicial">Notificação Extrajudicial</SelectItem>
                      <SelectItem value="Objeto similar">Objeto similar</SelectItem>
                      <SelectItem value="Ofício">Ofício</SelectItem>
                      <SelectItem value="Parecer">Parecer</SelectItem>
                      <SelectItem value="PROCON">PROCON</SelectItem>
                      <SelectItem value="Produção de Provas Antecipada">Produção de Provas Antecipada</SelectItem>
                      <SelectItem value="Rescisória">Rescisória</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const DetalhesProcesso = React.memo(DetalhesProcessoComponent, (prevProps, nextProps) => {
  // console.log('prevProps', prevProps);
  // console.log('nextProps', nextProps);

  // console.log('prevProps.isConsultandoProcesso !== nextProps.isConsultandoProcesso', prevProps.isConsultandoProcesso !== nextProps.isConsultandoProcesso);
  // console.log('prevProps.onConsultaProcesso.toString() !== nextProps.onConsultaProcesso.toString()', prevProps.onConsultaProcesso.toString() !== nextProps.onConsultaProcesso.toString());

  if (prevProps.isConsultandoProcesso !== nextProps.isConsultandoProcesso) {
    return false;
  }

  if (prevProps.onConsultaProcesso.toString() !== nextProps.onConsultaProcesso.toString()) {
    return false;
  }

  return true
}); 