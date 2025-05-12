import { Meta, StoryObj } from "@storybook/react";
import { SummaryArrowProps } from "@/components/Accordion/Item/Summary/Arrow";

import Accordion from "../../index";

const args: SummaryArrowProps = {
  expanded: true,
  className: '',
};

const meta = {
  title: "Components/Accordion/Item/Summary",
  component: Accordion.Item.Summary.Arrow,
  args,
  decorators: [
    (Story) => {
      return Story();
    },
  ],
} as Meta<SummaryArrowProps>;

export default meta;

export const Arrow: StoryObj<SummaryArrowProps> = (
  args: SummaryArrowProps,
) => {
  return (
    <Accordion.Item.Summary.Arrow {...args} />
  );
};

Arrow.args = { ...args };
