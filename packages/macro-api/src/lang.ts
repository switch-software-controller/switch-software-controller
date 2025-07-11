export const Lang = {
  Jp: 'jp',
  En: 'en',
} as const;
export type Lang = (typeof Lang)[keyof typeof Lang];
