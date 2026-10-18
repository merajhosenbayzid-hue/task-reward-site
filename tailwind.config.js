/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Hind Siliguri'", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        night: "#070716",
        panel: "#101024",
        card: "#141432",
        mist: "#A8AACC",
        faint: "#6E7099",
        peach: "#FFB199",
        rose: "#FF6B9D",
        grape: "#A855F7",
        aqua: "#2DD4BF",
        sun: "#FFCC00",
        ink: "#FFFFFF",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};
