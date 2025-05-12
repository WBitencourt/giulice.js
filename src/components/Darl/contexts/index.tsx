import { createContext, useContext as useContextPrimitive, useEffect, useState } from 'react';

export interface SetFieldValueInsertAreaProps {
  fieldID: string;
  value: any;
}

export interface SetFieldValueListProps {
  rowID: string;
  fieldID: string;
  value: any;
}

export interface Item<T> {
  rowID: string;
  fields: T;
}

export interface DarlBag<T> {
  insertArea: InsertAreaBag<T>;
  listArea: ListBag<T>;
  global: GlobalBag;
}

export interface OnChangeProviderProps<T> {
  event: 'add' | 'remove' | 'edit';
  newList: Item<T>[];
  value: Item<T>;
}

export interface ProviderRootProps<T> {
  initialValuesInsertArea: T;
  initialList: Item<T>[];
  onChange?: (props: OnChangeProviderProps<T>) => void;
  children: (props: DarlBag<T>) => JSX.Element;
}

export interface HandleChangeInsertAreaProps {
  event: React.ChangeEvent<HTMLInputElement>;
  value: any;
}

export interface AddListProps {
  rowID: string;
}

export interface RemoveListProps {
  rowID: string;
}

export interface EditValuesListProps {
  rowID: string;
  newRowID?: string;
}

export interface ResetValuesListProps {
  rowID: string;
}

export interface InsertAreaBag<T> {
  values: T;
  setFieldValue: (props: SetFieldValueInsertAreaProps) => void;
  resetValues: () => void;
  addList: (props: AddListProps) => void;
}

export interface ListBag<T> {
  values: Item<T>[];
  setFieldValue: (props: SetFieldValueListProps) => void;
  resetValues: (props: ResetValuesListProps) => void;
  editValues: (props: EditValuesListProps) => void;
  removeList: (props: RemoveListProps) => void;
}

export interface GlobalBag {
  copyClipBoard: (value: string) => void;
}

export interface ContextProps<T> {
  valuesInsertArea: T;
  valuesList: Item<T>[];
  setFieldValueList: (props: SetFieldValueListProps) => void;
  setFieldValueInsertArea: (props: SetFieldValueInsertAreaProps) => void;
  resetValuesInsertArea: () => void;
  resetValuesList: (props: ResetValuesListProps) => void;
  editValuesList: (props: EditValuesListProps) => void;
  copyClipBoard: (value: string) => void;
  addList: (props: AddListProps) => void;
  removeList: (props: RemoveListProps) => void;
  handleChangeInsertArea: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Context = createContext<ContextProps<any>>({} as ContextProps<any>);

export const Provider = <T,>({ 
  initialValuesInsertArea, 
  initialList,
  onChange,
  children 
}: ProviderRootProps<T>) => {
  const [valuesInsertArea, setValuesInsertArea] = useState<T>({} as T);
  const [valuesList, setValuesList] = useState<Item<T>[]>([] as Item<T>[]);

  const [initialListState, setInitialListState] = useState<Item<T>[]>([]);

  const setFieldValueInsertArea = ({ fieldID, value }: SetFieldValueInsertAreaProps) => {
    setValuesInsertArea((prevState) => {
      return {
        ...prevState,
        [fieldID]: value
      }
    })
  }

  const setFieldValueList = ({ rowID, fieldID, value }: SetFieldValueListProps) => {
    setValuesList((prevState) => {
      return prevState.map((item) => {
        if (item.rowID === rowID) {
          return {
            ...item,
            fields: {
              ...item.fields,
              [fieldID]: value
            }
          }
        }
        return item;
      })
    })
  }

  const resetValuesInsertArea = () => {
    setValuesInsertArea(initialValuesInsertArea);
  }

  const resetValuesList = ({ rowID }: ResetValuesListProps) => {
    setValuesList((prevState) => {
      const originalItem = initialListState.find((item) => item.rowID === rowID);

      return prevState.map((item) => {
        if (item.rowID === rowID) {
          return {
            ...item,
            fields: originalItem?.fields ?? item.fields,
          }
        }
        
        return item;
      })
    });
  }

  const copyClipBoard = async (value: string) => {
    try {
      await navigator.clipboard.writeText(value);
    } catch (err) {

    }
  };

  const addList = ({ rowID }: AddListProps) => {
    setValuesList((prevState) => {
      const newValue: Item<T> = { rowID, fields: valuesInsertArea } 

      const newState = [ ...prevState, newValue ];

      setInitialListState(newState);

      if(onChange) {
        onChange({
          event: 'add',
          newList: newState,
          value: newValue,
        });
      }

      return newState
    })
  }

  const editValuesList = ({ rowID, newRowID }: EditValuesListProps) => {
    setInitialListState((prevState) => {
      const editedValue = valuesList.find((item) => item.rowID === rowID);

      if(!editedValue) {
        return prevState;
      }

      const newState = prevState.map((item) => {
        if (item.rowID === rowID && editedValue) {
          return {
            ...editedValue,
            rowID: newRowID ?? rowID,
          };
        }

        return item;
      })

      if(onChange) {
        onChange({
          event: 'edit',
          newList: newState,
          value: editedValue,
        });
      }

      return newState;
    })
  }

  const removeList = ({ rowID }: RemoveListProps) => {
    setValuesList((prevState) => {
      const newState = prevState.filter((item) => item.rowID !== rowID);
      const removedValue = prevState.find((item) => item.rowID === rowID);

      if(!removedValue) {
        return prevState;
      }

      setInitialListState(newState);

      if(onChange) {
        onChange({
          event: 'remove',
          newList: newState,
          value: removedValue,
        });
      }

      return newState;
    })
  }

  const handleChangeInsertArea = (event: React.ChangeEvent<HTMLInputElement>) => {
    //not implemented
    //event.target.name
    //event.target.value
  }

  useEffect(() => {
    setValuesInsertArea(initialValuesInsertArea);
  }, [initialValuesInsertArea]);

  useEffect(() => {
    setValuesList(initialList);
    setInitialListState(initialList);
  }, [initialList]);

  const darlBag: DarlBag<T> = {
    insertArea: {
      values: valuesInsertArea,
      setFieldValue: setFieldValueInsertArea,
      resetValues: resetValuesInsertArea,
      addList,
    },
    listArea: {
      values: valuesList,
      setFieldValue: setFieldValueList,
      resetValues: resetValuesList,
      editValues: editValuesList,
      removeList,
    },
    global: {
      copyClipBoard,
    }
  }

  return (
    <Context.Provider value={{
      valuesInsertArea,
      valuesList,
      setFieldValueInsertArea,
      setFieldValueList,
      resetValuesInsertArea,
      resetValuesList,
      editValuesList,
      handleChangeInsertArea,
      copyClipBoard,
      addList,
      removeList,
    }}>
      {children(darlBag)}
    </Context.Provider>
  );
};

export default function useContext<T, L>() {
  const context = useContextPrimitive<ContextProps<T>>(Context as any);

  return context;
}
