import colors from 'tailwindcss/colors'

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary accent color - change this to swap the entire theme
        // Options: emerald, indigo, violet, cyan, amber, rose, etc.
        primary: colors.emerald,

        // Surface colors for backgrounds and cards
        surface: {
          DEFAULT: colors.gray[800],
          dark: colors.gray[900],
          light: colors.gray[700],
        },

        // Border colors
        border: {
          DEFAULT: colors.gray[700],
          light: colors.gray[600],
        },

        // Text colors
        text: {
          DEFAULT: colors.white,
          muted: colors.gray[400],
          subtle: colors.gray[500],
        },
      },
    },
  },
  plugins: [],
}
