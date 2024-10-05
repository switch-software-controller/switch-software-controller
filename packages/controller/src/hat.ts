export const Hat = {
  Top: 0,
  TopRight: 1,
  Right: 2,
  BottomRight: 3,
  Bottom: 4,
  BottomLeft: 5,
  Left: 6,
  TopLeft: 7,
  Center: 8,
} as const;
export type Hat = (typeof Hat)[keyof typeof Hat];
