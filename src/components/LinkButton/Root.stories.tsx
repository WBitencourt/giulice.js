import { Meta, StoryObj } from "@storybook/react";
import { LinkButton, LinkButtonProps } from "./index";

import Label from "./Label.stories";
import Icon from "./Icon.stories";

//<Icon.CircleNotch className="animate-spin text-black dark:text-white text-2xl" weight='bold' />

export default {
  title: "Components/LinkButton",
  component: LinkButton.Root,
  decorators: [
    (Story) => {
      return Story();
    },
  ],
} as Meta<LinkButtonProps>;

export const Root: StoryObj<LinkButtonProps> = (args: LinkButtonProps) => {
  //console.log('args: ', args)
  return (
    <LinkButton.Root {...args}>
      <LinkButton.Icon.User {...Icon.args} />
      <LinkButton.Label {...Label.args} />
    </LinkButton.Root>
  );
};

Root.args = {
  className:
    "flex gap-2 items-center cursor-pointer text-blue-500 text-blue-500/80",
  classNameDisabled: "flex gap-2 items-center text-blue-900",
};
