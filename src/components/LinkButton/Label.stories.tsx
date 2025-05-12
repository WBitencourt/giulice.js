import { Meta, StoryObj } from "@storybook/react";
import { LinkButton, LinkButtonProps } from "./index";

//<Icon.CircleNotch className="animate-spin text-black dark:text-white text-2xl" weight='bold' />

export default {
  title: "Components/LinkButton",
  component: LinkButton.Label,
  args: {
    text: "Label",
    //className: 'text-blue-500 text-xl',
  },
  decorators: [
    (Story) => {
      return Story();
    },
  ],
} as Meta<LinkButtonProps>;

export const Label: StoryObj<LinkButtonProps> = {};
