import { Meta, StoryObj } from "@storybook/react";
import { Header } from "./index";

export default {
  title: "Components/Header",
  component: Header,
  decorators: [
    (Story) => {
      return Story();
    },
  ],
} as Meta;

export const Default: StoryObj = {};
