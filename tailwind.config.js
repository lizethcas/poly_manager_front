/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      colors: {
        "title-color": "#00000b",
        "fresh-green": "#78CBB6",
        "light-gray": "#BEBBBB ",
        "deep-teal": "#0A394D",
        "light-grayish-blue": "#E1E8EF",
        white: "#ffffff",
      },
      fontSize: {
        m: "1.29rem",
        xl: "2rem",
      },
      fontWeight: {
        thin: "100",
        hairline: "100",
        extralight: "200",
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
        extrabold: "800",
        "extra-bold": "800",
        black: "900",
      },
    },
    width: {
      139: "9rem",
    },
  },
  plugins: [],
  safelist: [
    "min-w-[1000px]", // Agrega esta línea
  ],
};
