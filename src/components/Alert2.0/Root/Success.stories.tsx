import { Meta, StoryObj } from "@storybook/react";
import * as Icon from '@phosphor-icons/react';
import { Alert } from "@/components/Alert2.0";
import { AlertTypeProps } from "@/components/Alert2.0/Root";

export default {
  title: "Components/Alert/Root/Success",
  component: Alert.Root.Success,
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

export const Success: StoryObj<AlertTypeProps> = (
  args: AlertTypeProps,
) => {
  return (
    <Alert.Root.Success {...args}>
      <Alert.Message>
        {`Hi, I'm an alert!`}
      </Alert.Message>
      <Alert.Button.Close />
    </Alert.Root.Success>
  );
};

Success.args = {};
