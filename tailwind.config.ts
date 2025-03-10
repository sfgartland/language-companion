/** @type {import('tailwindcss').Config} */
// const { nextui } = require("@nextui-org/react");
import { nextui } from "@nextui-org/react";
import typography from "@tailwindcss/typography"
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [nextui(), typography],
};
