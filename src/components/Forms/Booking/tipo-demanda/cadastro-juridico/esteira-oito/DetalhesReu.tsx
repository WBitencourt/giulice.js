import React, { useCallback, useState } from 'react';
import { UseFormReturn, useFormState, useWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FieldMessage } from '@/components/FieldMessage';
import { cn } from '@/utils/ClassName';
import { Plus, Trash2, Users } from 'lucide-react';
import { maskCpfCnpj } from '@/utils/Masks';
import { v4 as uuid } from 'uuid';
import { DemandaCadastroJuridico, Reu } from '../../interfaces';
import { Label } from '@/components/ui/label';

interface DetalhesReuProps {
  formBag: UseFormReturn<DemandaCadastroJuridico>;
}

const DetalhesReuComponent = ({ formBag }: DetalhesReuProps) => {
  console.log('Componente DetalhesReu renderizado');

  const { setValue, getValues, setError, clearErrors, control } = formBag;

  const { errors } = useFormState({
    control,
    name: ['lista_reus'],
  });

  const values = {
    lista_reus: useWatch({ control, name: 'lista_reus' }),
    desdobramento: useWatch({ control, name: 'desdobramento' }),
  }

  const [reu, setReu] = useState({
    nome: '',
    documento: '',
  });

  const updateInputReu = useCallback((reu: Partial<Reu>) => {
    setReu((state) => ({
      ...state,
      ...reu,
    }));
  }, []);

  const handleAdicionarReu = () => {
    const nome = reu.nome?.trim();
    const documento = reu.documento?.trim();

    const lista_reus = getValues('lista_reus') ?? [];

    if (!nome || !documento) {
      setError('lista_reus', {
        message: 'Por favor, preencha o nome e documento do réu.',
      });

      return;
    }

    const novoReu: Reu = {
      id: uuid(),
      nome,
      documento,
    };

    setValue('lista_reus', [...lista_reus, novoReu]);
    clearErrors('lista_reus');

    // Limpar os campos após adicionar
    updateInputReu({
      nome: '',
      documento: '',
    });
  };

  const handleRemoverReu = (id: string) => {
    const lista_reus = getValues('lista_reus');

    const novaLista = lista_reus?.filter((prevReu) => prevReu.id !== id);

    setValue('lista_reus', novaLista);
  };

  return (
    <div>
      <FieldMessage.Error.Root>
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-orange-500" />
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Detalhes do Réu</h3>
        </div>
        <div
          className={cn(
            'space-y-4 bg-orange-50 dark:bg-orange-950/30 p-3 rounded-md',
            errors.lista_reus ? 'border border-red-500' : ''
          )}>
          <div>
            <Label className="block text-sm mb-1">Nome completo</Label>
            <Input
              type="text"
              placeholder="... nome completo do réu..."
              className="w-full p-2 border rounded-md text-sm"
              onChange={(e) => updateInputReu({ nome: e.target.value })}
              value={reu.nome}
              disabled={values.desdobramento}
            />
          </div>
          <div>
            <Label className="block text-sm mb-1">Documento réu</Label>
            <Input
              type="text"
              placeholder="... documento réu ..."
              className="w-full p-2 border rounded-md text-sm"
              onChange={(e) => updateInputReu({ documento: maskCpfCnpj(e.target.value) })}
              value={reu.documento}
              disabled={values.desdobramento}
            />
          </div>

          <button
            type="button"
            onClick={handleAdicionarReu}
            disabled={values.desdobramento}
            className="w-full bg-orange-500 text-white px-4 py-2 rounded-md text-sm hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <Plus className="w-4 h-4" />
            Adicionar réu
          </button>
          
          {values?.lista_reus && values.lista_reus.length > 0 && (
            <div className="mt-4">
              <div className="bg-gray-50 dark:bg-gray-950/30 rounded-md border">
                <div className="p-3 border-b bg-gray-100 dark:bg-gray-950/30">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Réus adicionados</h4>
                </div>
                <div className="divide-y">
                  {values.lista_reus.map((reuItem) => (
                    <div
                      key={reuItem.id}
                      className="p-3 flex items-center justify-between dark:bg-black hover:bg-gray-100 hover:dark:bg-gray-950">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{reuItem.nome}</p>
                          <span className="px-2 py-0.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 rounded text-xs text-nowrap">
                            {reuItem.documento}
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoverReu(reuItem.id)}
                        disabled={values.desdobramento}
                        className="p-1 hover:bg-red-100 rounded-full transition-colors group disabled:opacity-50 disabled:cursor-not-allowed">
                        <Trash2 className="w-4 h-4 text-gray-400 group-hover:text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        <FieldMessage.Error.Text visible={!!errors.lista_reus}>
          {errors.lista_reus?.message}
        </FieldMessage.Error.Text>
      </FieldMessage.Error.Root>
    </div>
  );
};

export const DetalhesReu = React.memo(DetalhesReuComponent, (prevProps, nextProps) => {
  // como não há props, sempre retorna true para não re-renderizar
  return true;
});
