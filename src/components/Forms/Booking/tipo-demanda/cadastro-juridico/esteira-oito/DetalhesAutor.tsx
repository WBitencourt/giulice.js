import React, { useCallback, useState } from 'react';
import { UseFormReturn, useFormState, useWatch } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { FieldMessage } from '@/components/FieldMessage';
import { cn } from '@/utils/ClassName';
import { Mail, Phone, Plus, Trash2, User } from 'lucide-react';
import { maskCpfCnpj, maskEmail, maskPhone } from '@/utils/Masks';
import { v4 as uuid } from 'uuid';
import { Autor, DemandaCadastroJuridico } from '../../interfaces';
import { Label } from '@/components/ui/label';

interface DetalhesAutorProps {
  formBag: UseFormReturn<DemandaCadastroJuridico>;
}

const DetalhesAutorComponent = ({ formBag }: DetalhesAutorProps) => {
  console.log('Componente DetalhesAutor renderizado');

  const { setValue, clearErrors, setError, control } = formBag;

  const { errors } = useFormState({
    control,
    name: ['lista_autores'], 
  });

  const [autor, setAutor] = useState({
    nome: '',
    documento: '',
    email: '',
    telefone: '',
  });
  
  const values = {
    lista_autores: useWatch({ control, name: 'lista_autores' }),
    desdobramento: useWatch({ control, name: 'desdobramento' }),
  }

  const updateInputAutor = useCallback((autor: Partial<Autor>) => {
    setAutor((state) => ({
      ...state,
      ...autor,
    }));
  }, []);

  const handleAdicionarAutor = () => {
    const nome = autor.nome?.trim();
    const documento = autor.documento?.trim();
    const email = autor.email?.trim();
    const telefone = autor.telefone?.trim();

    const listaAutores = values.lista_autores ?? [];

    if (!nome || !documento) {
      setError('lista_autores', {
        message: 'Por favor, preencha pelo menos o nome e documento do autor.',
      });

      return;
    }

    const novoAutor: Autor = {
      id: uuid(),
      nome,
      documento,
      email: email ?? '',
      telefone: telefone ?? '',
    };

    setValue('lista_autores', [...listaAutores, novoAutor]);
    clearErrors('lista_autores');

    // Limpar os campos após adicionar
    updateInputAutor({
      nome: '',
      documento: '',
      email: '',
      telefone: '',
    });
  };

  const handleRemoverAutor = (id: string) => {
    const novaLista = values.lista_autores?.filter((prevAutor, index) => prevAutor.id !== id);

    setValue('lista_autores', novaLista);

    clearErrors('lista_autores');
  };

  return (
    <div>
      <FieldMessage.Error.Root>
        <div className="flex items-center gap-2 mb-3">
          <User className="w-5 h-5 text-purple-500" />
          <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Detalhes do Autor</h3>
        </div>
        <div
          className={cn(
            'space-y-4 bg-purple-50 dark:bg-purple-950/50 p-3 rounded-md',
            errors.lista_autores ? 'border border-red-500' : ''
          )}>
          <div>
            <Label className="block text-sm mb-1">Nome completo</Label>
            <Input
              type="text"
              placeholder="... nome completo do autor..."
              className="w-full p-2 border rounded-md text-sm"
              onChange={(e) => updateInputAutor({ nome: e.target.value })}
              value={autor.nome}
              disabled={values.desdobramento}
            />
          </div>
          <div>
            <Label className="block text-sm mb-1">Documento autor</Label>
            <Input
              type="text"
              placeholder="... documento autor ..."
              className="w-full p-2 border rounded-md text-sm"
              onChange={(e) => updateInputAutor({ documento: maskCpfCnpj(e.target.value) })}
              value={autor.documento}
              disabled={values.desdobramento}
            />
          </div>
          <div>
            <Label className="block text-sm mb-1">Email do autor</Label>
            <Input
              type="text"
              placeholder="... email do autor ..."
              className="w-full p-2 border rounded-md text-sm"
              onChange={(e) => updateInputAutor({ email: maskEmail(e.target.value) })}
              value={autor.email}
              disabled={values.desdobramento}
            />
          </div>
          <div>
            <Label className="block text-sm mb-1">Telefone / celular do autor</Label>
            <Input
              type="text"
              placeholder="... telefone do autor ..."
              className="w-full p-2 border rounded-md text-sm"
              onChange={(e) => updateInputAutor({ telefone: maskPhone(e.target.value) })}
              value={autor.telefone}
              disabled={values.desdobramento}
            />
          </div>

          <button
            type="button"
            onClick={handleAdicionarAutor}
            disabled={values.desdobramento}
            className="w-full bg-purple-500 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
            <Plus className="w-4 h-4" />
            Adicionar autor
          </button>

          {values?.lista_autores && values.lista_autores.length > 0 && (
            <div className="mt-4">
              <div className="bg-gray-50 dark:bg-gray-950/30 rounded-md border">
                <div className="p-3 border-b bg-gray-100 dark:bg-gray-950/30">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Autores adicionados</h4>
                </div>
                <div className="divide-y">
                  {values.lista_autores.map((autorItem) => (
                    <div
                      key={autorItem.id}
                      className="p-3 flex items-center justify-between dark:bg-black hover:bg-gray-100 hover:dark:bg-gray-950">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{autorItem.nome}</p>
                          <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 rounded text-xs text-nowrap">
                            {autorItem.documento}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          {autorItem.email && (
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {autorItem.email}
                            </span>
                          )}
                          {autorItem.telefone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {autorItem.telefone}
                            </span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoverAutor(autorItem.id)}
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
        <FieldMessage.Error.Text>
          {errors.lista_autores?.message}
        </FieldMessage.Error.Text>
      </FieldMessage.Error.Root>
    </div>
  );
};

export const DetalhesAutor = React.memo(DetalhesAutorComponent, (prevProps, nextProps) => {
  // como não há props, sempre retorna true para não re-renderizar
  return true;
});
