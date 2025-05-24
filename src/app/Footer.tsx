import packageJson from '../../package.json';

export const Footer = () => {
  return (
    <footer className="row-start-3 p-1 flex flex-wrap items-center justify-center dark:bg-zinc-900 bg-zinc-100">
      <p className="text-center text-xs sm:text-sm/6 text-black dark:text-white ">
        Copyright © {new Date().getFullYear()}. Todos os direitos reservados. v{packageJson.version}
      </p>
    </footer>
  )
}