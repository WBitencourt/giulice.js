import { Root } from './Root';
import { ItemRoot } from './Item/Root';
import { SummaryRoot } from './Item/Summary/Root';
import { SummaryTitle } from './Item/Summary/Title';
import { SummarySubTitle } from './Item/Summary/Subtitle';
import { ContentItem } from './Item/Content/Content';
import { SummaryArrowIcon } from './Item/Summary/Arrow';

const Accordion = {
  Root: Root,
  Item: {
    Root: ItemRoot,
    Summary: {
      Root: SummaryRoot,
      Title: SummaryTitle,
      Subtitle: SummarySubTitle,
      Arrow: SummaryArrowIcon,
    },
    Content: ContentItem,
  },
};

export default Accordion;