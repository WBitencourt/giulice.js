import { cn } from "@/utils/ClassName";
import useContext, { PickListItem } from "../contexts";

export interface PickListBag {
  list: PickListItem[];
}

export interface PickListBagProps {
  children: (bag: PickListBag) => JSX.Element;
}

export interface PickListRootProps {
  children: React.ReactNode | React.ReactNode[];
}

export interface PickListUlProps {
  children: React.ReactNode;
}

export interface PickListItemProps {
  index: number;
  item: PickListItem;
  onClick?: (item: PickListItem) => void;
}

export interface PickListEmptyFilteredProps {
  className?: string;
  children?: string;
}

export const PickListBackup = () => {
  const {
    showPickList,
    filteredPickList,
    activeItemIndex,
    onClickItemList
  } = useContext();

  if (!showPickList) {
    return null;
  }

  if(filteredPickList.length) {
    return (
      <ul className="absolute border text-black border-zinc-400 bg-white dark:text-white dark:border-zinc-700 dark:bg-zinc-950 w-full mt-2 rounded-md shadow-lg z-10">
        {
          filteredPickList.map((item, index) => {
            return (
              <li
                key={item.value}
                data-selected={index === activeItemIndex}
                className='cursor-pointer rounded-md p-2 data-[selected=true]:bg-zinc-200 dark:data-[selected=true]:bg-zinc-900'
                onClick={() => onClickItemList(item)}
              >
                { item.label }
              </li>
            );
          })
        }
      </ul>
    )
  }

  return (
    <div className="absolute border text-black border-orange-400 bg-white dark:text-white dark:border-orange-700 dark:bg-zinc-950 w-full mt-1 p-2 rounded-md shadow-lg z-10">
      <em>Nenhuma opção encontrada</em>
    </div>
  )
};

export const PickListBag = ({ children }: PickListBagProps) => {
  const {
    filteredPickList,
  } = useContext();

  const picklistBag = {
    list: filteredPickList,
  }

  return children(picklistBag)
};

export const PickListRoot = ({ children }: PickListRootProps) => {
  return (
    <>
      { children }
    </>
  )
};

export const PickListUl = ({ children }: PickListUlProps) => {
  const { showPickList, filteredPickList } = useContext();

  if (!showPickList) {
    return null;
  }

  if(filteredPickList.length === 0) {
    return null
  }

  return (
    <ul className="absolute border text-black border-zinc-400 bg-white dark:text-white dark:border-zinc-700 dark:bg-zinc-950 w-full mt-2 rounded-md shadow-lg z-50">
      { children }
    </ul>
  )
};

export const PickListLi = ({ index, item, onClick }: PickListItemProps) => {
  const { activeItemIndex, onClickItemList } = useContext();

  const handleClick = () => {
    console.log('PickListLi handleClick', item);
    onClickItemList(item);

    if(onClick) {
      onClick(item)
    }
  }

  return (
    <li
      data-selected={index === activeItemIndex}
      className='cursor-pointer text-sm rounded-md p-2 data-[selected=true]:bg-zinc-200 dark:data-[selected=true]:bg-zinc-900'
      onClick={handleClick}
    >
      { item.label }
    </li>
  );
};

export const PickListEmptyFiltered = ({ className, children }: PickListEmptyFilteredProps) => {
  const { showPickList, filteredPickList } = useContext();

  if (!showPickList) {
    return null;
  }

  if(filteredPickList.length > 0) {
    return null
  }

  return (
    <div className={cn("absolute border text-sm text-black border-cyan-400 bg-white dark:text-white dark:border-cyan-700 dark:bg-zinc-950 w-full mt-1 p-2 rounded-md shadow-lg z-10", className)}>
      <em className='text-sm'>{children ? children : 'Nenhuma opção encontrada'}</em>
    </div>
  )
};

export const PickList = {
  Bag: PickListBag,
  Root: PickListRoot,
  Container: PickListUl,
  Item: PickListLi,
  EmptyFiltered: PickListEmptyFiltered,
}