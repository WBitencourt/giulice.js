import { Meta, StoryObj } from "@storybook/react";
import * as Icon from '@phosphor-icons/react';

import { Alert } from "@/components/Alert2.0";
import { AlertTypeProps } from "@/components/Alert2.0/Root";

export default {
  title: "Components/Alert/Root/Error",
  component: Alert.Root.Error,
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

export const Error: StoryObj<AlertTypeProps> = (
  args: AlertTypeProps,
) => {
  return (
    <Alert.Root.Error {...args}>
      <Alert.Message>
        {`Hi, I'm an alert!`}
      </Alert.Message>
      <Alert.Button.Close />
    </Alert.Root.Error>
  );
};

Error.args = {};
