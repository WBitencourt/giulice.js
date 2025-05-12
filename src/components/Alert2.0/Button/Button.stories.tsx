import { Meta, StoryObj } from "@storybook/react";
import { Alert } from "@/components/Alert2.0";
import { CloseButtonProps } from "@/components/Alert2.0/Button";

export default {
  title: "Components/Alert/Button",
  component: Alert.Button.Close,
  args: {
    className: "text-black dark:text-white",
    visible: true,
  },
  decorators: [
    (Story) => {
      return Story();
    },
  ],
} as Meta<CloseButtonProps>;

export const Button: StoryObj<CloseButtonProps> = (
  args: CloseButtonProps,
) => {
  return (
    <Alert.Button.Close {...args} />
  );
};

Button.args = {};
