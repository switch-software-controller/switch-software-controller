import type { Meta, StoryObj } from "@storybook/react";

import { SerialPortList } from "./SerialPortList.tsx";

const meta: Meta<typeof SerialPortList> = {
  component: SerialPortList,
};
export default meta;

type Story = StoryObj<typeof SerialPortList>;

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
