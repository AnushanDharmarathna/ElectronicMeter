const { heroui } = require("@heroui/react")

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        KlassmateBlue: '#4564B0',
        BackgroundColor: '#2F8888'
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()]
}