'use client';

import { Autocomplete } from "@/components/autocomplete";
import { useState } from "react";
import { SelectedOption } from "@/components/autocomplete/single/contexts";

export const AutocompleteComponent = () => {
  const [selectedOption1, setSelectedOption1] = useState<SelectedOption>(undefined);
  const [selectedOption2, setSelectedOption2] = useState<SelectedOption>(undefined);
  const [selectedOption3, setSelectedOption3] = useState<SelectedOption>({ label: 'Texto pré-preenchido', value: 'texto-pre-preenchido' });
  
  const countries = [
    { label: '🇧🇷 Brasil', value: 'br', name: 'Brasil' },
    { label: '🇺🇸 Estados Unidos', value: 'us', name: 'Estados Unidos' },
    { label: '🇵🇹 Portugal', value: 'pt', name: 'Portugal' },
    { label: '🇪🇸 Espanha', value: 'es', name: 'Espanha' },
    { label: '🇫🇷 França', value: 'fr', name: 'França' },
    { label: '🇩🇪 Alemanha', value: 'de', name: 'Alemanha' },
    { label: '🇮🇹 Itália', value: 'it', name: 'Itália' },
  ].sort((a, b) => a.name.localeCompare(b.name));
  
  const emails = [
    { label: 'exemplo@email.com', value: 'exemplo@email.com' },
    { label: 'usuario@teste.com', value: 'usuario@teste.com' },
    { label: 'contato@empresa.com', value: 'contato@empresa.com' },
  ];
  
  const descriptions = [
    { label: 'Texto pré-preenchido', value: 'texto-pre-preenchido' },
    { label: 'Descrição padrão', value: 'descricao-padrao' },
    { label: 'Outro texto de exemplo', value: 'outro-texto' },
  ];

  return (
    <div className="space-y-8">
      {/* Exemplo Básico */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-white mb-2">Exemplo Básico</h3>
        <Autocomplete.Single.Root
          picklist={countries}
          selectedOption={selectedOption1}
          onOptionChange={setSelectedOption1}
          freeSolo={false}
        >
          <Autocomplete.Single.Input
            label="País"
            placeholder="Digite o nome de um país"
            id="input-basic"
            name="input-basic"
          />
          <Autocomplete.Single.PickList.Root>
            <Autocomplete.Single.PickList.Bag>
              {(bag) => (
                <Autocomplete.Single.PickList.Container>
                  {bag.list.map((item, index) => (
                    <Autocomplete.Single.PickList.Item
                      key={item.value}
                      index={index}
                      item={item}
                    />
                  ))}
                </Autocomplete.Single.PickList.Container>
              )}
            </Autocomplete.Single.PickList.Bag>
            <Autocomplete.Single.PickList.Empty>
              Nenhum país encontrado
            </Autocomplete.Single.PickList.Empty>
          </Autocomplete.Single.PickList.Root>
        </Autocomplete.Single.Root>
      </div>

      {/* Exemplo com Validação */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-white mb-2">Com Validação</h3>
        <Autocomplete.Single.Root
          picklist={emails}
          selectedOption={selectedOption2}
          onOptionChange={setSelectedOption2}
          freeSolo={true}
        >
          <Autocomplete.Single.Input
            label="E-mail"
            placeholder="Digite seu e-mail"
            id="input-email"
            name="input-email"
          />
          <Autocomplete.Single.PickList.Root>
            <Autocomplete.Single.PickList.Bag>
              {(bag) => (
                <Autocomplete.Single.PickList.Container>
                  {bag.list.map((item, index) => (
                    <Autocomplete.Single.PickList.Item
                      key={item.value}
                      index={index}
                      item={item}
                    />
                  ))}
                </Autocomplete.Single.PickList.Container>
              )}
            </Autocomplete.Single.PickList.Bag>
            <Autocomplete.Single.PickList.Empty>
              Nenhum e-mail encontrado
            </Autocomplete.Single.PickList.Empty>
          </Autocomplete.Single.PickList.Root>
        </Autocomplete.Single.Root>
        {selectedOption2?.label && !selectedOption2.label.includes('@') && (
          <p className="mt-1 text-sm text-red-600">Por favor, informe um e-mail válido.</p>
        )}
      </div>

      {/* Exemplo Pré-preenchido */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-white mb-2">Pré-preenchido</h3>
        <Autocomplete.Single.Root
          picklist={descriptions}
          selectedOption={selectedOption3}
          onOptionChange={setSelectedOption3}
        >
          <Autocomplete.Single.Input
            label="Descrição"
            placeholder="Digite uma descrição"
            id="input-prefilled"
            name="input-prefilled"
          />
          <Autocomplete.Single.PickList.Root>
            <Autocomplete.Single.PickList.Bag>
              {(bag) => (
                <Autocomplete.Single.PickList.Container>
                  {bag.list.map((item, index) => (
                    <Autocomplete.Single.PickList.Item
                      key={item.value}
                      index={index}
                      item={item}
                    />
                  ))}
                </Autocomplete.Single.PickList.Container>
              )}
            </Autocomplete.Single.PickList.Bag>
            <Autocomplete.Single.PickList.Empty>
              Nenhuma descrição encontrada
            </Autocomplete.Single.PickList.Empty>
          </Autocomplete.Single.PickList.Root>
        </Autocomplete.Single.Root>
        <p className="mt-1 text-sm text-gray-500">Selecione uma das opções pré-definidas ou digite uma nova.</p>
      </div>
    </div>
  )
}