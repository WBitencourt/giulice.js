import { Meta, StoryObj } from "@storybook/react";
import { SummaryRootProps } from "@/components/accordion/item/summary/root";
import { Title } from './title.stories';
import { Subtitle } from './subtitle.stories';
import Accordion from "../../index";
import { Arrow } from './arrow.stories';

const args: SummaryRootProps = {
  className: "text-green-500 dark:text-red-400",
  children: (
    <>
      <Accordion.Item.Summary.Title {...Title.args}>
        {Title.args?.children}
      </Accordion.Item.Summary.Title>
      <Accordion.Item.Summary.Subtitle {...Subtitle.args}>
        {Subtitle.args?.children}
      </Accordion.Item.Summary.Subtitle>
      <Accordion.Item.Summary.Arrow { ...Arrow.args } />
    </>
  ),
};

export default {
  title: "Components/Accordion/item/Summary",
  component: Accordion.Item.Summary.Root,
  args,
  decorators: [
    (Story) => {
      return Story();
    },
  ],
} as Meta<SummaryRootProps>;

export const Root: StoryObj<SummaryRootProps> = (args: SummaryRootProps) => {
  return (
    <Accordion.Item.Summary.Root { ...args }>
      { args?.children }
    </Accordion.Item.Summary.Root>
  );
};

Root.args = { ...args };
