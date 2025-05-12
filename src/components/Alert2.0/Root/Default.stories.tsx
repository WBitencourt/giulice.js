import { Meta, StoryObj } from "@storybook/react";
import { Alert } from "@/components/Alert2.0";
import { AlertRootProps } from "@/components/Alert2.0/Root";
import * as Icon from '@phosphor-icons/react';

export default {
  title: "Components/Alert/Root/Default",
  component: Alert.Root.Default,
  args: {
    className: "",
    visible: true,
    severity: "success",
  },
  argTypes: {
    severity: {
      options: ["default", "success", "error", "info", "warning"],
      control: { type: 'radio' },
    },
  },
  decorators: [
    (Story) => {
      return Story();
    },
  ],
} as Meta<AlertRootProps>;

export const Default: StoryObj<AlertRootProps> = (
  args: AlertRootProps,
) => {
  return (
    <Alert.Root.Default {...args}>
      <Alert.Message>
        {`Hi, I'm an alert!`}
      </Alert.Message>
      <Alert.Button.Close />
    </Alert.Root.Default>
  );
};

Default.args = {};
