import packageJson from '../../../package.json';

export function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="sticky bottom-0 z-10 text-center lg:text-left bg-zinc-100 dark:bg-zinc-800 text-xs">
      {/* <div className='bg-gradient-to-r from-logo-first to-logo-second h-10 w-10 rounded-full'></div> */}
      <div className="flex flex-wrap gap-1 justify-center text-gray-900 dark:text-gray-100 text-center p-2">
        Copyright © {year}
        <a 
          className="text-gray-900 dark:text-gray-100 no-underline" 
          target="_blank" 
          href="https://oitojuridico.com.br/" 
          rel="noreferrer">
            Oito Tecnologia Jurídica.
        </a>
        Todos os direitos reservados | { `v${packageJson.version}` }
      </div>
    </footer>
  )
}
