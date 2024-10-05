export const Button = {
  Y: 1, // 1 << 0
  B: 2, // 1 << 1
  A: 4, // 1 << 2
  X: 8, // 1 << 3
  L: 16, // 1 << 4
  R: 32, // 1 << 5
  ZL: 64, // 1 << 6
  ZR: 128, // 1 << 7
  Minus: 256, // 1 << 8
  Plus: 512, // 1 << 9
  LStick: 1024, // 1 << 10
  RStick: 2048, // 1 << 11
  Home: 4096, // 1 << 12
  Capture: 8192, // 1 << 13
} as const;
export type Button = (typeof Button)[keyof typeof Button];
