import { Meta, StoryObj } from "@storybook/react";
import * as Icon from '@phosphor-icons/react';
import { Alert } from "@/components/Alert2.0";
import { AlertMessageProps } from "@/components/Alert2.0/Message";

export default {
  title: "Components/Alert/Message",
  component: Alert.Message,
  args: {
    className: "text-black dark:text-white",
    visible: true,
  },
  decorators: [
    (Story) => {
      return Story();
    },
  ],
} as Meta<AlertMessageProps>;

export const Message: StoryObj<AlertMessageProps> = (
  args: AlertMessageProps,
) => {
  return (
    <Alert.Message {...args}>
      <Icon.CheckCircle weight="fill" />
      {`Hi, I'm an alert message!`}
    </Alert.Message>
  );
};

Message.args = {};
