import { Meta, StoryObj } from "@storybook/react";
import { Avatar, AvatarProps } from "./index";

export default {
  title: "Components/Avatar",
  component: Avatar,
  args: {
    src: "",
    text: "João Frango",
    width: 120,
    height: 120,
    className: "text-5xl text-white font-semibold bg-black",
  },
  decorators: [
    (Story) => {
      return Story();
    },
  ],
} as Meta<AvatarProps>;

export const Default: StoryObj<AvatarProps> = {};

export const Image: StoryObj<AvatarProps> = {
  args: {
    src: "https://avatars.githubusercontent.com/u/51727640?v=4",
  },
};
