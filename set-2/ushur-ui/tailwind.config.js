const colors = require("tailwindcss/colors");

module.exports = {
  purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  mode: "jit",
  darkMode: false, // or 'media' or 'class']
  theme: {
    extend: {
      display: ["group-hover"],
      fontFamily: {
        'open': ['Open Sans'],
        'fa6pro':['"Font Awesome 6 Pro"'],
        'proxima-light': ['Proxima Nova Light'],
        'proxima-bold': ['Proxima Nova Bold'],
        'proxima': ['Proxima Nova']
      },
      colors: {
        "light-gray": "#A7A8A9",
        "very-dark-gray":"#212121",
        "primary-gray": "#CCCCCC",
        "very-light-blue":"#EBECF4",
        "slate-blue":"#595C98",
        "dark-blue": "#3d3f65",
        "red":"#CF4022",
        "light-black": "#41454D",
        "slate-gray": "#6C757D",
        "blue": "#2F80ED",
        primary: {
          1: "var(--primary-1)",
        },
        secondary: {
          1: "var(--secondary-1)",
          2: "var(--secondary-2)",
          3: "var(--secondary-3)",
          4: "var(--secondary-4)",
        },
        white: colors.white,
        black: colors.black,
      },
      width:{
        "65":"65%",
        "94":"94%",
      },
      height:{
        "70":"70%",
        "80":"80%",
        "97":"97%"
      },
      spacing: {
        "space-2": "var(--space-2)",
        "space-4": "var(--space-4)",
        "space-8": "var(--space-8)",
        "space-12": "var(--space-12)",
        "space-16": "var(--space-16)",
        "space-24": "var(--space-24)",
        "space-32": "var(--space-32)",
        "space-40": "var(--space-40)",
        "space-48": "var(--space-48)",
        "space-64": "var(--space-64)",
        "space-80": "var(--space-80)",
      },
      fontSize: {
        "size-10": "var(--size-10)",
        "size-12": "var(--size-12)",
      },
      border: {
        "l": "2px",
        colors: {
          "blue": "#2F80ED",
        },
        style: {
          "dotted": "dotted"
        }
      },
      float: {
        "right": "right"
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
