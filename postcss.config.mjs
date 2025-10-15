/** @type {import('tailwindcss').Config} */

const config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: ["class"],
  safelist: ["dark"],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
  },
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
