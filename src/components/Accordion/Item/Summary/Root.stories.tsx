import { Meta, StoryObj } from "@storybook/react";
import { SummaryRootProps } from "@/components/Accordion/Item/Summary/Root";
import { Title } from "./Title.stories";
import { Subtitle } from "./Subtitle.stories";
import Accordion from "../../index";
import { Arrow } from "./Arrow.stories";

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
  title: "Components/Accordion/Item/Summary",
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
