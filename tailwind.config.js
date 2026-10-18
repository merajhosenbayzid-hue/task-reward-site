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
        cream: "#FFF4D6",
        creamdeep: "#FBEEC2",
        ink: "#2B2D42",
        inksoft: "#5B5D78",
        coral: "#F2603C",
        coraldeep: "#D94E2C",
        sun: "#FFCC00",
        lav: "#C9C5F5",
        peach: "#FBE3DE",
        peri: "#DDE4F7",
        navy: "#33334E",
        navydeep: "#26263A",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};
