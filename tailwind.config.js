/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3272A3",
          light: "#3E8FCC",
          dark: "#2F71A3",
          blue: "#3B82F6",
        },
        text: {
          primary: "#0C0D0F",
          secondary: "#666666",
          disabled: "#9CA3AF",
          white: "#FFFFFF",
          gray: "#999999",
        },
        neutral: {
          background: "#F9FAFB",
          background2: "#F7FAFF",
          "card-bg": "#FFFFFF",
          border: "#E5E7EB",
          divider: "#F3F4F6",
          dark: "#141B34",
        },
        warning: {
          DEFAULT: "#FFA412",
          light: "#F59E0B",
        },
        chip: {
          background: "rgba(62, 143, 204, 0.2)",
        },
        tint: {
          fill: "rgba(0, 122, 255, 0.15)",
        },
        chip_text: "#3272A3",
        success: {
          DEFAULT: "#16A34A",
          light: "#D0EFDB",
        },
        dark: {
          DEFAULT: "#0C0D0F",
          light: "#666666",
        },
        gray: {
          DEFAULT: "#999999",
          light: "#F9FAFB",
          border: "#E5E7EB",
          divider: "#DADADA",
          muted: "#E8E8E8",
        },
        background: {
          DEFAULT: "#FFFFFF",
          light: "#F7F7FA",
          gray: "#F5F5F5",
          muted: "#E6E6E6",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      fontSize: {
        xs: "12px",
        13: "13px",
        sm: "14px",
        base: "16px",
        lg: "18px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "28px",
      },
      spacing: {
        4.5: "18px",
        18: "72px",
        22: "88px",
        25: "100px",
        35: "139px",
      },
      borderRadius: {
        DEFAULT: "8px",
        sm: "5px",
        md: "10px",
        lg: "15px",
        xl: "16px",
        "2xl": "20px",
        "3xl": "100px",
      },
      boxShadow: {
        custom: "0 2px 8px rgba(0, 0, 0, 0.1)",
        sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        card: "0 4px 6px rgba(0, 0, 0, 0.1)",
        modal: "0 10px 25px rgba(0, 0, 0, 0.1)",
      },
      keyframes: {
        slideDown: {
          "0%": {
            maxHeight: "0",
            opacity: "0",
          },
          "100%": {
            maxHeight: "500px",
            opacity: "1",
          },
        },
      },
      animation: {
        "slide-down": "slideDown 0.3s ease-in-out",
      },
    },
  },
  plugins: [],
};
