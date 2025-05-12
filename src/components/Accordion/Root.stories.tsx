import { Meta, StoryObj } from "@storybook/react";
import { AccordionRootProps } from "./Root";
import Accordion from "./index";
import { Root as RootItem } from "./Item/Root.stories";
import { AccordionItemRootProps } from "./Item/Root";
import * as Icon from '@phosphor-icons/react';
import { useState } from "react";

export default {
  title: "Components/Accordion",
  component: Accordion.Root,
  args: {
    className: "bg-zinc-200 dark:bg-zinc-700 p-2 rounded",
  },
  decorators: [
    (Story, props) => {
      return Story(props);
    },
  ],
} as Meta<AccordionRootProps>;

const ItemRoot = () => {
  const [expanded, setExpanded] = useState<boolean | undefined>(false);

  const handleOnChange = () => {
    setExpanded((prevState => !prevState));
  };

  return (
    <>
      <Accordion.Item.Root>
        <Accordion.Item.Summary.Root onClick={handleOnChange}>
          <Accordion.Item.Summary.Title className="flex items-center gap-2">
            <span>Title</span>
            <Icon.CreditCard weight="fill" />
          </Accordion.Item.Summary.Title>
          <Accordion.Item.Summary.Subtitle>
            Subtitle
          </Accordion.Item.Summary.Subtitle>
          <Accordion.Item.Summary.Arrow expanded={expanded} />
        </Accordion.Item.Summary.Root>
        <Accordion.Item.Content expanded={expanded}>
          <span>Some content here</span>

          <span>Some content here</span>

          <span>Some content here</span>
        </Accordion.Item.Content>
      </Accordion.Item.Root>
    </>
  );
};

export const Root: StoryObj<AccordionRootProps> = (
  args: AccordionRootProps,
) => {
  return (
    <Accordion.Root { ...args }>
      <ItemRoot />

      <ItemRoot />

      <ItemRoot />
    </Accordion.Root>
  );
};

Root.args = { };
