import type { Meta, StoryObj } from "@storybook/react";

import { SerialPortSelect } from "./SerialPortSelector.tsx";

const meta: Meta<typeof SerialPortSelect> = {
  component: SerialPortSelect,
};
export default meta;

type Story = StoryObj<typeof SerialPortSelect>;

export const Basic: Story = {
  args: {
    ports: [
      {
        id: "1",
        name: "COM1",
        path: "/dev/ttyS0",
      },
      {
        id: "2",
        name: "COM2",
        path: "/dev/ttyS1",
      },
      {
        id: "3",
        name: "COM3",
        path: "/dev/ttyS3",
      },
    ],
    onClick: () => {},
  },
};
