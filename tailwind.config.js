/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "rgba(0, 0, 0, 0.1)",
        input: "transparent",
        ring: "oklch(0.708 0 0)",
        background: "#ffffff",
        foreground: "oklch(0.145 0 0)",
        primary: {
          DEFAULT: "#030213",
          foreground: "oklch(1 0 0)",
        },
        secondary: {
          DEFAULT: "oklch(0.95 0.0058 264.53)",
          foreground: "#030213",
        },
        destructive: {
          DEFAULT: "#d4183d",
          foreground: "#ffffff",
        },
        muted: {
          DEFAULT: "#ececf0",
          foreground: "#717182",
        },
        accent: {
          DEFAULT: "#e9ebef",
          foreground: "#030213",
        },
        popover: {
          DEFAULT: "oklch(1 0 0)",
          foreground: "oklch(0.145 0 0)",
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "oklch(0.145 0 0)",
        },
        chart: {
          "1": "oklch(0.646 0.222 41.116)",
          "2": "oklch(0.6 0.118 184.704)",
          "3": "oklch(0.398 0.07 227.392)",
          "4": "oklch(0.828 0.189 84.429)",
          "5": "oklch(0.769 0.188 70.08)",
        },
      },
      borderRadius: {
        lg: "0.625rem",
        md: "calc(0.625rem - 2px)",
        sm: "calc(0.625rem - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
