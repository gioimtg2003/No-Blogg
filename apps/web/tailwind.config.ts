import type { Config } from "tailwindcss";
import sharedConfig from "@no-blogg/ui/tailwind.config";

const config: Pick<Config, "content" | "presets"> = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}",
    "../../libs/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [sharedConfig],
};

export default config;
