import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          500: "#F97316",
          600: "#EA6C0A",
        },
        crm: {
          header: "#1e3a5f",
          sidebar: "#162d4a",
          bg: "#f5f7fa",
          green: "#00b050",
          blue: "#29ABE2",
          cyan: "#00BCD4",
          teal: "#00897B",
          amber: "#FF9800",
          lime: "#4CAF50",
        },
      },
    },
  },
  plugins: [],
};
export default config;
