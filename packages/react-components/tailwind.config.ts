import { Config } from "tailwindcss";
import sharedConfig from "@switch-software-controller/tailwind-config";

const config: Pick<Config, "presets" | "content"> = {
  content: [
    "./src/**/*.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [sharedConfig],
};

export default config;
