import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Giulice.js",
  description: "Biblioteca de componentes React para Next.js",
};

export default function Home() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8  w-full sm:w-7xl mx-auto border-l border-r border-b border-t-none border-dashed border-zinc-200 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            Giulice.js
          </h1>
          <p className="mt-3 text-xl text-gray-500 dark:text-white">
            Biblioteca de componentes React para Next.js
          </p>
        </div>

        {/* Introdução */}
        <div className="bg-white dark:bg-zinc-900 shadow-lg rounded-lg overflow-hidden mb-10">
          <div className="bg-blue-600 dark:bg-blue-900 px-6 py-4">
            <h2 className="text-lg font-medium text-white">Sobre a Biblioteca</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Esta biblioteca oferece componentes React.js, customizáveis e acessíveis para projetos Next.js. 
              Cada componente foi desenvolvido seguindo práticas de UI/UX como design patterns, acessibilidade e responsividade.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Explore os componentes abaixo para ver demonstrações interativas e exemplos de uso.
            </p>
          </div>
        </div>

        {/* Grade de Componentes */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Componentes Disponíveis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Card do TextField */}
          <div className="bg-white dark:bg-zinc-900 shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">TextField</h3>
              <p className="text-gray-600 dark:text-gray-500 mb-4">
                Componente de entrada de texto customizável com suporte para labels, validação e botões auxiliares.
              </p>
              <Link 
                href="/text-field" 
                className="inline-block px-4 py-2 bg-blue-600 dark:bg-blue-800 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Ver demonstração
              </Link>
            </div>
          </div>

          {/* Espaço para futuros componentes */}
          <div className="bg-gray-100 dark:bg-black shadow rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-zinc-800 flex items-center justify-center p-5">
            <p className="text-gray-500 text-center">
              Mais componentes em breve...
            </p>
          </div>
        </div>

        {/* Rodapé */}
        <div className="text-center text-gray-500 mt-12">
          <p>
            Desenvolvido por Wendell Bitencourt
          </p>
        </div>
      </div>
    </div>
  );
}
