import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        press: ['"Press Start 2P"', 'system-ui'],
      },
      boxShadow: {
        up: "0 -4px 6px -1px rgba(0, 0, 0, 0.1)",
      },
    },
  },
};

export default config;

