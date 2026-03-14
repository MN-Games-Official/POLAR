import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-space-grotesk)", "sans-serif"],
        body: ["var(--font-space-grotesk)", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"]
      },
      colors: {
        ink: "#06131f",
        steel: "#102437",
        mint: "#a8ffdd",
        coral: "#ff7e6d",
        sun: "#ffd36e",
        mist: "#dceaf7",
        night: "#07111d"
      },
      boxShadow: {
        glow: "0 20px 60px rgba(15, 118, 110, 0.22)",
        panel: "0 24px 64px rgba(3, 14, 23, 0.28)"
      },
      keyframes: {
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" }
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.96)", opacity: "0.24" },
          "70%, 100%": { transform: "scale(1.08)", opacity: "0" }
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        sheen: {
          "0%": { transform: "translateX(-140%) skewX(-20deg)" },
          "100%": { transform: "translateX(200%) skewX(-20deg)" }
        }
      },
      animation: {
        "float-slow": "float-slow 8s ease-in-out infinite",
        "pulse-ring": "pulse-ring 2.4s ease-out infinite",
        "slide-up": "slide-up 600ms ease-out both",
        sheen: "sheen 1.3s ease"
      },
      backgroundImage: {
        "mesh-gradient":
          "radial-gradient(circle at 12% 12%, rgba(168,255,221,0.18), transparent 26%), radial-gradient(circle at 80% 15%, rgba(255,126,109,0.22), transparent 28%), radial-gradient(circle at 55% 70%, rgba(255,211,110,0.16), transparent 30%), linear-gradient(145deg, #041019 0%, #0a1929 42%, #102437 100%)"
      }
    }
  },
  plugins: []
};

export default config;
