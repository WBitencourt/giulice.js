import { Meta, StoryObj } from "@storybook/react";
import { LinkButton, LinkButtonIconProps } from "./index";

import { IconWeight } from "@phosphor-icons/react";

export default {
  title: "Components/LinkButton",
  component: LinkButton.Icon.User,
  args: {
    //className: 'text-blue-500 text-xl',
    weight: "fill",
  },
  argTypes: {
    weight: {
      options: [
        "fill",
        "thin",
        "light",
        "regular",
        "bold",
        "duotone",
      ] as IconWeight[],
      control: { type: "select" },
    },
  },
  decorators: [
    (Story: any) => {
      return Story();
    },
  ],
} as Meta<LinkButtonIconProps>;

export const Icon: StoryObj<LinkButtonIconProps> = {};
