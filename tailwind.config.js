/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      textColor: {
        light: "#f6f6f6",
        red: '#ff0000',
        white: '#fff',
        green: "#00cc00",
        gray: {
          800: "#2f2f2f",
          900: "#1a1a1a",
        },
      },
      borderColor: {
        gray: {
          400: "#6b6b6b",
        },
      },
      backgroundColor:{
        yellow: "#f6e05e",
        white: '#fff',
        black: '#000',
        gray: '#2f2f2f',
        red: '#ff0000',
        green: "#00cc00"
      }
    },
  },
  plugins: [],
  darkMode: "selector",
};
