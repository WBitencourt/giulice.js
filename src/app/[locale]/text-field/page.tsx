import { Metadata } from "next";
import { TextFieldComponent } from "./component";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Giulice.js | TextField",
  description: "Página de demonstração do componente TextField",
};

export default function TextFieldPage() {
  return (
    <div className="min-h-screen w-full">
      <div className="w-full mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b border-l border-r border-b border-t-none border-dashed border-zinc-200 dark:border-zinc-800">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            TextField
          </h2>
          <p className="mt-3 text-xl text-gray-500">
            Demonstração interativa do componente de entrada de texto
          </p>
        </div>

        {/* Cartão principal de demonstração */}
        <div className="shadow-lg dark:shadow-zinc-800 rounded-lg overflow-hidden mb-10">
          <div className="bg-blue-600 dark:bg-blue-900 px-6 py-4">
            <h2 className="text-lg font-medium text-white">Demonstração Básica</h2>
          </div>
          <div className="p-6 bg-white dark:bg-black border-b border-gray-200 dark:border-zinc-800">
            <TextFieldComponent />
          </div>
          <div className="bg-white dark:bg-black px-6 py-4">
            <p className="text-sm text-gray-600 dark:text-gray-500">
              Este é o componente TextField básico com funcionalidade de limpeza de campo.
              Digite algo para testar a interatividade.
            </p>
          </div>
        </div>

        {/* Seção de recursos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white dark:bg-zinc-900 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Características</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 text-blue-500">✓</span>
                <span className="ml-2">Input customizável</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 text-blue-500">✓</span>
                <span className="ml-2">Suporte para labels</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 text-blue-500">✓</span>
                <span className="ml-2">Botão de limpar campo</span>
              </li>
              <li className="flex items-start">
                <span className="flex-shrink-0 h-5 w-5 text-blue-500">✓</span>
                <span className="ml-2">Componente completamente acessível</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white dark:bg-zinc-900 shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Como usar</h3>
            <div className="bg-gray-800 rounded p-4 text-sm text-gray-300 overflow-x-auto">
<pre>
{
  `
// Exemplo básico
<TextField.Root>
  <TextField.Content.Root>
    <TextField.Content.Label>
      Nome Completo
    </TextField.Content.Label>
    <TextField.Content.Input
      placeholder="Digite seu nome"
      value={value}
      onChange={onChange}
    />
  </TextField.Content.Root>
  <TextField.Button.Root>
    <TextField.Button.Clean onClick={handleClear} />
  </TextField.Button.Root>
</TextField.Root>

// Com botão de copiar
<TextField.Button.Clipboard value={value} />

// Com campo de senha
<TextField.Button.Password onClick={togglePassword} />
  `
}
</pre>
            </div>
          </div>
        </div>

        {/* Rodapé com navegação */}
        <div className="flex justify-center items-center space-x-4 p-4 bg-white dark:bg-zinc-900 shadow rounded-lg">
          <Link className="px-4 py-2 text-blue-500 rounded-lg  transition-colors" href="/">
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}
