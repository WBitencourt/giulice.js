import { AutocompleteSingleProviderRootRef } from './root';
import { AutocompleteSingleInput } from './input';
import { PickList } from './picklist';

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