import Link from "next/link";

export interface TabItemProps {
  href: string;
  children: React.ReactNode;
  selected?: boolean;
}

export const TabItem = ({ href, selected = false, children }: TabItemProps) => {  
  return (
    <li 
      data-state={selected}
      className="flex items-center px-6 min-w-12 text-sm cursor-pointer h-full data-[state=true]:border-b-1 border-b-cyan-500 text-zinc-500 dark:text-zinc-400"
    >
      <Link className="flex items-center w-full h-full" href={href}>
        { children }
      </Link>
    </li>
  )
}