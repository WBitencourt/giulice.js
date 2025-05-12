import { AutocompleteSingleProviderRootRef } from './Root';
import { AutocompleteSingleInput } from './Input';
import { PickList } from './Picklist';

export const AutocompleteSingle = {
  Root: AutocompleteSingleProviderRootRef,
  Input: AutocompleteSingleInput,
  PickList: {
    Bag: PickList.Bag,
    Root: PickList.Root,
    Container: PickList.Container,
    Item: PickList.Item,
    Empty: PickList.EmptyFiltered,
  }
}