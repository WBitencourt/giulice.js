import React, { useCallback, useEffect, useState } from 'react';
import { FileSignature } from 'lucide-react';
import { useFormContext, UseFormReturn, useWatch } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FieldMessage } from '@/components/FieldMessage';
import { actions } from '@/actionsV2'
import { picklist } from '../../../picklists';
import { DadosDemandaProcon } from '../../interfaces';

interface Options {
  uf: string[];
  cidade: string[];
}

interface RegiaoProps {
  formBag: UseFormReturn<DadosDemandaProcon>;
}

const RegiaoComponent = ({ formBag }: RegiaoProps) => {  
  console.log('Componente Regiao renderizado X');

  const { formState, setValue, clearErrors, control } = formBag;

  const values = {
    uf: useWatch({ control, name: 'uf' }),
    cidade: useWatch({ control, name: 'cidade' }),
  }

  const [options, setOptions] = useState<Options>({
    uf: [],
    cidade: [],
  });

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

  const handleUfChange = (newValue: string) => {
    const novaUf = newValue;

    setValue('uf', novaUf);
    setValue('cidade', '');

    clearErrors('uf');

    updateCidadesPorUf(novaUf);
  };

  useEffect(() => {
    updateCidadesPorUf(values.uf);
  }, []);

  return (
    <div>
      <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
        <FileSignature className="w-5 h-5 mr-2 text-green-500" />
        <span>Região</span>
      </h3>

      <div className="space-y-4 bg-green-50 dark:bg-green-950/50 p-3 rounded-md mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="uf">UF</Label>
            <FieldMessage.Error.Root>
              <Select 
                value={values.uf} 
                disabled
                onValueChange={handleUfChange}>
                <SelectTrigger className={formState.errors.uf ? "border-red-500" : ""}>
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
              <FieldMessage.Error.Text visible={!!formState.errors.uf}>
                {formState.errors.uf?.message}
              </FieldMessage.Error.Text>
            </FieldMessage.Error.Root>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cidade">Cidade</Label>
            <FieldMessage.Error.Root>
              <Select
                value={values.cidade}
                disabled
                onValueChange={(value) => {
                  setValue('cidade', value);
                  clearErrors('cidade');
                }}>
                <SelectTrigger className={formState.errors.cidade ? "border-red-500" : ""}>
                  <SelectValue placeholder="Selecione a Cidade" />
                </SelectTrigger>
                <SelectContent>
                  {options.cidade.map((cidade) => (
                    <SelectItem key={cidade} value={cidade}>
                      {cidade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldMessage.Error.Text visible={!!formState.errors.cidade}>
                {formState.errors.cidade?.message}
              </FieldMessage.Error.Text>
            </FieldMessage.Error.Root>
          </div>
        </div>
      </div>
    </div>
  );
};

// export const Regiao = React.memo(RegiaoComponent);

export const Regiao = React.memo(RegiaoComponent, (prevProps, nextProps) => {
  // como não há props, sempre retorna true para não re-renderizar
  return true;
});