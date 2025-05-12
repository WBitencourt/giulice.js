import { Meta, StoryObj } from "@storybook/react";
import { Breadcrumbs, BreadcrumbsLinkProps } from "./index";

import * as Icon from "@phosphor-icons/react";
import React from "react";

export default {
  name: "Link",
  title: "Components/Breadcrumbs",
  component: Breadcrumbs.Link,
  decorators: [
    (Story) => {
      return Story();
    },
  ],
} as Meta<BreadcrumbsLinkProps>;

export const Link: StoryObj<BreadcrumbsLinkProps> = (
  args: BreadcrumbsLinkProps,
) => {
  return (
    <Breadcrumbs.Link
      {...args}
      icon={<Icon.House className="text-cyan-500 mr-1 text-xl" weight="fill" />}
    />
  );
};

Link.args = {
  label: "Link ",
  navigateTo: "/navigateToLink",
};
