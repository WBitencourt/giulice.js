import { Meta, StoryObj } from "@storybook/react";
import { SummaryTitleProps } from "@/components/Accordion/Item/Summary/Title";
import Accordion from "../../index";

const args = {
  children: "Title",
  className: 'text-black dark:text-white',
};

const meta = {
  title: "Components/Accordion/Item/Summary",
  component: Accordion.Item.Summary.Title,
  args,
  decorators: [
    (Story) => {
      return Story();
    },
  ],
} as Meta<SummaryTitleProps>;

export default meta;

export const Title: StoryObj<SummaryTitleProps> = (args: SummaryTitleProps) => {
  return (
    <Accordion.Item.Summary.Title {...args}>
      {args?.children}
    </Accordion.Item.Summary.Title>
  );
};

Title.args = { ...args };
