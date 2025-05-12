import React, { useCallback, useState } from 'react';
import { ControllerRenderProps, UseFormReturn, useFormState, useWatch } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { FieldMessage } from '@/components/FieldMessage';
import { List, Plus, Trash2 } from 'lucide-react';
import { DemandaCadastroJuridico } from '../../interfaces';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { maskCurrencyBRL } from '@/utils/Masks';
import { cn } from '@/utils/ClassName';
import { Input } from '@/components/ui/input';
import { toast } from '@/utils/toast';
import { v4 as uuid } from 'uuid';
interface PedidosProps {
  formBag: UseFormReturn<DemandaCadastroJuridico>;
}

const PedidosComponent = ({ formBag }: PedidosProps) => {
  console.log('Componente Pedidos renderizado');

  const { control, getValues, setError, setValue, clearErrors } = formBag;

  const { errors } = useFormState({
    control,
    name: ['lista_pedidos'],
  });

  const [pedidos, setPedidos] = useState({
    descricao: '',
    valor: maskCurrencyBRL('0'),
  });

  const values = {
    lista_pedidos: useWatch({ control, name: 'lista_pedidos' }),
  }

  const updatePedidos = useCallback((pedido: Partial<{ descricao: string; valor: string }>) => {
    setPedidos((state) => ({
      ...state,
      ...pedido,
      valor: pedido.valor ? maskCurrencyBRL(pedido.valor) : state.valor,
    }));
  }, []);

  const handleAdicionarPedido = () => {
    if (!pedidos.descricao || !pedidos.valor) {
      toast.warning({
        title: 'Aviso!',
        description: 'Por favor, preencha todos os campos do pedido',
      });

      setError('lista_pedidos', { type: 'required', message: 'Por favor, preencha todos os campos do pedido' });
      return;
    }

    setValue('lista_pedidos', [
      ...(getValues('lista_pedidos') ?? []),
      {
        id: uuid(),
        descricao: pedidos.descricao,
        valor: pedidos.valor,
      },
    ]);

    updatePedidos({ descricao: '', valor: '0' });

    clearErrors('lista_pedidos');
  };

  const handleRemoverPedido = (id: string) => {
    const listaVelha = getValues('lista_pedidos');
    const listaNova = listaVelha?.filter((prevPedido) => prevPedido.id !== id);

    setValue('lista_pedidos', listaNova);
  };

  return (
    <div>
    <FieldMessage.Error.Root>
      <div className="flex items-center gap-2 mb-3">
        <List className="w-5 h-5 text-indigo-500" />
        <h3 className="text-md font-medium text-gray-700 dark:text-gray-300">Pedidos</h3>
      </div>
      <div
        className={cn(
          'space-y-4 bg-indigo-50 dark:bg-indigo-950/30 p-3 rounded-md',
          errors.lista_pedidos ? 'border border-red-500' : ''
        )}>
        <div className="space-y-2">
          <Label htmlFor="pedido">Pedidos</Label>
          <Select 
            value={pedidos.descricao} 
            onValueChange={(value) => updatePedidos({ descricao: value })} 
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um pedido" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dano material">Dano material</SelectItem>
              <SelectItem value="Dano moral">Dano moral</SelectItem>
              <SelectItem value="Devolução em Dobro">Devolução em Dobro</SelectItem>
              <SelectItem value="Obrigação de fazer">Obrigação de fazer</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="block text-sm mb-1">Valor do pedido</Label>
          <Input
            type="text"
            value={pedidos.valor}
            placeholder="0,00"  
            disabled
            className="w-full p-2 border rounded-md text-sm"
            onChange={(event) => {
              const value = event.target.value;
              const formattedValue = maskCurrencyBRL(value); // Formata o valor para BRL

              updatePedidos({ valor: formattedValue });
            }}
          />
        </div>

        <button
          type="button"
          onClick={handleAdicionarPedido}
          disabled
          className="w-full bg-indigo-500 text-white px-4 py-2 rounded-md text-sm hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
          <Plus className="w-4 h-4" />
          Adicionar pedido
        </button>

        {values?.lista_pedidos && values?.lista_pedidos?.length > 0 && (
          <div className="mt-4">
            <div className="bg-gray-50 dark:bg-gray-950/30 rounded-md border">
              <div className="p-3 border-b bg-gray-100 dark:bg-gray-950/30">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Pedidos adicionados</h4>
              </div>
              <div className="divide-y">
                {values?.lista_pedidos?.map((pedido, index) => pedido && (
                  <div
                    key={pedido.id || index}
                    className="p-3 flex items-center justify-between dark:bg-black hover:bg-gray-100 hover:dark:bg-gray-950">
                    <div className="flex-1">
                      <p className="text-sm">{pedido?.descricao}</p>
                      <p className="text-sm">{pedido?.valor ? maskCurrencyBRL(pedido.valor) : 'R$ 0,00'}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoverPedido(pedido.id)}
                      className="p-1 hover:bg-red-100 rounded-full transition-colors group">
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
        {errors.lista_pedidos?.message}
      </FieldMessage.Error.Text>
    </FieldMessage.Error.Root>
  </div>
  );
};

export const Pedidos = React.memo(PedidosComponent, (prevProps, nextProps) => {
  // como não há props, sempre retorna true para não re-renderizar
  return true;
});
