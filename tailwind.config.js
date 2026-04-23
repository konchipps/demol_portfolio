/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#020617",
          900: "#0b1120",
          800: "#111827"
        },
        accent: {
          500: "#ef4444",
          400: "#fb7185",
          300: "#fda4af"
        }
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(248,113,113,0.18), 0 20px 70px rgba(239,68,68,0.16)",
        panel: "0 20px 70px rgba(2, 6, 23, 0.5)"
      },
      backgroundImage: {
        "hero-grid":
          "radial-gradient(circle at top left, rgba(251, 113, 133, 0.22), transparent 28%), radial-gradient(circle at bottom right, rgba(59, 130, 246, 0.16), transparent 30%)"
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"]
      },
      animation: {
        float: "float 7s ease-in-out infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        }
      }
    }
  },
  plugins: []
};
