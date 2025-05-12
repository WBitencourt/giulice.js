import { Meta, StoryObj } from "@storybook/react";
import { Breadcrumbs, BreadcrumbsNoLinkProps } from "./index";

import * as Icon from "@phosphor-icons/react";
import React from "react";

export default {
  name: "Text",
  title: "Components/Breadcrumbs",
  component: Breadcrumbs.Text,
  decorators: [
    (Story) => {
      return Story();
    },
  ],
} as Meta<BreadcrumbsNoLinkProps>;

export const Text: StoryObj<BreadcrumbsNoLinkProps> = (
  args: BreadcrumbsNoLinkProps,
) => {
  return (
    <Breadcrumbs.Text
      {...args}
      icon={
        <Icon.NewspaperClipping
          className="text-cyan-500 mr-1 text-xl"
          weight="fill"
        />
      }
    />
  );
};

Text.args = {
  label: "Text",
};
