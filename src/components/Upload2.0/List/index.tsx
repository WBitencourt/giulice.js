import * as Icon from "@phosphor-icons/react";
import { twMerge } from "tailwind-merge";
import { useContext } from "@/components/Upload2.0/contexts";

interface ListRootProps {
  className?: string;
  children: React.ReactNode;
}

interface ToggleOpenProps {
  show?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: (open: boolean) => void;
}

export const ToggleOpen = ({ show = false, className, children, onClick, ...props }: ToggleOpenProps) => {
  const { list } = useContext();

  //const [isOpenList, setIsOpenList] = useState(show);

  const handleToggle = () => {
    onClick?.(!show);
  }

  return (
    <>
      {
        show ?
        <div 
          className="flex flex-start gap-2 cursor-pointer" 
          onClick={handleToggle}
        > 
          <Icon.CaretDown 
            className="text-cyan-500" 
            weight='bold' 
          />
          <span className="text-xs font-sans">
           Fechar lista contendo {list.length} arquivo{list.length === 0 ? 's' : ''}
          </span>
        </div>
        :
        <div 
          className="flex flex-start gap-2 cursor-pointer" 
          onClick={handleToggle}
          
        > 
          <Icon.CaretRight
            className="text-cyan-500" 
            weight='bold' 
          />
          <span className="text-xs font-sans mb-2">
            Abrir lista contendo {list.length} arquivo{list.length === 0 ? 's' : ''}
          </span>
        </div>
      }
      <div 
        data-open={show}
        className={twMerge("flex gap-2 w-full overflow-y-hidden data-[open=false]:sr-only", className)}>
        { show && children }
      </div>
    </>
  );
}

export const Root = ({ className, children }: ListRootProps) => {
  if(!children) {
    return null;
  }

  return (
    <div className={twMerge("flex flex-col overflow-y-auto w-full gap-2", className)}>
      { children }
    </div>
  )
}

export const List = {
  Root,
  ToggleOpen,
}