import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import moment from 'moment';
import { FileText, PlusCircle } from 'lucide-react';
import { Clipboard } from '@/components/Clipboard';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useState, useRef } from 'react';
import { actions } from '@/actionsV2';
import { toast } from '@/utils/toast';
import { useShallow } from 'zustand/shallow';
import { useAuthStore } from '@/zustand-store/auth.store';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface Observacao {
  criadaEm: string;
  mensagem: string;
  criadaPor: string;
}

interface Values {
  pk: string;
  createdBy: string;
  usuarioAtuando: string;
  dataCarimbo: string;
  dueDate: string;
  tipoDemanda: string;
  perfilDemanda: string;
  status: string;
  observacao: Observacao[];
};

interface DetalhesCadastroProps {
  pk: string;
  values: Values;
}

export function DetalhesCadastro({ pk, values }: DetalhesCadastroProps) {
  const [isAddingObsForm, setIsAddingObsForm] = useState(false);
  const [observacao, setObservacao] = useState<Observacao[]>(values?.observacao || []);
  const [inputObservacao, setInputObservacao] = useState('');
  const [showObservacaoInput, setShowObservacaoInput] = useState(false);
  const [observacaoError, setObservacaoError] = useState('');
  
  const inputObservacaoRef = useRef<HTMLTextAreaElement>(null);

  const { user } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
    }))
  );
  
  const dateNow = new Date();

  const adicionaObservacao = async () => {
    try {
      await actions.backend.demanda.adicionaObservacaoDemanda({
        pk,
        observacao: inputObservacao,
      });
    } catch (error: any) { 
      toast.error({
        title: 'Erro',
        description: error?.message,
      });
    }
  }

  const handleClickAdicionaObservacao = async () => {
    if (inputObservacao.length < 10) {
      setObservacaoError('Observação é obrigatória e deve ter no mínimo 10 caracteres');
      return;
    }

    try {
      setIsAddingObsForm(true);
      setObservacaoError('');

      await adicionaObservacao();

      setObservacao((state) => [
        ...state,
        {
          criadaEm: dateNow.toISOString(),
          mensagem: inputObservacao,
          criadaPor: user?.email || '',
        }
      ]);
      
      setInputObservacao('');
      setShowObservacaoInput(false);
    } catch (error: any) { 
      toast.error({
        title: 'Erro',
        description: error?.message,
      });
    } finally {
      setIsAddingObsForm(false);
    }
  }

  const handleDeleteObservacao = async (index: number) => {
    try {

      setObservacao((prevObservacoes) => {
        const newObservacoes = [...prevObservacoes];
        newObservacoes.splice(index, 1);
        return newObservacoes;
      });
      
      toast.success({
        title: 'Sucesso',
        description: 'Observação removida com sucesso',
      });
    } catch (error: any) {
      toast.error({
        title: 'Erro',
        description: error?.message || 'Erro ao remover observação',
      });
    }
  }

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="detalhes-cadastro">
          <AccordionTrigger className="text-lg font-semibold text-gray-700 flex items-center">
            <h3 className="text-base font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-gray-500" />
              <span>Detalhes do cadastro</span>
            </h3>         
          </AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-2 p-4 rounded-md">
              <div className="space-y-2">
                <Label htmlFor="pk">Pk / Id</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="pk"
                    type="text"
                    value={values.pk}
                    disabled
                    className="w-full p-2 border rounded-md text-sm"
                  />
                  <Clipboard value={values.pk} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="created_by">Criado por</Label>
                <Input 
                  id="created_by" 
                  readOnly 
                  disabled  
                  value={values?.createdBy}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usuario_atuando">Usuário atuando</Label>
                <Input 
                  id="usuario_atuando" 
                  readOnly 
                  disabled  
                  value={values?.usuarioAtuando}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_carimbo">Data do carimbo</Label>
                <Input 
                  id="data_carimbo" 
                  readOnly 
                  disabled  
                  value={values?.dataCarimbo ? moment(values?.dataCarimbo).locale('pt-br').format('DD/MM/YYYY HH:mm') : ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="due_date">Data de vencimento do cadastro</Label>
                <Input 
                  id="due_date" 
                  readOnly 
                  disabled  
                  value={values?.dueDate ? moment(values?.dueDate).locale('pt-br').format('DD/MM/YYYY HH:mm') : ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo_demanda">Tipo da demanda</Label>
                <Input 
                  id="tipo_demanda" 
                  disabled
                  placeholder="tipo da demanda..." 
                  value={values?.tipoDemanda}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Perfil da demanda</Label>
                <Input 
                  id="perfil_demanda" 
                  disabled
                  placeholder="Perfil da demanda..." 
                  value={values?.perfilDemanda}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status da demanda</Label>
                <Input 
                  id="status" 
                  disabled
                  placeholder="Status da demanda..." 
                  value={values?.status}
                />
              </div>
              
              <div className="flex flex-col gap-2 mt-6 ">
                <Label htmlFor="observacao">Observações</Label>
                
                <div className="border rounded-md p-4 bg-gray-50 dark:bg-gray-900">
                  {showObservacaoInput ? (
                    <div className="space-y-3">
                      <Label htmlFor="observacao">Nova observação</Label>
                      <div className="flex flex-col space-y-2">
                        <Textarea 
                          id="observacao" 
                          placeholder="Digite uma observação..."
                          value={inputObservacao}
                          onChange={(e) => {
                            setInputObservacao(e.target.value);
                            if (observacaoError && e.target.value.length >= 10) {
                              setObservacaoError('');
                            }
                          }}
                          ref={inputObservacaoRef}
                          className={`${observacaoError ? "border-red-500" : ""} min-h-[100px] bg-white dark:bg-gray-800`}
                        />
                        {observacaoError && (
                          <span className="text-red-500 text-sm">{observacaoError}</span>
                        )}
                      </div>
                      <div className="flex justify-end space-x-2 mt-2">
                        <Button 
                          type="button"
                          variant="outline" 
                          onClick={() => {
                            setShowObservacaoInput(false);
                            setInputObservacao('');
                            setObservacaoError('');
                          }}
                        >
                          Cancelar
                        </Button>
                        <Button 
                          type="button"
                          onClick={handleClickAdicionaObservacao}
                          disabled={isAddingObsForm}
                        >
                          {isAddingObsForm ? 'Adicionando...' : 'Adicionar'}
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <button
                      className="flex items-center justify-center w-full py-3 text-center text-green-600 dark:text-green-500 border border-dashed border-green-300 dark:border-green-700 rounded-md hover:bg-green-50 dark:hover:bg-green-900/30"
                      onClick={() => {
                        setShowObservacaoInput(true);
                        setTimeout(() => {
                          inputObservacaoRef.current?.focus();
                        }, 0);
                      }}
                    >
                      <PlusCircle className="w-5 h-5 mr-2" />
                      Adicionar observação
                    </button>
                  )}

                  {(observacao.length > 0 || (values?.observacao && values.observacao.length > 0)) && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Observações adicionadas</h4>
                      <div className="space-y-2">
                        {observacao.sort((a, b) => new Date(b.criadaEm).getTime() - new Date(a.criadaEm).getTime()).map((item, index) => (
                          <div key={index} className="flex items-start justify-between p-3 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md">
                            <div className="flex flex-col gap-2 flex-1">
                              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1">
                                <span>{moment(item.criadaEm).locale('pt-br').format('DD/MM/YYYY HH:mm')}</span>
                                <span className="mx-1">-</span>
                                <span>{item.criadaPor}</span>
                              </div>
                              <p className="text-sm font-normal dark:text-gray-300">{item.mensagem}</p>
                            </div>
                            {/* <Tooltip.Root>
                              <Tooltip.Trigger>
                                <button 
                                  type="button"
                                  onClick={() => handleDeleteObservacao(index)}
                                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </Tooltip.Trigger>
                              <Tooltip.Content side="left">
                                Excluir
                              </Tooltip.Content>
                            </Tooltip.Root> */}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
