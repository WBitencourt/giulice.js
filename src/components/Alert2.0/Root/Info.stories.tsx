import { Meta, StoryObj } from "@storybook/react";
import * as Icon from '@phosphor-icons/react';

import { Alert } from "@/components/Alert2.0";
import { AlertTypeProps } from "@/components/Alert2.0/Root";

export default {
  title: "Components/Alert/Root/Info",
  component: Alert.Root.Info,
  args: {
    className: "",
    visible: true,
  },
  decorators: [
    (Story) => {
      return Story();
    },
  ],
} as Meta<AlertTypeProps>;

export const Info: StoryObj<AlertTypeProps> = (
  args: AlertTypeProps,
) => {
  return (
    <Alert.Root.Info {...args}>
      <Alert.Message>
        {`Hi, I'm an alert!`}
      </Alert.Message>
      <Alert.Button.Close />
    </Alert.Root.Info>
  );
};

Info.args = {};
