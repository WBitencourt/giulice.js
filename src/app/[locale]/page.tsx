import { Metadata } from "next";
import Link from "next/link";
import { Link as LinkIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export const metadata: Metadata = {
  title: "Giulice.js",
  description: "Biblioteca de componentes React para Next.js",
};

export default function Home() {
  const t = useTranslations('pages.home');
  
  const cards = [
    {
      title: t('components.textfield.title'),
      description: t('components.textfield.description'),
      href: "/text-field",
    },
    {
      title: t('components.autocomplete.title'),
      description: t('components.autocomplete.description'),
      href: "/autocomplete",
    },
  ].sort((a, b) => a.title.localeCompare(b.title));
  
  return (
    <div className="min-h-screen w-full py-12 px-4 sm:px-6 lg:px-8 mx-auto border-l border-r border-b border-t-none border-dashed border-zinc-200 dark:border-zinc-800">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-3 text-xl text-gray-500 dark:text-white">
            {t('subtitle')}
          </p>
        </div>

        {/* Introdução */}
        <div className="bg-white dark:bg-zinc-900 shadow-lg rounded-lg overflow-hidden mb-10">
          <div className="bg-blue-600 dark:bg-blue-900 px-6 py-4">
            <h2 className="text-lg font-medium text-white">{t('about.title')}</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              {t('about.description1')} {t('about.description2')}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              {t('about.callToAction')}
            </p>
          </div>
        </div>

        {/* Grade de Componentes */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('components.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {
            cards.map((card) => (
              <div key={card.href} className="bg-white dark:bg-zinc-900 shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <div className="flex flex-col p-5 h-full">
                  <h3 className="flex-1 text-lg font-medium text-gray-900 dark:text-white mb-2">{card.title}</h3>
                  <p className="text-gray-600 dark:text-gray-500 mb-4 flex-2">
                    {card.description}
                  </p>
                  <Link 
                    href={card.href} 
                    className="flex items-center justify-center px-4 py-2 text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    {t('components.autocomplete.demo')}
                  </Link>
                </div>
              </div>
            ))
          }

          {/* Espaço para futuros componentes */}
          <div className="bg-gray-100 dark:bg-black shadow rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-zinc-800 flex items-center justify-center p-5">
            <p className="text-gray-500 text-center">
              {t('components.comingSoon')}
            </p>
          </div>
        </div>

        {/* Rodapé */}
        <div className="text-center text-gray-500 mt-12">
          <p>
            {t('footer.credits')}
          </p>
        </div>
      </div>
    </div>
  );
}
