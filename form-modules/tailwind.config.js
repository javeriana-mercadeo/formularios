/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,html,css,scss}", "./examples/**/*.{html,js}"],
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      colors: {
        primary: "#4d7fcb",
        secondary: "#6c757d",
        tertiary: "#343a40",
        neutral: "#f8f9fa",
        success: "#28a745",
        warning: "#ffc107",
        danger: "#dc3545",
        info: "#17a2b8",
      },
      fontFamily: {
        segoe: ['"Segoe UI"', "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      spacing: {
        xs: "0.25rem",
        sm: "0.5rem",
        md: "1rem",
        lg: "1.5rem",
        xl: "2rem",
        "2xl": "3rem",
        "3xl": "4rem",
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
      },
      borderRadius: {
        xs: "0.125rem",
        sm: "0.25rem",
        md: "0.5rem",
        lg: "0.75rem",
        xl: "1rem",
        "2xl": "1.25rem",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"), // ✅ plugin de formularios
  ],
};
