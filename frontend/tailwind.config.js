/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        raleway: ["Raleway", "sans-serif"],
        pridi: ["Pridi", "serif"],
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        aduin: {
          blue: "#3e8bf3",
          navy: "#021d54",
          red: "#f00d0d",
          green: "#1a8c3c",
          orange: "#eb7600",
          bg: "#f7f9fc",
          sidebar: "#0B1120",
        },
      },
    },
  },
  plugins: [],
};
