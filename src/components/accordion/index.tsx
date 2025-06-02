import { Root } from './root';
import { ItemRoot } from './item/root';
import { SummaryRoot } from './item/summary/root';
import { SummaryTitle } from './item/summary/title';
import { SummarySubTitle } from './item/summary/subtitle';
import { ContentItem } from './item/content/content';
import { SummaryArrowIcon } from './item/summary/arrow';

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