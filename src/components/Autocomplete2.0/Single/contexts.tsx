import { ComponentProps, createContext, forwardRef, useCallback, useContext as useContextPrimitive, useEffect, useImperativeHandle, useMemo, useState } from 'react';

export type Value = string | number | readonly string[] | undefined;

export interface PickListItem {
  label: string,
  value: string,
  [key: string]: any,
}

export type SelectedOption = PickListItem | undefined;

export interface AutocompleteSingleHandles {
  teste: string;
}

export interface AutocompleteSingleProps extends ComponentProps<'div'> {
  freeSolo?: boolean;
  picklist?: PickListItem[];
  visible?: boolean,
  selectedOption?: PickListItem;
  onOptionChange?: (newOption: SelectedOption) => void;
}

export interface ContextProps {
  showPickList: boolean;
  selectedOption: PickListItem | undefined;
  filteredPickList: PickListItem[];
  activeItemIndex: number;
  onChangeInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocusInput: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlurInput: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDownInput: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onClickItemList: (item: PickListItem) => void;
  onClickCleanInput: () => void;
}

const Context = createContext<ContextProps>({} as ContextProps);

const AutocompleteProvider = ({ 
  freeSolo = true,
  children, 
  picklist = [],
  selectedOption,
  onOptionChange = () => {},
  ...props 
}: AutocompleteSingleProps, ref: React.Ref<AutocompleteSingleHandles>) => {
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [showPickList, setShowPickList] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const filteredPickList = useMemo(() => {
    return picklist.filter((item) =>
      item.label.toLowerCase().includes(inputValue)
    );
  }, [picklist, inputValue]);

  const handleKeyDownInput = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showPickList || filteredPickList.length === 0) return;
  
    switch (event.key) {
      case 'Enter':
        onOptionChange(filteredPickList[activeItemIndex]);
        setShowPickList(false);
        break;
  
      case 'ArrowUp':
        setActiveItemIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : filteredPickList.length - 1 // Volta para o último item ao chegar no topo
        );
        break;
  
      case 'ArrowDown':
        setActiveItemIndex((prevIndex) =>
          prevIndex < filteredPickList.length - 1 ? prevIndex + 1 : 0 // Volta para o primeiro item ao chegar no final
        );
        break;
  
      default:
        break;
    }
  }, [showPickList, filteredPickList, activeItemIndex])

  const handleChangeInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value.toLowerCase();
  
    const filteredPickList = picklist.filter((item) =>
      item.label.toLowerCase().includes(inputValue)
    );
  
    //setFilteredPickList(filteredPickList);
    setShowPickList(true);
  
    if (filteredPickList.length === 0) {
      setActiveItemIndex(0);
    } else if (filteredPickList.every((item) => item.label.toLowerCase() !== inputValue)) {
      setActiveItemIndex(0);
    } else {
      setActiveItemIndex(
        filteredPickList.findIndex((item) => item.label.toLowerCase() === inputValue)
      );
    }

    setInputValue(inputValue);
  
    onOptionChange({
      label: event.target.value,
      value: event.target.value,
    });
  }, [picklist])
  
  const handleClickItemList = useCallback((item: PickListItem) => {
    onOptionChange(item);
    setActiveItemIndex(0);
    setShowPickList(false);
  }, [])

  const handleClickCleanInput = useCallback(() => {
    onOptionChange(undefined);
    setActiveItemIndex(0);
    setShowPickList(false);
  }, [])

  const handleBlurInput = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    try {
      if(freeSolo) {
        return
      }
  
      const isValueInPickList = picklist.some((item) => item.value === selectedOption?.value);
  
      if (isValueInPickList) {
        return 
      }
  
      onOptionChange(undefined);
      setActiveItemIndex(0);
    } catch(error: any) {
      throw error;
    } finally {
      setTimeout(() => {
        setShowPickList(false);
        setInputValue('');
      }, 300);
    }
  }, [freeSolo, picklist, selectedOption ])

  const handleFocusInput = useCallback((event: React.FocusEvent<HTMLInputElement>) => {
    const newActiveItemIndex = picklist.findIndex((item) => item.label === selectedOption?.label);

    setActiveItemIndex(newActiveItemIndex === -1 ? 0 : newActiveItemIndex);
    
    //setFilteredPickList(picklist);
    setShowPickList(true);
  }, [picklist, selectedOption])

  useImperativeHandle(ref, () => ({
    teste: 'teste',
  }), []);

  return (
    <Context.Provider 
      { ...props } 
      value={{
        showPickList,
        selectedOption,
        filteredPickList, 
        activeItemIndex, 
        onChangeInput: handleChangeInput,
        onFocusInput: handleFocusInput,
        onBlurInput: handleBlurInput,
        onKeyDownInput: handleKeyDownInput,
        onClickItemList: handleClickItemList,
        onClickCleanInput: handleClickCleanInput,
      }}
    >
      { children }
    </Context.Provider>
  );
};

export const AutocompleteProviderRef = forwardRef(AutocompleteProvider);

export default function useContext() {
  const context = useContextPrimitive<ContextProps>(Context);

  return context;
}
