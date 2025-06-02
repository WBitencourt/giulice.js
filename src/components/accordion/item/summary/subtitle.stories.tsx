import { Meta, StoryObj } from "@storybook/react";
import { SummarySubTitleProps } from "@/components/accordion/item/summary/subtitle";

import Accordion from "../../index";

const args: SummarySubTitleProps = {
  children: "Subtitle",
  className: 'text-black dark:text-white',
};

const meta = {
  title: "Components/Accordion/item/Summary",
  component: Accordion.Item.Summary.Subtitle,
  args,
  decorators: [
    (Story) => {
      return Story();
    },
  ],
} as Meta<SummarySubTitleProps>;

export default meta;

export const Subtitle: StoryObj<SummarySubTitleProps> = (
  args: SummarySubTitleProps,
) => {
  return (
    <Accordion.Item.Summary.Subtitle {...args}>
      {args?.children}
    </Accordion.Item.Summary.Subtitle>
  );
};

Subtitle.args = { ...args };
