import type { Meta, StoryObj } from "@storybook/react";

import { SerialPortOption } from "./SerialPortOption.tsx";

const meta: Meta<typeof SerialPortOption> = {
  component: SerialPortOption,
};
export default meta;

type Story = StoryObj<typeof SerialPortOption>;

export const Basic: Story = {
  args: {
    port: {
      id: "1",
      name: "COM1",
      path: "/dev/ttyS0",
    },
    onClick: () => {},
  },
};
