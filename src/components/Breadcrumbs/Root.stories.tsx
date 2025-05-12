import { Meta, StoryObj } from "@storybook/react";
import { Breadcrumbs, BreadcrumbsRootProps } from "./index";

import * as Icon from "@phosphor-icons/react";
import React from "react";
import { Link } from "./Link.stories";
import { Text } from "./Text.stories";

export default {
  title: "Components/Breadcrumbs",
  component: Breadcrumbs.Root,
  decorators: [
    (Story) => {
      return Story();
    },
  ],
} as Meta<BreadcrumbsRootProps>;

export const Root: StoryObj<BreadcrumbsRootProps> = (
  args: BreadcrumbsRootProps,
) => {
  return (
    <Breadcrumbs.Root {...args}>
      <Breadcrumbs.Link
        {...Link.args}
        navigateTo={Link.args?.navigateTo ?? ""}
        icon={
          <Icon.House className="text-cyan-500 mr-1 text-xl" weight="fill" />
        }
      />
      <Breadcrumbs.Link
        {...Link.args}
        navigateTo={Link.args?.navigateTo ?? ""}
        icon={
          <Icon.Envelope className="text-cyan-500 mr-1 text-xl" weight="fill" />
        }
      />
      <Breadcrumbs.Link
        {...Link.args}
        navigateTo={Link.args?.navigateTo ?? ""}
        icon={
          <Icon.Cloud className="text-cyan-500 mr-1 text-xl" weight="fill" />
        }
      />
      <Breadcrumbs.Text
        {...Text.args}
        icon={
          <Icon.NewspaperClipping
            className="text-cyan-500 mr-1 text-xl"
            weight="fill"
          />
        }
      />
    </Breadcrumbs.Root>
  );
};

Root.args = {};
