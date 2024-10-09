import type { Config } from 'tailwindcss';

const config: Omit<Config, "content" | "presets"> = {
  darkMode: "selector",
  theme: {
    colors: {
      primary: "#ffffff",
      "on-primary": "#000000",
      "primary-container": "#494949",
      "on-primary-container": "#ffffff",
      secondary: "#ffffff",
      "on-secondary": "#000000",
      "secondary-container": "#ffffff",
      "on-secondary-container": "#000000",
      tertiary: "#ffffff",
      "on-tertiary": "#000000",
      "tertiary-container": "#ffffff",
      "on-tertiary-container": "#000000",
      error: "#ff0000",
      "on-error": "#ffffff",
      "error-container": "#ff0000",
      "on-error-container": "#ffffff",
      surface: "#ffffff",
      "on-surface": "#000000",
    },
  },
};

export default config;
