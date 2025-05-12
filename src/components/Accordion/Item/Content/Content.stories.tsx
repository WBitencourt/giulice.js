import { Meta, StoryObj } from "@storybook/react";
import { AccordionContentItemProps } from "./Content";
import Accordion from "../../index";

const args: AccordionContentItemProps = {
  expanded: true,
  children: (
    <div className="flex flex-col gap-4">
      <p>Some content here</p>
      <p>Some content here</p>
      <p>Some content here</p>
    </div>
  ),
};

export default {
  title: "Components/Accordion/Item/Content",
  component: Accordion.Item.Content,
  args,
  decorators: [
    (Story) => {
      return Story();
    },
  ],
} as Meta<AccordionContentItemProps>;

export const Content: StoryObj<AccordionContentItemProps> = (
  args: AccordionContentItemProps,
) => {
  return (
    <Accordion.Item.Content {...args}>
      { args?.children }
    </Accordion.Item.Content>
  );
};

Content.args = { ...args };
