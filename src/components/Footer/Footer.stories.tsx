import { Meta, StoryObj } from "@storybook/react";
import { Footer } from "./index";

export default {
  title: "Components/Footer",
  component: Footer,
  decorators: [
    (Story) => {
      return Story();
    },
  ],
} as Meta;

export const Default: StoryObj = {};
