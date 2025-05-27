'use client';

import { TextField } from "@/components/TextField";
import { useState } from "react";

export const TextFieldComponent = () => {
  const [value1, setValue1] = useState('');
  const [value2, setValue2] = useState('');
  const [value3, setValue3] = useState('Texto pré-preenchido');
  const [value4, setValue4] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-8">
      {/* Exemplo Básico */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-white mb-2">Exemplo Básico</h3>
        <TextField.Root>
          <TextField.Content.Root>
            <TextField.Content.Label>
              Nome Completo
            </TextField.Content.Label>
            <TextField.Content.Input
              id="input-basic"
              name="input-basic"
              placeholder="Digite seu nome completo"
              type="text"
              value={value1}
              onChange={(e) => setValue1(e.target.value)}
            />
          </TextField.Content.Root>
          <TextField.Button.Root>
            <TextField.Button.Clean onClick={() => setValue1('')} />
          </TextField.Button.Root>
        </TextField.Root>
      </div>

      {/* Exemplo com Validação */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-white mb-2">Com Validação</h3>
        <TextField.Root>
          <TextField.Content.Root>
            <TextField.Content.Label>
              E-mail
            </TextField.Content.Label>
            <TextField.Content.Input
              id="input-email"
              name="input-email"
              placeholder="Digite seu e-mail"
              type="email"
              value={value2}
              onChange={(e) => setValue2(e.target.value)}
              className={value2 && !value2.includes('@') ? 'border-red-500' : ''}
            />
          </TextField.Content.Root>
          <TextField.Button.Root>
            <TextField.Button.Clean onClick={() => setValue2('')} />
          </TextField.Button.Root>
        </TextField.Root>
        {value2 && !value2.includes('@') && (
          <p className="mt-1 text-sm text-red-600">Por favor, informe um e-mail válido.</p>
        )}
      </div>

      {/* Exemplo Pré-preenchido */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-white mb-2">Pré-preenchido</h3>
        <TextField.Root>
          <TextField.Content.Root>
            <TextField.Content.Label>
              Descrição
            </TextField.Content.Label>
            <TextField.Content.Input
              id="input-prefilled"
              name="input-prefilled"
              placeholder="Digite uma descrição"
              type="text"
              value={value3}
              onChange={(e) => setValue3(e.target.value)}
            />
          </TextField.Content.Root>
          <TextField.Button.Root>
            <TextField.Button.Clean onClick={() => setValue3('')} />
            <TextField.Button.Clipboard value={value3} onClick={() => navigator.clipboard.writeText(value3)} />
          </TextField.Button.Root>
        </TextField.Root>
        <p className="mt-1 text-sm text-gray-500">Clique no ícone para copiar o texto.</p>
      </div>

      {/* Exemplo com Campo de Senha */}
      <div>
        <h3 className="text-sm font-medium text-gray-700 dark:text-white mb-2">Campo de Senha</h3>
        <TextField.Root>
          <TextField.Content.Root>
            <TextField.Content.Label>
              Senha
            </TextField.Content.Label>
            <TextField.Content.Input
              id="input-password"
              name="input-password"
              placeholder="Digite sua senha"
              type={showPassword ? "text" : "password"}
              value={value4}
              onChange={(e) => setValue4(e.target.value)}
            />
          </TextField.Content.Root>
          <TextField.Button.Root>
            <TextField.Button.Clean onClick={() => setValue4('')} />
            <TextField.Button.Password onClick={() => setShowPassword(!showPassword)} />
          </TextField.Button.Root>
        </TextField.Root>
        <p className="mt-1 text-sm text-gray-500">Clique no ícone de olho para mostrar/ocultar a senha.</p>
      </div>
    </div>
  )
}