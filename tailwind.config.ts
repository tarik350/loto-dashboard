import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ef4444",
        secondary: "#00aafd",
        transparentBg: "#F7F6FB",
        textColor: "#222262",
        yellow: "#feaa11",
        green: "#00f19c",
        purple: "#9a0ae4",
        lavender: "#E39FF6",
        softLavender: "#EEE9FB",
        strongPurple: "#8A2BE2", // Strong Purple
        darkPurple: "#4B0082",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    // require("@tailwindcss/forms"),
    // require("@tailwindcss/typography"),
    // require("@tailwindcss/aspect-ratio"),
  ],
};
export default config;
